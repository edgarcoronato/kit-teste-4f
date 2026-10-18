## Ticket

[ID e link do ticket]

## O que mudou

[Duas ou três frases. O porquê está na spec; aqui vai o que foi feito.]

## Como testar

1. [passo ou comando]
2. [resultado esperado]

## Critérios de aceite

- [ ] [copiados do ticket]

## Riscos

[O que pode quebrar, ou "nenhum identificado".]

## Área sensível

- [ ] Não toca área sensível
- [ ] Toca área sensível: [qual] — **exige revisão humana**

## Gate de interface (só se o ticket pedir)

- Como ver as telas: [link do preview, ou a rota a abrir entre crases]
- Para rodar localmente: `node scripts/kit/ver-pr.mjs <número deste PR>`
- A funcionalidade continua escondida (fora do menu ou atrás do controle de liberação)? [sim]

## Impacto de produto (só para bugs)

- [ ] Não: o aceite pode ser dado pelo revisor
- [ ] Sim: [o que a pessoa usuária percebe] — aceite do dono do produto

## Definição de pronto

- [ ] Critérios de aceite atendidos
- [ ] Branch atualizada com a principal antes de abrir (ou reenviar) o PR
- [ ] Testes novos e existentes passando, CI verde
- [ ] Até cerca de 300 a 400 linhas alteradas (sem gerados e lockfiles), ou justificativa abaixo
- [ ] Notas de execução registradas no ticket
- [ ] Documentos de Nível 1 atualizados, quando afetados

## Executor

[Nome ou ferramenta de agente]

<!--
Modelo do kit de desenvolvimento v1. No GitHub, copie para .github/pull_request_template.md.
-->
