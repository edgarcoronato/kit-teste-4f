#!/usr/bin/env node
// verificar-skills.mjs — confere que as skills estão idênticas em .agents/skills e .claude/skills.
// Usado pelo CI do kit. Ignora as skills do OpenSpec (openspec-*), que ele gera de forma
// diferente para cada ferramenta. Roda em Windows, macOS e Linux.

import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(process.argv[2] || '.');
const pastas = ['.agents/skills', '.claude/skills'].map((p) => path.join(raiz, p));

function skills(pasta) {
  if (!fs.existsSync(pasta)) return new Set();
  return new Set(
    fs
      .readdirSync(pasta)
      .filter((n) => !n.startsWith('openspec-') && fs.statSync(path.join(pasta, n)).isDirectory()),
  );
}

function arquivos(pasta, base = pasta) {
  return fs.readdirSync(pasta).flatMap((n) => {
    const p = path.join(pasta, n);
    return fs.statSync(p).isDirectory() ? arquivos(p, base) : [path.relative(base, p)];
  });
}

const [agents, claude] = pastas.map(skills);
const problemas = [];

for (const nome of new Set([...agents, ...claude])) {
  if (!agents.has(nome)) {
    problemas.push(`${nome}: falta em .agents/skills`);
    continue;
  }
  if (!claude.has(nome)) {
    problemas.push(`${nome}: falta em .claude/skills`);
    continue;
  }
  const [a, c] = pastas.map((p) => path.join(p, nome));
  const lista = new Set([...arquivos(a), ...arquivos(c)]);
  for (const rel of lista) {
    const fa = path.join(a, rel);
    const fc = path.join(c, rel);
    if (!fs.existsSync(fa) || !fs.existsSync(fc)) {
      problemas.push(`${nome}/${rel}: existe só numa das pastas`);
    } else if (!fs.readFileSync(fa).equals(fs.readFileSync(fc))) {
      problemas.push(`${nome}/${rel}: conteúdo diferente entre as pastas`);
    }
  }
}

if (problemas.length) {
  console.error('As cópias das skills não estão iguais:');
  for (const p of problemas) console.error(`  - ${p}`);
  console.error('\nAs skills do kit não devem ser editadas no projeto. Para restaurar:');
  console.error('  node <kit>/scripts/iniciar-projeto.mjs . --atualizar-skills');
  process.exit(1);
}
console.log(`Skills conferidas: ${agents.size} idênticas nas duas pastas.`);
