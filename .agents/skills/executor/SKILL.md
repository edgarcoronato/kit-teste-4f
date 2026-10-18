---
name: executor
description: Executa uma tarefa pronta do tracker seguindo o protocolo do kit - pegar o ticket, preparar a branch, ler só o contexto apontado, implementar com testes, verificar, abrir o PR e registrar as notas de execução. Use sempre que for implementar ou codar algo que tem um ticket de tarefa, inclusive quando o pedido for "implemente a próxima tarefa", "pegue o ticket 42" ou "continue a entrega X", e quando um PR seu voltar da revisão. Não use para planejar, revisar PRs, classificar demandas ou corrigir bugs (use a skill bug).
metadata:
  kit: "v1"
---

# Executor

O executor implementa **uma tarefa por vez**, exatamente como foi planejada e aprovada.
Ele não decide escopo: se a tarefa está errada, ele bloqueia e devolve, em vez de
improvisar. Isso mantém várias pessoas e ferramentas trabalhando em paralelo sem conflito.

## Protocolo

### 1. Pegar

- Use `listar-prontas` e `pegar` (skill `tracker`). Se o pedido citar um ticket
  específico, confira se ele está `pronta`, sem executor e com as dependências concluídas.
- **Confira a trava** depois de pegar. Se outro executor também estiver no ticket,
  devolva e escolha outro.
- **Nada disponível?** Informe quais tarefas da entrega estão esperando dependências ou
  em execução por outro executor, e pare. Não pegue tarefa bloqueada, de outro executor
  ou com dependência aberta.

### 2. Preparar

- Crie a branch `tipo/ID-descricao` a partir da branch principal atualizada
  (por exemplo, `feature/42-exportar-clientes`). Em paralelo com outras tarefas, use
  uma worktree própria.
- Leia **só** o ticket, o trecho da spec e os documentos que o ticket aponta. Ler o
  projeto inteiro gasta contexto e aumenta a chance de mexer no que não devia.
- Carregue a skill `padroes-de-codigo` e as skills da stack que o Perfil do projeto lista
  para o tipo de código que você vai escrever.

### 3. Executar

- **Teste primeiro, quando fizer sentido:** transforme os critérios de aceite em testes,
  rode e veja falhar pelo motivo esperado. Depois implemente. Tarefa sem comportamento
  (só tipos ou configuração) é verificada por typecheck e build.
- Faça **a menor mudança** que atende aos critérios. Melhorias fora da tarefa viram uma
  demanda nova (`criar-demanda`), não parte deste PR.
- Mexa nos **arquivos previstos**. Se precisar tocar outro arquivo, tudo bem quando for
  inevitável; registre o motivo nas notas.
- Respeite o **contrato** da spec (tipos, schema, assinaturas). Mudar o contrato é mudar
  a spec: bloqueie.
- **Migration:** crie uma nova; nunca altere uma migration já aplicada. Verifique
  aplicando-a num banco local ou de teste e conferindo o estado (e a reversão, quando
  existir); registre os comandos nas notas. Nunca em produção.
- **Estratégia de produto:** se a tarefa é a interface com dados simulados, não implemente
  o back-end junto; ele vem depois do gate de interface.
- **Funcionalidade escondida até a integração.** Antes da tarefa de integração, o que você
  entrega fica fora do menu (ou atrás do controle de liberação do projeto). A tarefa de
  integração é a que torna a funcionalidade visível.

### 4. Verificar

- Rode lint, typecheck e testes localmente. Todos passando.
- Em mudanças de interface, abra a tela e confira os estados principais (carregando,
  vazio, erro, sucesso). Use a skill de testes de interface do projeto, se houver.
- Passe pelo checklist "Antes de entregar" da skill `padroes-de-codigo`.

### 5. Entregar

1. Commits pequenos, com mensagem que cita o ID do ticket.
2. **Atualize a branch com a principal** (merge ou rebase, conforme o Perfil do projeto),
   resolva os conflitos e rode lint, typecheck e testes de novo. Outras tarefas e hotfixes
   podem ter entrado enquanto você trabalhava.
3. Abra o PR com o modelo (`assets/pull-request.md` da skill `tracker`) e `Closes #<n>`
   (ou a referência do ticket), marcando se toca área sensível. Se o ticket tem
   `Gate de interface: sim`, preencha no PR como ver as telas: o link do preview ou a rota
   a abrir entre crases (por exemplo `/relatorios`). O script `ver-pr` lê essa rota e abre
   o navegador nela. Diga também se a tela precisa de algum dado ou login de teste.
4. Use `ligar-pr`. Quando o CI ficar verde, use `enviar-revisao`. CI vermelho: corrija
   antes de enviar.
5. Use `registrar-notas` no formato de `assets/notas-execucao.md` da skill `tracker`: o
   que foi feito, decisões, desvios, testes executados e pendências.

### 6. Bloquear em vez de improvisar

Use `bloquear`, com o motivo e quem precisa agir, quando:

- a spec está errada, incompleta ou contradiz o código existente;
- falta uma dependência que deveria estar pronta;
- surge uma dúvida de produto que muda o resultado;
- a tarefa ficou bem maior do que o planejado.

## Quando o PR volta da revisão

O revisor devolve o ticket para `em execução`, com você ainda como executor.

1. Leia todos os comentários antes de mudar qualquer coisa.
2. Corrija o que foi apontado, sem aproveitar para mudar outras coisas.
3. Some 1 em "Rodadas de revisão" nas notas e registre o que mudou.
4. Atualize a branch com a principal de novo e envie com `enviar-revisao` quando o CI
   ficar verde.

## Quando a tarefa é desbloqueada

Quem resolveu o impedimento usa `desbloquear` e registra a decisão no ticket. Leia a
decisão (e a spec, se foi atualizada), atualize a branch com a principal e continue de
onde parou.

Se discordar de um apontamento, explique no PR em vez de ignorar. Se o desacordo for
sobre o que a spec pede, bloqueie e chame o planejador.

## Como fazer no OpenSpec

- A spec da entrega está em `openspec/changes/<nome>/`. Leia o trecho que o ticket aponta
  e o design.
- Para implementar, use o comando `apply` do OpenSpec (`/opsx:apply` no Claude Code; nas
  outras ferramentas, com a mesma variação de sintaxe do `propose`) **informando a tarefa
  do seu ticket**, e implemente só ela.
- **Não altere o `tasks.md`.** Tarefas paralelas editando o mesmo arquivo geram conflito;
  o estado da tarefa fica no tracker, e o planejador sincroniza o `tasks.md` no fechamento.
  Se o `apply` marcar a tarefa no `tasks.md`, desfaça essa alteração antes do commit.
- Nunca rode `propose` nem `archive`: são do planejador.
