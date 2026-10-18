# Como quebrar uma entrega em tarefas

## O que é uma boa tarefa

- **Gera um PR** de até cerca de 300 a 400 linhas alteradas e cabe numa sessão de trabalho.
- **Tem uma responsabilidade.** Se o título precisa de "e", provavelmente são duas tarefas.
- **Tem resultado verificável:** critérios de aceite que um teste ou uma pessoa consegue conferir.
- **Leva os testes junto.** O teste da tarefa está no mesmo PR, não numa tarefa "escrever testes" no fim.
  Uma tarefa sem comportamento (só tipos ou configuração) é verificada por typecheck e
  build; diga isso nos critérios de aceite. Quando possível, junte o contrato à primeira
  tarefa que tem comportamento.
- **Diz onde mexer:** arquivos previstos, para o executor não sair procurando e para o
  plano evitar conflito entre tarefas paralelas.
- **Aponta o contexto exato:** links para os trechos da spec e da arquitetura que importam,
  não "leia a spec inteira".

## Regras de ordem e paralelismo

- **Contrato primeiro.** Quando várias tarefas dependem dos mesmos tipos, schema ou
  assinaturas, a primeira tarefa cria esse contrato. As outras dependem dela.
- **O contrato inclui o que é compartilhado entre tela e servidor**, como a assinatura de
  uma função de validação usada nos dois lados.
- **Migration de banco é uma tarefa própria**, antes do código que usa a nova estrutura,
  e normalmente é área sensível. Critério de aceite: aplicada num banco local ou de teste,
  com o estado conferido (e a reversão, quando existir).
- **Tarefas paralelas não compartilham arquivos previstos.** Se compartilham, uma depende da outra.
- **A ordem segue a estratégia de validação** da spec (produto ou técnica).
- **Gate de interface por dependência.** Na estratégia de produto, marque a tarefa da
  interface com `Gate de interface: sim` e coloque-a em `Dependências:` de todas as
  tarefas posteriores. Ela só tem merge depois que o dono do produto valida as telas.
- **Código incompleto fica escondido** (fora do menu ou atrás de um controle de
  liberação) até a tarefa de integração, que tem "funcionalidade visível" nos critérios de aceite.
- **Na Fundação, tudo é sequencial.**

## Ordens típicas

| Estratégia | Sequência |
| --- | --- |
| Incerteza de produto | Contrato → interface com dados simulados (escondida, com gate no PR) → back-end → integração (torna visível) e testes ponta a ponta |
| Incerteza técnica | Contrato (e migration) → back-end com testes → interface → integração e testes ponta a ponta |

## Exemplo: "Exportar clientes em CSV" (incerteza técnica pequena)

| # | Tarefa | Depende de | Arquivos previstos | Área sensível |
| --- | --- | --- | --- | --- |
| 1 | Definir o formato do CSV e o tipo `ExportacaoClientes` | — | `src/features/clientes/export/types.ts` | Não |
| 2 | Action que gera o CSV só com clientes da empresa do usuário, com testes de isolamento | 1 | `src/features/clientes/export/action.ts` + teste | Sim (isolamento de dados) |
| 3 | Botão "Exportar" na listagem, com estados de carregando e erro | 1 | `src/app/clientes/page.tsx`, `src/features/clientes/export/botao.tsx` | Não |
| 4 | Teste ponta a ponta do fluxo de exportação | 2, 3 | `e2e/clientes-export.spec.ts` | Não |

As tarefas 2 e 3 podem rodar em paralelo: dependem só da 1 e não compartilham arquivos.
São 4 tarefas, então o planejador pergunta se o dono do produto aprova automaticamente ou quer revisar.

## Sinais de uma quebra ruim

- Tarefas vagas: "fazer o backend", "ajustar a tela".
- Tarefas que só fazem sentido entregues juntas (deveriam ser uma só).
- Uma tarefa "escrever testes" separada do código que eles testam.
- Duas tarefas paralelas mexendo no mesmo arquivo.
- Critério de aceite que ninguém consegue verificar ("ficar bom", "ser rápido").
