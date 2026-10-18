<!-- kit-desenvolvimento -->
# AGENTS.md — [PREENCHER: nome do projeto]

> Instruções para qualquer agente de IA ou dev que trabalhe neste repositório.
> Leia inteiro antes de começar. Este arquivo é uma lista de verificação; os detalhes
> ficam nos documentos linkados em "Onde ler mais". Modelo do kit de desenvolvimento v1.

## Projeto

[PREENCHER: o que o sistema faz, para quem e o principal limite, em até 3 linhas.]

## Comandos

| Ação | Comando |
| --- | --- |
| Instalar dependências | `[PREENCHER]` |
| Rodar localmente | `[PREENCHER]` |
| Lint | `[PREENCHER]` |
| Typecheck | `[PREENCHER]` |
| Testes | `[PREENCHER]` |
| Build | `[PREENCHER]` |

Rode lint, typecheck e testes antes de abrir qualquer PR.

## Mapa do repositório

- `[PREENCHER: pasta]` — [PREENCHER: o que fica aqui]
- `docs/` — PRD, arquitetura, Perfil do projeto, roadmap e ADRs
- `openspec/specs/` — spec viva: como o sistema funciona hoje
- `openspec/changes/` — specs das entregas em andamento

## Antes de qualquer tarefa

1. Trabalhe só em um ticket `pronta` e sem dono. Atribua a você e mova para `em execução` no mesmo passo.
2. Crie a branch `tipo/ID-descricao` (ex.: `feature/42-exportar-clientes`).
3. Leia o ticket, a spec da entrega e só os documentos que o ticket aponta.
4. Faça a menor mudança que atende aos critérios de aceite, com testes. Nada fora do escopo.
5. Atualize a branch com a principal e rode lint, typecheck e testes. Abra o PR com o modelo, mova o ticket para `em revisão` e registre as notas de execução.
6. Spec errada, dependência faltando ou dúvida de produto: mova para `bloqueada` e explique. Não improvise.

Encontrou um problema fora da sua tarefa? Abra um ticket novo; não corrija junto.

## Aprovações humanas

- **Spec da entrega:** aprovada pelo dono do produto antes de criar tarefas.
- **Plano:** mais de 4 tarefas → aprovação obrigatória; até 4 → perguntar se aprova automaticamente ou se quer revisar.
- **Interface:** quando a incerteza é de produto, as telas são validadas com dados simulados antes do back-end.
- **Aceite:** o dono do produto confere o resultado antes do fechamento.
- **Quem executa nunca revisa o próprio PR.**

## Áreas sensíveis

PRs que tocam estas áreas exigem revisão humana, além do revisor agente.
Marque o ticket e o PR com o rótulo `area-sensivel`.

- [PREENCHER: área] — `[PREENCHER: caminho]`
- [PREENCHER: área] — `[PREENCHER: caminho]`

## Padrões essenciais

- Uma responsabilidade por arquivo, função e componente.
- Até cerca de [400] linhas por arquivo e [80] por função; acima disso, divida.
- Comentários explicam o porquê e, brevemente, o quê. Regra de negócio não óbvia cita o ID do requisito na spec.
- `TODO` só com o ID de um ticket. Código desativado é apagado (o git guarda o histórico).
- Toda tarefa que muda comportamento entrega teste (sem comportamento: typecheck e build); todo bug entrega um teste de regressão que falha sem a correção.
- Uma tarefa gera um PR, com até cerca de 300 a 400 linhas alteradas (sem contar gerados e lockfiles).
- Dependência nova só com justificativa no PR.
- Funcionalidade incompleta fica escondida (fora do menu ou atrás de um controle de liberação) até a tarefa de integração.
- Nomes no código: [PREENCHER: idioma]. Comentários: [PREENCHER: idioma].

Detalhes da stack: skill `padroes-de-codigo` e as skills listadas no Perfil do projeto.

## Nunca faça

- Commitar segredos, tokens ou valores de `.env`.
- Rodar comandos contra produção ou contra dados reais.
- Alterar uma migration já aplicada; crie uma nova.
- Pular, desativar ou enfraquecer testes para o CI passar.
- Mudar o escopo da tarefa sem bloquear e avisar.
- Pegar um ticket atribuído a outro executor.
- Fazer push forçado na branch principal ou merge sem revisão.

## Specs (OpenSpec)

- O comportamento atual está em `openspec/specs/`. Leia antes de mudar uma capacidade.
- Cada entrega tem sua pasta em `openspec/changes/<nome>/`: proposta, delta, design e `tasks.md`.
- **Não altere o `tasks.md` durante a execução.** O estado das tarefas fica no tracker; o
  planejador sincroniza o `tasks.md` no fechamento (evita conflito entre PRs paralelos).

### Como fazer no OpenSpec

- Criar a spec de uma entrega: `propose` (só o planejador).
- Implementar: `apply`, informando a tarefa do seu ticket e implementando só ela.
- Conferir a estrutura: `openspec validate`.
- Arquivar no fechamento: `archive` (só o planejador, depois do aceite).

## Tracker

Tracker deste projeto: Arquivos no repositório.
Use sempre a skill `tracker` para criar, pegar e mover tickets.

## Onde ler mais

- Perfil do projeto (stack, skills, testes, deploy): `docs/perfil-projeto.md`
- Arquitetura: `docs/arquitetura.md`
- Produto: `docs/prd.md`
- Decisões: `docs/adr/`
- Método completo: [PREENCHER: link para o kit]

## Manutenção deste arquivo

Mantenha-o curto: cada regra precisa de um motivo real. Um erro recorrente de agente vira
uma regra aqui ou, de preferência, um teste, lint ou hook. Regras que perderam o motivo saem.

<!-- Conteúdo que já existia neste arquivo antes do kit (preservado): -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
