---
name: tracker
description: Cria, consulta, pega e move os tickets do projeto (demandas e tarefas) seguindo o contrato de tarefas do kit, e guarda os modelos de ticket, PR e notas de execução. Use sempre que precisar registrar uma demanda nova, criar as tarefas de uma entrega, listar o que está pronto, pegar um ticket para executar, mudar o estado de um ticket (pronta, em execução, em revisão, concluída, bloqueada ou desbloqueada), ligar um PR, pedir revisão humana, registrar uma decisão ou as notas de execução, mesmo que o pedido não use a palavra "ticket". Não use para decidir o que fazer ou como planejar; isso é papel da triagem e do planejador.
metadata:
  kit: "v1"
---

# Tracker

Esta skill é a única porta para os tickets do projeto. Todos os papéis (triagem,
planejador, executor, revisor) usam as mesmas ações descritas aqui, em qualquer tracker.
Isso mantém o estado do trabalho consistente quando várias pessoas e ferramentas de
agente trabalham ao mesmo tempo.

## 1. Descobrir o tracker do projeto

1. Leia o campo **Tracker** em `docs/perfil-projeto.md`.
2. Leia a referência correspondente e siga os comandos dela:
   - GitHub Issues → `references/github.md`
   - Arquivos no repositório → `references/arquivos.md`
3. Se o campo estiver vazio ou o tracker não tiver referência aqui, **pare** e avise:
   o tracker é decidido na Fundação, e outro tracker exige acrescentar uma referência a esta skill.

## 2. Modelos

Os modelos ficam na pasta `assets/` desta skill, para estarem disponíveis em qualquer projeto:

- `assets/ticket.md` — formatos "Demanda" e "Tarefa"
- `assets/pull-request.md` — descrição de PR
- `assets/notas-execucao.md` — notas de execução

## 3. O contrato

**Campos de um ticket:** ID e título, tipo, entrega (o ticket da demanda, nas tarefas),
spec, contexto necessário, critérios de aceite, arquivos previstos, dependências,
executor, área sensível, estado e PR, notas de execução.

**Linhas fixas no início do corpo de toda tarefa**, sempre neste formato, para que as
ações consigam ler sem interpretação:

```
Entrega: #12
Dependências: #13, #14
```

Sem dependências, escreva `Dependências: nenhuma`.

**Estados e quem pode mover para cada um:**

| Estado | Significa | Quem move para cá |
| --- | --- | --- |
| `backlog` | Demanda registrada, ou tarefa ainda não liberada | Qualquer pessoa ou agente |
| `pronta` | Gates cumpridos (spec e plano aprovados); as dependências são conferidas na hora de pegar | Planejador (tarefas de entrega) ou triagem (bugs e hotfixes); ou quem desbloqueia, se outro executor deve retomar |
| `em execução` | Um executor assumiu | O próprio executor, ao pegar; o revisor, ao devolver o PR; ou quem desbloqueia, se o mesmo executor continua |
| `em revisão` | PR aberto com CI verde | O executor |
| `concluída` | Revisão aprovada e merge feito | O revisor (ou o merge, quando o tracker fecha sozinho) |
| `bloqueada` | Há um impedimento, explicado nas notas | Executor ou revisor |

**Rótulos:** `tipo:<a-classificar|feature|mudanca|bug|hotfix>`, `area-sensivel`,
`executor:<nome ou ferramenta>`.

## 4. Ações

Use estes nomes ao registrar o que fez; a referência do tracker diz como executar cada um.

| Ação | Pré-condição | Efeito |
| --- | --- | --- |
| `criar-demanda` | Nenhuma | Ticket no formato "Demanda", tipo `a-classificar`, estado `backlog` |
| `buscar` | Nenhuma | Procura tickets abertos com termos parecidos (duplicatas, entrega em andamento) |
| `classificar` | Demanda em `backlog` | Troca o tipo e registra a seção "Triagem" do ticket |
| `criar-tarefa` | Spec da entrega aprovada e publicada na branch principal | Ticket no formato "Tarefa", estado `backlog`, com as linhas fixas |
| `liberar` | Gate de plano cumprido (tarefa) ou triagem concluída (bug; hotfix confirmado) | Ticket vai para `pronta` |
| `listar-prontas` | Nenhuma | Lista os tickets `pronta` sem executor **e com todas as dependências concluídas** |
| `pegar` | Ticket `pronta`, sem executor e com dependências concluídas | Atribui a você e move para `em execução`, num passo só |
| `ligar-pr` | PR aberto | Liga PR e ticket, para o merge fechar o ticket |
| `enviar-revisao` | PR aberto e CI verde | Move para `em revisão` |
| `pedir-revisao-humana` | PR toca área sensível | Pede a revisão do PR ao dono do produto ou a um dev |
| `devolver` | Revisão reprovou o PR | Volta para `em execução`, mantendo o mesmo executor |
| `registrar-notas` | Nenhuma | Acrescenta as notas no formato de `assets/notas-execucao.md` |
| `registrar-decisao` | Nenhuma | Registra no ticket uma decisão: aprovação de gate, escolha do dono do produto, retrospectiva |
| `bloquear` | Impedimento real | Move para `bloqueada` e explica nas notas o motivo e quem precisa agir |
| `desbloquear` | Impedimento resolvido, com a decisão registrada | Volta para `em execução` com o mesmo executor; ou para `pronta`, sem executor, se outro deve retomar |
| `concluir` | Revisão aprovada e merge feito | Move para `concluída` e limpa os rótulos de estado |

## 5. Regras

- **Pegar é uma trava.** Atribuir e mover para `em execução` acontecem juntos. Depois de
  pegar, **confira de novo** o ticket: se outro executor também estiver nele (duas
  ferramentas pegaram ao mesmo tempo), quem chegou depois devolve e escolhe outro.
- **Nunca mexa em ticket de outro executor**, nem mude a atribuição dele. A exceção é
  `desbloquear`, feito por quem resolveu o impedimento.
- **Só o planejador libera tarefas de entrega; a triagem libera bugs e hotfixes.**
  Um executor nunca libera o próprio ticket.
- **`concluída` exige merge.** Ticket sem PR mergeado não é concluído. A exceção é uma
  demanda recusada pelo dono do produto: feche com o motivo registrado.
- **O tracker é a fonte do estado das tarefas.** Listas de tarefas em outros lugares
  (como o `tasks.md` do OpenSpec) são sincronizadas pelo planejador no fechamento.
- **Problema encontrado fora da tarefa** vira `criar-demanda`, nunca uma correção junto.
- **Depois de qualquer ação, informe o ID e o link do ticket**, para quem acompanha conferir.
