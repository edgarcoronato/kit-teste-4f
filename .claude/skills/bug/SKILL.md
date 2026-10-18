---
name: bug
description: Conduz a trilha de bug e de hotfix - reproduzir o problema, escrever um teste que falha, achar a causa, corrigir com a menor mudança e entregar para revisão; no modo hotfix, corrigir e publicar primeiro e completar teste e registro logo depois. Use quando a triagem classificar um ticket como bug ou hotfix, ou quando pedirem para corrigir um erro, uma falha ou um comportamento diferente do especificado. Se a correção exigir mudar o comportamento especificado, não é bug - devolva para a triagem. Não use para features ou mudanças.
metadata:
  kit: "v1"
---

# Bug

Bug é quando o código não faz o que a spec diz. A spec não muda; o código volta a
obedecê-la, e um teste garante que o problema não volta.

## Modo normal

### 1. Pegar

Use `pegar` (skill `tracker`) no ticket de bug. Crie a branch `bug/ID-descricao`.

### 2. Reproduzir

- Siga os passos do ticket até ver o problema acontecer.
- Reduza ao menor caso que ainda reproduz: menos dados, menos passos.
- **Não reproduziu?** Registre o que tentou (`registrar-notas`), pergunte o que falta a
  quem relatou e use `bloquear`. Não corrija um bug que você não viu acontecer.

### 3. Confirmar que é bug

Compare com a spec viva da capacidade. Se o sistema faz exatamente o que está
especificado, o pedido é uma **mudança**: use `bloquear`, explique e devolva para a triagem.

### 4. Escrever o teste que falha

Escreva um teste que reproduz o problema e rode: ele precisa **falhar pelo motivo do
bug**. Uma falha por ambiente ou sintaxe não serve.

### 5. Achar a causa

- Procure a origem, não só o ponto onde o erro aparece.
- Levante hipóteses e teste uma de cada vez; mudar duas coisas juntas esconde qual resolveu.
- Use a skill de depuração da stack, se o Perfil do projeto listar uma.

### 6. Corrigir

- Faça a **menor mudança que remove a causa**. Nada de refatorar ou corrigir outras coisas
  junto: problemas vizinhos viram demandas novas.
- O teste do passo 4 passa; a suíte inteira passa.

### 7. Entregar

Como na skill `executor`: PR com o modelo (`assets/pull-request.md` da skill `tracker`),
marcando área sensível e se há impacto de produto, `ligar-pr`, `enviar-revisao` com o CI verde e `registrar-notas` incluindo
**a causa** e por que a correção a remove.

Sem impacto de produto, o aceite é dado pelo revisor. Com impacto, o revisor pede o aceite
do dono do produto no ticket **antes do merge**.

## Modo hotfix

Para dano em produção agora, **já confirmado pelo dono do produto** na triagem.

1. **Pegar** o ticket e criar a branch `hotfix/ID-descricao` a partir da versão em produção.
2. **Reproduzir e corrigir** com a menor mudança possível.
3. **Teste:** se couber em poucos minutos, escreva antes do deploy. Se não couber, abra na
   hora um ticket de bug, ligado a este, para o teste de regressão.
4. **PR, CI e revisão rápida.** O CI continua obrigatório. Toque em área sensível exige
   revisão humana, mesmo com pressa.
5. **Deploy** pelo processo do Perfil do projeto, e confirme em produção que o problema parou.
6. **Logo depois:** notas com o que aconteceu, a causa e como evitar; o aceite do dono do
   produto; e, se o problema já tinha acontecido antes, uma análise curta com a proposta de
   regra, teste ou hook para não se repetir.

## Regras

- Nunca enfraqueça ou desative um teste para fazer a correção passar.
- Um bug sempre termina com um teste de regressão, mesmo que entregue logo depois (hotfix).
- Encontrou outro problema no caminho? `criar-demanda`, não correção junto.
