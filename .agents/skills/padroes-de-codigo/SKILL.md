---
name: padroes-de-codigo
description: Regras universais de código do kit, válidas em qualquer linguagem ou stack - tamanho de arquivos e funções, responsabilidade única, nomes, comentários, testes, dependências, segredos e tamanho de PR. Use antes de escrever, alterar ou revisar código, ao escrever testes ou comentários e ao preparar um PR, mesmo em mudanças pequenas. Não substitui as skills da stack (React, Supabase, firmware etc.), que trazem as regras específicas; esta traz as que valem em todo projeto.
metadata:
  kit: "v1"
---

# Padrões de código

Estas regras valem em qualquer stack. As regras específicas de cada linguagem ou
framework vêm das skills da stack listadas no Perfil do projeto. Quando o Perfil ajusta
um limite (por exemplo, o tamanho de arquivo), vale o do Perfil.

Boa parte destas regras também é imposta por ferramenta (lint, formatter, typecheck, CI).
Siga-as mesmo assim: a ferramenta pega o erro depois; a regra evita que ele aconteça.

## Estrutura

- **Uma responsabilidade por arquivo, função e componente.** Código com um único motivo
  para mudar é mais fácil de testar, revisar e alterar sem efeito colateral.
- **Arquivos pequenos:** referência de até cerca de **400 linhas por arquivo** e
  **80 por função**. Acima disso, divida por responsabilidade. Arquivos grandes consomem o
  contexto de quem lê (pessoas e agentes) e aumentam o conflito quando duas tarefas correm
  em paralelo.
- **Arquivo existente já acima do limite:** não o refatore dentro de uma tarefa que não
  pede isso. Evite fazê-lo crescer e registre uma demanda para dividi-lo (skill `tracker`).
- **Nomes explícitos**, no idioma definido no Perfil do projeto. Prefira um nome longo e
  claro a um comentário explicando um nome curto.
- **Funcionalidade incompleta fica escondida.** O que chega à branch principal antes da
  integração de uma entrega fica fora do menu ou atrás de um controle de liberação, para
  nunca aparecer em produção pela metade ou com dados simulados.

## Comentários

- Explicam o **porquê** e, brevemente, o **quê**. O código mostra o como.
- Uma regra de negócio que não é óbvia cita o ID do requisito na spec, para quem ler
  depois achar a origem.
- Funções e módulos públicos têm uma descrição curta: propósito, entradas e saídas.
- `TODO` só com o ID de um ticket (`TODO(#123): ...`). Um `TODO` sem ticket é esquecido.
- Código desativado é apagado, não comentado. O git guarda o histórico.

Exemplo:

```ts
// Ruim: repete o código.
// soma 30 à data
const expira = addDays(hoje, 30);

// Bom: diz o porquê e de onde vem a regra.
// Convites expiram em 30 dias para limitar acessos esquecidos (REQ-014).
const expira = addDays(hoje, 30);
```

## Testes

- **Toda tarefa que muda comportamento entrega teste** que cobre os critérios de aceite.
  Uma tarefa sem comportamento (só tipos ou configuração) é verificada por typecheck e build.
- **Todo bug entrega um teste de regressão que falha sem a correção.** Rode-o antes de
  corrigir para ver a falha; depois, para ver passar.
- **Um teste que falha pelo motivo errado não prova nada.** Erro de ambiente, sintaxe ou
  dependência ausente não é a falha esperada; corrija antes de seguir.
- **Áreas sensíveis têm testes próprios**, como o isolamento de dados entre clientes.
- **Migration é verificada aplicando-a** num banco local ou de teste e conferindo o estado
  (e a reversão, quando existir). Nunca em produção.
- **Nunca pule, desative ou enfraqueça um teste para o CI passar.** Se um teste existente
  parece errado, registre nas notas de execução e bloqueie a tarefa.

## Dependências e segurança

- **Dependência nova só com justificativa no PR.** Se for estrutural (muda a arquitetura),
  exige ADR antes.
- **Nenhum segredo no código**, em testes ou em exemplos: tokens, senhas, chaves e valores
  de `.env` ficam fora do repositório. Use os nomes das variáveis, nunca os valores.
- **Entrada externa é validada** na borda (formulários, APIs, actions, webhooks).

## Pull requests

- **Uma tarefa gera um PR.** Misturar tarefas atrasa a revisão e esconde problemas.
- **Até cerca de 300 a 400 linhas alteradas**, sem contar arquivos gerados e lockfiles.
  Passou disso, a tarefa provavelmente deveria ter sido quebrada: avise nas notas.
- **A descrição segue o modelo** de PR do kit: ticket, o que mudou, como testar, riscos e
  se toca área sensível.

## Antes de entregar

- [ ] Critérios de aceite atendidos e cobertos por testes
- [ ] Lint, typecheck e testes rodados localmente, passando
- [ ] Nenhum arquivo novo acima do limite; nenhum arquivo grande cresceu sem necessidade
- [ ] Comentários com o porquê; `TODO` só com ticket; nada de código comentado
- [ ] Nenhum segredo, nenhuma dependência nova sem justificativa
- [ ] PR dentro do tamanho de referência e descrito com o modelo
