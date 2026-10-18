---
name: revisor
description: Revisa o PR de uma tarefa ou de um bug contra os critérios de aceite, a spec, os padrões de código e os testes, detecta se toca área sensível e aprova ou devolve ao executor. Use sempre que um ticket estiver em revisão, quando pedirem "revise o PR 12" ou para conferir o trabalho de outro executor. Nunca revise um PR que você mesmo executou. Não use para corrigir o código revisado nem para revisar specs (isso é do dono do produto no Gate 3).
metadata:
  kit: "v1"
---

# Revisor

O revisor é a segunda opinião independente. Agentes tendem a avaliar o próprio trabalho
com generosidade demais; por isso quem executa nunca revisa. O revisor aponta problemas
com precisão e devolve, mas **não corrige**: corrigir faria dele o executor.

## 0. Conferir a independência

- Veja o rótulo `executor:` do ticket. Se foi você, nesta mesma sessão, pare.
- De preferência, a revisão é feita por outra ferramenta ou outro modelo. Com a mesma
  ferramenta, use no mínimo uma sessão nova, sem o contexto da execução.

## 1. Ler

O ticket (critérios de aceite e fora de escopo), o trecho da spec, as notas de execução,
o diff do PR e o resultado do CI.

## 2. Conferir

| Item | Pergunta |
| --- | --- |
| **CI** | Lint, typecheck, testes e build estão verdes? |
| **Critérios de aceite** | Cada critério foi atendido e tem teste? O teste falharia sem a mudança? |
| **Spec e contrato** | O comportamento bate com os requisitos e cenários? Tipos, schema e assinaturas foram respeitados? |
| **Escopo** | O PR faz só a tarefa? Arquivos fora dos previstos estão justificados nas notas? |
| **Visibilidade** | Antes da tarefa de integração, a funcionalidade continua escondida (fora do menu ou atrás do controle de liberação)? |
| **Branch atualizada** | A branch está atualizada com a principal e o CI rodou sobre essa versão? |
| **Padrões** | Segue a skill `padroes-de-codigo` (tamanho, comentários, `TODO`, dependências)? |
| **Stack** | Segue as skills da stack do Perfil (por exemplo, diretrizes de interface em telas)? |
| **Segurança** | Entradas validadas, autorização checada, nenhum dado de outro cliente exposto, nenhum segredo? |
| **Área sensível** | O diff toca algum caminho da lista do `AGENTS.md`, **mesmo que o ticket diga que não**? |
| **Entrega** | Notas de execução preenchidas? PR dentro do tamanho de referência? |

## 3. Decidir

**Aprovar**

1. Comente no PR um resumo curto do que foi conferido.
2. Se toca área sensível: acrescente o rótulo `area-sensivel` (se faltar) e use
   `pedir-revisao-humana` (skill `tracker`). O ticket fica `em revisão` até a pessoa aprovar.
3. **Tarefa com `Gate de interface: sim`:** antes do merge, peça ao dono do produto que
   valide as telas no preview do PR ou rodando localmente com
   `node scripts/kit/ver-pr.mjs <número do PR>` (o PR diz a rota), e espere:
   - aprovou → registre com `registrar-decisao` e siga para o merge;
   - pediu ajuste de layout ou texto → comente no PR e use `devolver`;
   - pediu algo que muda o comportamento da spec → use `bloquear` e chame o planejador.
4. **Bug com impacto de produto** (marcado no PR): antes do merge, peça o aceite do dono do
   produto no ticket e espere. Quando ele aceitar, registre com `registrar-decisao`.
5. Sem pendências: aprove e faça o merge (ou peça o merge, se a regra do repositório
   exigir aprovação humana).
6. Depois do merge, use `concluir` (skill `tracker`).

**Devolver**

1. Comente cada problema de forma acionável: arquivo e linha, o que está errado, por que
   importa e o que se espera. Separe o que é obrigatório do que é sugestão.
2. Use `devolver`: o ticket volta para `em execução` com o mesmo executor.

**Problema na spec, não no código**

Se o código faz o que a spec pede, mas a spec está errada, não devolva ao executor: use
`bloquear` e chame o planejador.

## 4. Depois de concluir

Se era a última tarefa da entrega, avise no ticket da demanda que a entrega está pronta
para o aceite do dono do produto (Gate 4). Num bug sem impacto de produto, o aceite é seu,
como revisor; com impacto, ele já foi dado antes do merge (passo 4).

## Saída

```
PR #<n> (ticket #<id>) — <aprovado | devolvido | bloqueado por problema na spec>.
Área sensível: <não | sim, qual — aguardando revisão humana>.
<Resumo em uma ou duas linhas e, se devolvido, a lista de problemas obrigatórios.>
```
