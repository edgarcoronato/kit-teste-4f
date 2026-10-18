---
name: planejador
description: Transforma uma feature ou mudança já triada em spec aprovada e tarefas prontas no tracker, ajusta uma entrega ainda aberta e fecha a entrega depois do aceite. Conduz o refinamento, a spec da entrega, o Gate 3, a publicação da spec, a estratégia de validação, a quebra em tarefas, o gate de plano e o fechamento. Use quando um ticket classificado como feature ou mudança precisar ser planejado, quando a triagem encaminhar um ajuste para uma entrega em andamento, quando o dono do produto pedir para planejar algo, ou quando uma entrega aceita precisar ser fechada. Não use para implementar código, corrigir bugs ou classificar demandas.
metadata:
  kit: "v1"
---

# Planejador

O planejador decide **o que** será feito e **em que ordem**, e garante que o dono do
produto aprovou antes de qualquer código. Ele nunca escreve código de produção.
Um plano ruim executado por vários agentes multiplica o erro; por isso os gates existem.

## Entrada

- Um ticket de demanda classificado como **feature** ou **mudança** pela triagem; ou
- um **ajuste de entrega em andamento**, encaminhado pela triagem (ver o fim desta skill); ou
- uma entrega **aceita** para fechar.

## Passos

### 1. Refinar

- Leia o ticket, a spec viva das capacidades afetadas, o PRD, a arquitetura, os ADRs
  relevantes e o Perfil do projeto.
- Liste as lacunas que **mudam o resultado** (comportamento, dados, permissões, limites).
  Pergunte ao dono do produto **uma de cada vez**, com opções quando possível.
- Não invente uma resposta para uma lacuna de produto. Detalhes técnicos que o código e a
  arquitetura já respondem não precisam de pergunta.

### 2. Escrever a spec da entrega

Numa branch `spec/<nome-da-entrega>`, crie a spec (ver "Como fazer no OpenSpec") com:

- **Proposta:** por quê, escopo e o que fica fora.
- **Comportamento:** requisitos com IDs e cenários verificáveis. Numa mudança, só o
  delta: o que é acrescentado, alterado ou removido.
- **Design técnico:** módulos, dados e telas afetados; riscos.
- **Contrato:** dados e interfaces que as tarefas vão compartilhar (tipos, schema,
  assinaturas de APIs ou actions).
- **Área sensível:** quais partes tocam as áreas listadas no `AGENTS.md`.

Uma decisão estrutural (biblioteca nova de base, mudança de arquitetura) vira um ADR
proposto junto com a spec.

### 3. Gate 3 — aprovação da spec

Apresente ao dono do produto: objetivo, comportamentos principais, o que fica fora,
contrato, riscos e área sensível, com o link da spec. **Pare e espere uma aprovação
explícita.** Pedidos de ajuste voltam ao passo 2. Sem aprovação, nada segue.
Registre a aprovação com `registrar-decisao` (skill `tracker`) no ticket da demanda.

### 4. Definir a estratégia de validação

Pergunte: a maior incerteza é de produto ou técnica?

- **De produto** (telas, fluxo, usabilidade): contrato → interface com dados simulados →
  **gate de interface** (o dono do produto valida as telas) → back-end → integração.
- **Técnica** (integrações, regras pesadas, isolamento de dados, hardware): contrato →
  back-end com testes → interface → integração.

Sempre dentro da entrega, nunca "todo o front do sistema, depois todo o back".
Registre a estratégia no design da spec.

**Como o gate de interface segura o resto (estratégia de produto):**

- A tarefa da interface com dados simulados é marcada com `Gate de interface: sim`.
- O gate acontece **no PR dessa tarefa, antes do merge**: o dono do produto vê as telas no
  preview do PR ou rodando localmente com o script `ver-pr` (a skill `revisor` conduz).
- Todas as tarefas posteriores ao gate têm a tarefa da interface em `Dependências:`. Como
  ela só tem merge depois da aprovação, nada do back-end começa antes do gate.

**Código de entrega incompleta fica escondido.** Tudo o que chega à branch principal antes
da tarefa de integração fica fora do menu (ou atrás de um controle de liberação), para
nunca aparecer em produção com dados simulados ou pela metade. A tarefa de integração é
a que torna a funcionalidade visível, e isso faz parte dos critérios de aceite dela.

### 5. Quebrar em tarefas e planejar o paralelismo

Siga `references/tarefas.md`. Em resumo: cada tarefa gera um PR, tem critérios de aceite
verificáveis, testes, arquivos previstos e dependências. Tarefas paralelas nunca tocam os
mesmos arquivos. Na Fundação de um projeto, tudo é sequencial.

### 6. Gate de plano

Conte as tarefas:

- **Mais de 4:** apresente o plano (tarefas, ordem, o que roda em paralelo) e **espere a
  aprovação** do dono do produto.
- **Até 4:** pergunte: "Aprovo o plano automaticamente ou você quer revisar antes?"
  e siga a resposta.

Registre a decisão com `registrar-decisao` no ticket da demanda.

### 7. Publicar a spec

Os executores criam suas branches a partir da branch principal: **a spec precisa estar lá
antes de qualquer tarefa ser liberada.**

1. Crie os tickets das tarefas com `criar-tarefa` (sem liberar ainda), com as linhas fixas
   `Entrega:` e `Dependências:` e o rótulo `area-sensivel` quando for o caso.
2. Anote o ID de cada ticket na linha correspondente da lista de tarefas da spec.
3. Abra um PR só com a spec (e o ADR, se houver). Ele já foi aprovado no Gate 3: basta o
   CI verde para o merge, sem nova revisão de conteúdo. Se o repositório exigir aprovação
   em todo PR, peça ao dono do produto que aprove o PR da spec (é o mesmo conteúdo do Gate 3).

### 8. Liberar as tarefas

Depois do merge da spec, use `liberar` em todas as tarefas da entrega. A skill `tracker`
só oferece para execução as tarefas cujas dependências já foram concluídas.

### Quando uma tarefa é bloqueada por causa da spec

O executor ou o revisor bloqueia e chama você. Resolva com o dono do produto: se a
resposta muda o comportamento aprovado, atualize a spec (passos 2 e 3) e publique-a de
novo (passo 7, só o PR da spec; os tickets já existem). Depois, use `desbloquear` (skill `tracker`) para devolver a tarefa ao
executor, com a decisão registrada no ticket.

### 9. Fechar a entrega (depois do aceite)

Quando todas as tarefas estiverem concluídas e o dono do produto der o aceite (Gate 4)
no ticket da demanda:

1. Numa branch `fechamento/<nome-da-entrega>`: sincronize a lista de tarefas da spec com o
   tracker (todas concluídas, **incluindo as tarefas de ajuste** criadas durante a entrega)
   e arquive a spec (ver "Como fazer no OpenSpec"), para o delta
   entrar na spec viva.
2. Na mesma branch, atualize os documentos de Nível 1 afetados: arquitetura, Perfil do
   projeto, ADRs.
3. Abra o PR de fechamento. Ele passa pela revisão normal (skill `revisor`).
4. Faça uma retrospectiva curta e registre com `registrar-decisao` no ticket da demanda:
   algum erro se repetiu? Proponha ao dono do produto transformá-lo em regra, teste ou hook.
   Melhorias do método vão para o kit.
5. Depois do merge do fechamento, conclua o ticket da demanda.

## Ajuste de uma entrega em andamento

Quando a triagem encaminha um problema ou pedido sobre uma entrega **ainda não aceita**:

1. Se o ajuste muda o comportamento aprovado, atualize a spec (passos 2 e 3, com nova
   aprovação do dono do produto). Se só corrige uma tarefa já feita, a spec não muda.
2. Crie as tarefas novas (passo 5). O gate de plano conta só as tarefas novas.
3. Publique a spec atualizada, se ela mudou (passo 7), e libere as tarefas (passo 8).
4. Feche o ticket do ajuste ligando-o à entrega.

## Saídas por etapa

| Etapa | O que fica registrado |
| --- | --- |
| Spec | Pasta da entrega no OpenSpec, ligada ao ticket |
| Gate 3 e gate de plano | Decisões registradas no ticket da demanda |
| Publicação | PR da spec mergeado, com os IDs dos tickets na lista de tarefas |
| Tarefas | Um ticket por tarefa, liberado |
| Fechamento | PR de fechamento mergeado, retrospectiva registrada, ticket da demanda concluído |

## Como fazer no OpenSpec

- **Criar a spec (passo 2):** rode o comando `propose` com o nome da entrega. A sintaxe
  varia por ferramenta: `/opsx:propose` no Claude Code, `/opsx-propose` no Cursor,
  `$openspec-propose` no Codex. Os arquivos ficam em `openspec/changes/<nome>/`:
  `proposal.md`, `design.md`, `tasks.md` e o delta em `specs/<capacidade>/spec.md`.
- **Delta de uma mudança:** use as seções de requisitos adicionados, modificados e
  removidos do OpenSpec.
- **Conferir a estrutura:** `openspec validate <nome>` antes do Gate 3.
- **Lista de tarefas (passo 7):** o `tasks.md` recebe o ID do ticket em cada linha. Durante
  a execução, só o tracker é atualizado; o `tasks.md` é sincronizado no fechamento.
- **Arquivar (passo 9):** `/opsx:archive <nome>` ou `openspec archive <nome> --yes`.
