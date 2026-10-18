# Tracker: GitHub Issues

Use a CLI `gh`, que funciona em qualquer ferramenta de agente e também para devs.
Se a ferramenta tiver um servidor MCP do GitHub conectado, ele pode ser usado no lugar,
com o mesmo resultado.

## Como o contrato vira GitHub

| Contrato | No GitHub |
| --- | --- |
| Ticket | Issue |
| Estado | Rótulo `estado:<backlog\|pronta\|em-execucao\|em-revisao\|bloqueada>`; `concluída` = issue fechada |
| Tipo | Rótulo `tipo:<a-classificar\|feature\|mudanca\|bug\|hotfix>` |
| Executor | Rótulo `executor:<nome ou ferramenta>`, mais o assignee quando for uma pessoa |
| Área sensível | Rótulo `area-sensivel` |
| Entrega e dependências | Linhas fixas no início do corpo: `Entrega: #12` e `Dependências: #13, #14` (ou `nenhuma`) |
| Notas de execução e decisões | Comentários na issue |
| Ligação com PR | `Closes #<número>` na descrição do PR |

O rótulo `executor:` é necessário porque agentes costumam usar a mesma conta do GitHub
que você: só o assignee não diria qual ferramenta está trabalhando.

Os rótulos são a fonte do estado. Um quadro do GitHub Projects para terceiros, se existir,
apenas exibe essa informação.

## Comandos por ação

| Ação | Comando |
| --- | --- |
| `criar-demanda` | `gh issue create --title "<título>" --body-file <arquivo> --label "tipo:a-classificar,estado:backlog"` |
| `buscar` | `gh issue list --state open --search "<termos>" --json number,title,labels` |
| `classificar` | `gh issue edit <n> --remove-label "tipo:a-classificar" --add-label "tipo:<tipo>"` e `gh issue comment <n> --body-file <triagem.md>` |
| `criar-tarefa` | `gh issue create --title "<título>" --body-file <arquivo> --label "tipo:<tipo>,estado:backlog"` (acrescente `area-sensivel` quando for o caso); o corpo começa com as linhas `Entrega:` e `Dependências:` |
| `liberar` | `gh issue edit <n> --remove-label "estado:backlog" --add-label "estado:pronta"` |
| `listar-prontas` | `gh issue list --state open --label "estado:pronta" --json number,title,labels,body`; descarte as que têm rótulo `executor:` e as que, na linha `Dependências:`, citam alguma issue ainda aberta (`gh issue view <dep> --json state`) |
| `pegar` | `gh issue edit <n> --remove-label "estado:pronta" --add-label "estado:em-execucao,executor:<ferramenta>"` e, para pessoas, `--add-assignee @me` |
| conferir a trava | `gh issue view <n> --json labels,assignees`: deve haver um único rótulo `executor:` |
| `ligar-pr` | `gh pr create --title "<título>" --body-file <pr.md>`, com `Closes #<n>` no corpo |
| `enviar-revisao` | `gh issue edit <n> --remove-label "estado:em-execucao" --add-label "estado:em-revisao"` |
| `pedir-revisao-humana` | `gh pr edit <pr> --add-reviewer <usuário>` e um comentário no PR dizendo qual área sensível foi tocada |
| `devolver` | `gh issue edit <n> --remove-label "estado:em-revisao" --add-label "estado:em-execucao"` (o rótulo `executor:` continua) |
| `registrar-notas` | `gh issue comment <n> --body-file <notas.md>` |
| `registrar-decisao` | `gh issue comment <n> --body "Decisão: <o quê> — <quem decidiu> — <data>"` |
| `bloquear` | `gh issue edit <n> --remove-label "estado:em-execucao" --add-label "estado:bloqueada"` e um comentário com o motivo |
| `desbloquear` | Mesmo executor: `gh issue edit <n> --remove-label "estado:bloqueada" --add-label "estado:em-execucao"`. Outro executor: `gh issue edit <n> --remove-label "estado:bloqueada,executor:<ferramenta>" --add-label "estado:pronta"`. Nos dois casos, um comentário com a decisão |
| `concluir` | Automático no merge do PR com `Closes #<n>` (se não fechar, `gh issue close <n>`); depois, `gh issue edit <n> --remove-label "estado:em-revisao"` |
| recusar demanda | `gh issue close <n> --reason "not planned" --comment "<motivo>"` |

## Preparação na Fundação

1. Criar os rótulos (uma vez por repositório):

```bash
for r in estado:backlog estado:pronta estado:em-execucao estado:em-revisao estado:bloqueada \
         tipo:a-classificar tipo:feature tipo:mudanca tipo:bug tipo:hotfix area-sensivel; do
  gh label create "$r" --force
done
```

2. Copiar os modelos desta skill: os dois formatos de `assets/ticket.md` para
   `.github/ISSUE_TEMPLATE/` e `assets/pull-request.md` para
   `.github/pull_request_template.md`.
3. Os rótulos `executor:<ferramenta>` são criados quando cada ferramenta é usada pela
   primeira vez (`gh label create "executor:<ferramenta>" --force`).
4. Se a proteção da branch principal exigir aprovação em todo PR, lembre que os PRs da
   spec (já aprovada no Gate 3) também precisam da aprovação do dono do produto.
