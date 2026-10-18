---
name: triagem
description: Classifica uma demanda nova como feature, mudança, bug, hotfix ou ajuste de uma entrega ainda aberta, confere área sensível e duplicatas, registra no tracker e encaminha para a trilha certa. Use sempre que chegar um pedido, ideia, reclamação ou relato de problema sobre o produto, mesmo informal ("o botão não salva", "queria poder exportar os clientes"), ou quando houver tickets "a classificar" no tracker. Não use para planejar a entrega nem para corrigir nada; esta skill só classifica e encaminha.
metadata:
  kit: "v1"
---

# Triagem

Toda demanda entra pela mesma porta e passa por aqui antes de qualquer trabalho.
A classificação decide o ritual: quais gates se aplicam e quais documentos mudam.
Uma classificação errada faz o trabalho pular aprovações ou passar por cerimônia demais.

## Passos

1. **Registrar.** Se a demanda ainda não é um ticket, crie com a ação `criar-demanda`
   (skill `tracker`), usando as palavras de quem pediu.
2. **Entender o comportamento atual.** Leia a spec viva da capacidade afetada
   (`openspec/specs/`) e, se precisar, o PRD e o roadmap. A classificação compara o que
   foi pedido com o que está especificado hoje.
3. **Procurar duplicatas e entregas em andamento** com a ação `buscar`. Se houver um
   ticket repetido, ligue os dois e proponha ao dono do produto fechar o repetido; não
   feche por conta própria. Anote também se existe uma entrega da mesma capacidade
   ainda aberta (sem aceite): isso muda a classificação.
4. **Classificar**, seguindo as perguntas abaixo na ordem.
5. **Conferir área sensível** contra a lista do `AGENTS.md`.
6. **Registrar a triagem** com a ação `classificar`: o tipo, o motivo em uma frase,
   se toca área sensível e o encaminhamento.
7. **Encaminhar** (tabela no fim).

## Como classificar

Responda na ordem; a primeira resposta "sim" decide.

1. **Está causando dano em produção agora** e não pode esperar (sistema fora do ar, dados
   errados sendo gravados, falha de segurança)? → **hotfix**. Confirme com o dono do
   produto antes de seguir, porque o hotfix pula etapas.
2. **É sobre uma entrega ainda aberta** (sem aceite do dono do produto)? → **ajuste da
   entrega**. Um problema ou pedido sobre algo que ainda está sendo entregue volta para
   essa entrega, em vez de virar uma demanda separada. Compare com a spec dessa entrega
   (`openspec/changes/`), não com a spec viva.
3. **O sistema faz algo diferente do que a spec viva diz?** → **bug**.
4. **O comportamento atual é o especificado, mas precisa mudar**, ou a spec estava
   errada ou incompleta? → **mudança**.
5. **É uma capacidade nova**, com objetivo próprio? → **feature**.

**Casos de dúvida:**

- Entre bug e mudança, classifique como **mudança**: ela passa pela aprovação da spec.
- Uma mudança que traz uma capacidade com objetivo próprio é **separada em uma feature**.
- Sem spec viva para comparar (projeto antigo ainda sem levantamento), compare com o
  comportamento descrito nos documentos e registre a dúvida no ticket.
- Faltando informação para decidir (por exemplo, um bug sem como reproduzir), pergunte a
  quem pediu, uma pergunta por vez, e mantenha o ticket em `backlog` com a pendência anotada.

## Exemplos

| Demanda | Classificação | Por quê |
| --- | --- | --- |
| "Quero exportar a lista de clientes em CSV" | Feature | Capacidade nova |
| "O total do relatório não bate com a soma dos itens" | Bug | A spec diz que o total é a soma |
| "O relatório deveria mostrar o total sem impostos" | Mudança | O total atual é o especificado, mas precisa mudar |
| "Ninguém consegue fazer login desde o deploy de hoje" | Hotfix | Dano em produção agora |
| "O CSV exportado quebra os acentos" (exportação ainda sem aceite) | Ajuste da entrega | A entrega da exportação ainda está aberta |
| "Mudar a cor do botão e incluir login com Google" | Mudança + feature | O login com Google tem objetivo próprio e vira outro ticket |

## Encaminhamento

| Tipo | Próximo passo | Estado do ticket |
| --- | --- | --- |
| Feature ou mudança | Skill `planejador` | Continua em `backlog` (o planejador libera as tarefas depois) |
| Ajuste de entrega aberta | Skill `planejador`, como ajuste da entrega (ticket ligado ao da demanda original) | Continua em `backlog` |
| Bug | Skill `bug` | `pronta`, com a ação `liberar` |
| Hotfix | Skill `bug`, modo hotfix, e aviso imediato ao dono do produto | `pronta`, com a ação `liberar`, depois da confirmação do dono do produto |

Bugs e hotfixes não passam pelo planejador, por isso a própria triagem os libera.

## Saída

Termine com um resumo curto:

```
Ticket #<n> — classificado como <tipo> porque <motivo>.
Área sensível: <sim, qual | não>. Próximo passo: <skill>.
```
