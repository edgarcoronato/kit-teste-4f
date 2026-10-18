#!/usr/bin/env node
// ver-pr.mjs — roda um PR (ou uma branch) na sua máquina para o gate de interface, numa
// pasta temporária separada, sem mexer no que você está fazendo. Parte do kit de
// desenvolvimento. Roda em Windows, macOS e Linux (Node.js 20.19+, git; gh para PRs).
//
// Uso:
//   node scripts/kit/ver-pr.mjs 31              PR 31 do GitHub
//   node scripts/kit/ver-pr.mjs --branch nome   branch (para o tracker em arquivos)
//
// Opções:
//   --porta <n>         Porta do app (padrão: 3100, para não colidir com o seu npm run dev)
//   --rota </caminho>   Rota a abrir no navegador (padrão: a que o PR indicar, ou /)
//   --comando "<cmd>"   Comando que sobe o app (padrão: npm run dev)
//   --instalar "<cmd>"  Comando que instala as dependências (padrão: npm ci)
//   --sem-instalar      Pula a instalação
//   --sem-navegador     Não abre o navegador
//   --manter            Não apaga a pasta temporária no fim
//
// Variáveis de ambiente: copia .env.local e .env.development.local do seu projeto. Elas
// devem apontar para desenvolvimento ou teste, nunca para produção (regra do kit).

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const WIN = process.platform === 'win32';
const ARQUIVOS_ENV = ['.env.local', '.env.development.local'];

function lerArgumentos(argv) {
  const op = { porta: 3100, navegador: true, instalar: undefined, manter: false };
  const valor = (i, nome) => {
    if (i >= argv.length || argv[i].startsWith('--'))
      throw new Error(`${nome} precisa de um valor.`);
    return argv[i];
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--porta') op.porta = Number(valor(++i, a));
    else if (a === '--rota') op.rota = valor(++i, a);
    else if (a === '--comando') op.comando = valor(++i, a);
    else if (a === '--instalar') op.instalar = valor(++i, a);
    else if (a === '--branch') op.branch = valor(++i, a);
    else if (a === '--sem-instalar') op.instalar = null;
    else if (a === '--sem-navegador') op.navegador = false;
    else if (a === '--manter') op.manter = true;
    else if (a === '--ajuda' || a === '-h') op.ajuda = true;
    else if (/^\d+$/.test(a) && !op.pr) op.pr = a;
    else throw new Error(`Opção desconhecida: ${a}`);
  }
  if (!op.ajuda && !op.pr === !op.branch)
    throw new Error('Informe o número do PR ou --branch <nome>.');
  if (!Number.isInteger(op.porta) || op.porta < 1 || op.porta > 65535) {
    throw new Error('--porta precisa ser um número entre 1 e 65535.');
  }
  return op;
}

function rodar(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: WIN });
  return { ok: r.status === 0, saida: `${r.stdout || ''}${r.stderr || ''}`.trim() };
}

function exigir(r, mensagem) {
  if (!r.ok) throw new Error(`${mensagem}\n${r.saida}`);
  return r.saida;
}

function lerPr(raiz, numero) {
  if (!rodar('gh', ['--version'], raiz).ok) {
    throw new Error('gh não encontrado. Instale a CLI do GitHub ou use --branch <nome>.');
  }
  const campos = 'number,title,url,state,headRefName,body';
  const json = exigir(
    rodar('gh', ['pr', 'view', numero, '--json', campos], raiz),
    `Não consegui ler o PR ${numero} (o gh está logado? o PR existe neste repositório?).`,
  );
  return JSON.parse(json);
}

// A rota que o executor indica no PR, na linha "Como ver as telas" (modelo do kit).
function rotaDoPr(corpo) {
  const linha = (corpo || '').split('\n').find((l) => /como ver as telas/i.test(l)) || '';
  const m = linha.match(/`(\/[^`\s]*)`/) || linha.match(/(?:^|\s)(\/[\w\-/[\]?=&.]*)/);
  return m ? m[1] : undefined;
}

function prepararPasta(raiz, nome) {
  const pasta = path.join(os.tmpdir(), 'kit-ver-pr', `${path.basename(raiz)}-${nome}`);
  if (fs.existsSync(pasta)) limparPasta(raiz, pasta); // sobra de uma execução interrompida
  fs.mkdirSync(path.dirname(pasta), { recursive: true });
  return pasta;
}

function criarCopia(raiz, op, pasta) {
  let ref = op.branch;
  if (op.pr) {
    exigir(
      rodar('git', ['fetch', '--quiet', 'origin', `pull/${op.pr}/head`], raiz),
      `Não consegui baixar o PR ${op.pr} do remoto origin.`,
    );
    ref = 'FETCH_HEAD';
  } else if (!rodar('git', ['rev-parse', '--verify', '--quiet', ref], raiz).ok) {
    exigir(
      rodar('git', ['fetch', '--quiet', 'origin', ref], raiz),
      `A branch ${ref} não existe aqui nem no remoto origin.`,
    );
    ref = 'FETCH_HEAD';
  }
  exigir(
    rodar('git', ['worktree', 'add', '--detach', pasta, ref], raiz),
    'Não consegui criar a cópia temporária (git worktree).',
  );
  const copiados = [];
  for (const nome of ARQUIVOS_ENV) {
    const origem = path.join(raiz, nome);
    if (fs.existsSync(origem)) {
      fs.copyFileSync(origem, path.join(pasta, nome));
      copiados.push(nome);
    }
  }
  return copiados;
}

function limparPasta(raiz, pasta) {
  rodar('git', ['worktree', 'remove', '--force', pasta], raiz);
  // No Windows, arquivos podem ficar presos por alguns instantes depois que o app fecha.
  fs.rmSync(pasta, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  rodar('git', ['worktree', 'prune'], raiz);
}

function comandoPadrao(pasta, op) {
  const temPacote = fs.existsSync(path.join(pasta, 'package.json'));
  let instalar = op.instalar;
  if (instalar === undefined) {
    if (fs.existsSync(path.join(pasta, 'package-lock.json'))) instalar = 'npm ci';
    else instalar = temPacote ? 'npm install' : null;
  }
  const comando = op.comando || (temPacote ? 'npm run dev' : null);
  if (!comando)
    throw new Error('Sem package.json: informe como subir o app com --comando "<cmd>".');
  return { instalar, comando };
}

function abrirNavegador(url) {
  if (WIN) spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref();
  else {
    const cmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
    spawn(cmd, [url], { stdio: 'ignore', detached: true })
      .on('error', () => {})
      .unref();
  }
}

// Espera o app responder (qualquer resposta HTTP serve) por até 3 minutos.
async function esperarApp(url, filho) {
  const limite = Date.now() + 180_000;
  while (Date.now() < limite && rodando(filho)) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(2000) });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return false;
}

const rodando = (filho) => filho.exitCode === null && filho.signalCode === null;

function encerrar(filho) {
  if (!rodando(filho)) return;
  // No Windows o Ctrl+C não chega a todos os processos do app: encerra a árvore inteira.
  if (WIN) spawnSync('taskkill', ['/pid', String(filho.pid), '/T', '/F'], { stdio: 'ignore' });
  else filho.kill('SIGINT');
}

function imprimirPronto(titulo, url, op, envs) {
  console.log('\n' + '='.repeat(70));
  console.log(`  ${titulo}`);
  console.log(`  Abra: ${url}`);
  if (envs.length)
    console.log(`  Variáveis copiadas: ${envs.join(', ')} (só desenvolvimento/teste)`);
  else
    console.log('  Nenhum .env.local encontrado: se o app precisar de variáveis, ele pode falhar.');
  console.log('  Valide as telas e responda no PR ou no ticket ("Aprovo a interface" ou ajustes).');
  console.log(`  Ctrl+C encerra${op.manter ? '' : ' e apaga a cópia temporária'}.`);
  console.log('='.repeat(70) + '\n');
}

async function principal() {
  const op = lerArgumentos(process.argv.slice(2));
  if (op.ajuda) {
    console.log(
      fs
        .readFileSync(new URL(import.meta.url), 'utf8')
        .split('\n')
        .slice(1, 20)
        .map((l) => l.replace(/^\/\/ ?/, ''))
        .join('\n'),
    );
    return;
  }
  const raiz = exigir(
    rodar('git', ['rev-parse', '--show-toplevel'], process.cwd()),
    'Rode este script dentro do repositório do projeto.',
  );
  const pr = op.pr ? lerPr(raiz, op.pr) : null;
  if (pr && pr.state !== 'OPEN') console.log(`Atenção: o PR ${op.pr} está ${pr.state}.`);
  const titulo = pr ? `PR ${pr.number}: ${pr.title}` : `Branch ${op.branch}`;
  const rota = op.rota || rotaDoPr(pr?.body) || '/';

  if (!(await portaLivre(op.porta))) {
    throw new Error(`A porta ${op.porta} está ocupada (outro app rodando?). Use --porta <outra>.`);
  }

  const pasta = prepararPasta(raiz, op.pr ? `pr-${op.pr}` : op.branch.replace(/[^\w.-]/g, '-'));
  console.log(`Preparando ${titulo} em ${pasta} ...`);
  const envs = criarCopia(raiz, op, pasta);
  const limpar = () => {
    if (!op.manter) limparPasta(raiz, pasta);
  };

  try {
    const { instalar, comando } = comandoPadrao(pasta, op);
    if (instalar) {
      console.log(`\n$ ${instalar}`);
      const r = spawnSync(instalar, { cwd: pasta, shell: true, stdio: 'inherit' });
      if (r.status !== 0) throw new Error(`A instalação falhou (${instalar}).`);
    }
    await subirApp(comando, pasta, op, { titulo, rota, envs }, limpar);
  } catch (e) {
    limpar();
    throw e;
  }
}

function portaLivre(porta) {
  return new Promise((resolve) => {
    const teste = net.createServer().once('error', () => resolve(false));
    teste.listen(porta, () => teste.close(() => resolve(true)));
  });
}

async function subirApp(comando, pasta, op, info, limpar) {
  console.log(`\n$ ${comando}   (PORT=${op.porta})`);
  const env = { ...process.env, PORT: String(op.porta) };
  // Fora do Windows, `exec` faz o shell dar lugar ao app, para o sinal de encerrar chegar
  // nele mesmo quando não vem do terminal. Comandos compostos (&&, |, ;) ficam como estão.
  const linha = WIN || /[;&|]/.test(comando) ? comando : `exec ${comando}`;
  const filho = spawn(linha, { cwd: pasta, shell: true, stdio: 'inherit', env });
  process.on('SIGINT', () => encerrar(filho));
  process.on('SIGTERM', () => encerrar(filho));
  const fim = new Promise((resolve) => filho.on('exit', resolve));

  const url = `http://localhost:${op.porta}${info.rota}`;
  if (await esperarApp(url, filho)) {
    imprimirPronto(info.titulo, url, op, info.envs);
    if (op.navegador) abrirNavegador(url);
  } else if (rodando(filho)) {
    console.log(`\nO app não respondeu em ${url} depois de 3 minutos; confira a saída acima.`);
  } else {
    console.log(
      `\nO app encerrou antes de responder (código ${filho.exitCode}); veja a saída acima.`,
    );
  }
  const codigo = await fim;
  limpar();
  if (op.manter)
    console.log(`\nCópia mantida em ${pasta}\nPara apagar: git worktree remove --force "${pasta}"`);
  else console.log('\nCópia temporária apagada.');
  process.exitCode = codigo && codigo !== 130 ? codigo : 0;
}

principal().catch((e) => {
  console.error(`\nErro: ${e.message}`);
  process.exit(1);
});
