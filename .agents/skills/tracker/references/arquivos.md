# Tracker: arquivos no repositório

Bom para trabalho solo ou sequencial. **Não use com executores em paralelo:** cada branch
vê sua própria cópia dos arquivos, então a trava só vale depois que a mudança chega à
branch principal. Com mais de um executor ao mesmo tempo, use o GitHub.

## Como o contrato vira arquivos

- Um arquivo por ticket em `tickets/<NNNN>-<slug>.md`, com numeração sequencial
  (`0001`, `0002`…), no formato de `assets/ticket.md` desta skill.
- Os campos de controle ficam no topo do arquivo; `entrega` e `dependencias` substituem
  as linhas fixas usadas em outros trackers:

```yaml
---
id: "0007"
tipo: tarefa         # a-classificar | feature | mudanca | bug | hotfix | tarefa
estado: pronta       # backlog | pronta | em-execucao | em-revisao | concluida | bloqueada
entrega: "0004"      # ticket da demanda (só em tarefas)
dependencias: ["0005"]
executor: ""         # vazio até alguém pegar
area_sensivel: false
gate_interface: false
spec: openspec/changes/exportar-clientes/
pr: ""
---
```

- Notas de execução e decisões: seções "Notas de execução" e "Decisões" no fim do próprio arquivo.

## Comandos por ação

| Ação | Como fazer |
| --- | --- |
| `criar-demanda` | Criar `tickets/<próximo número>-<slug>.md` com o formato "Demanda", `tipo: a-classificar`, `estado: backlog` |
| `buscar` | `grep -il "<termo>" tickets/*.md` e conferir o `estado:` de cada resultado |
| `classificar` | Trocar `tipo:` e preencher a seção "Triagem" |
| `criar-tarefa` | Criar o arquivo com o formato "Tarefa", `estado: backlog`, `entrega:`, `dependencias:` e o caminho da spec |
| `liberar` | Trocar para `estado: pronta` |
| `listar-prontas` | `grep -l "^estado: pronta" tickets/*.md` e descartar os que têm `executor:` preenchido ou alguma dependência sem `estado: concluida` |
| `pegar` | Na branch principal: `estado: em-execucao` e `executor: <ferramenta>`; commit e push **antes** de criar a branch da tarefa |
| `ligar-pr` | Preencher `pr:` com o link e citar o ticket na descrição do PR |
| `enviar-revisao` | Trocar para `estado: em-revisao` |
| `pedir-revisao-humana` | Pedir a revisão no PR (pelo serviço de Git usado) e anotar no ticket qual área sensível foi tocada |
| `devolver` | Trocar para `estado: em-execucao`, mantendo o `executor:` |
| `registrar-notas` | Acrescentar as notas na seção "Notas de execução" |
| `registrar-decisao` | Acrescentar uma linha na seção "Decisões": o quê, quem decidiu, data |
| `bloquear` | Trocar para `estado: bloqueada` e explicar nas notas |
| `desbloquear` | Trocar para `estado: em-execucao` (mesmo executor) ou para `estado: pronta` com `executor: ""` (outro executor), e registrar a decisão |
| `concluir` | Trocar para `estado: concluida` depois do merge |
| recusar demanda | `estado: concluida` e o motivo nas notas |

Commits que só mexem em tickets usam a mensagem `chore(tracker): <ação> <id>`, para
ficarem fáceis de filtrar no histórico.
