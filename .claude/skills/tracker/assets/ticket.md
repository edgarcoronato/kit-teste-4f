# Modelos de ticket

> Modelo do kit de desenvolvimento v1 (skill `tracker`). Dois formatos: a **demanda**,
> que entra pela porta única, e a **tarefa**, criada pelo planejador depois do Gate 3.
> Em trackers com modelos próprios (por exemplo, `.github/ISSUE_TEMPLATE/` no GitHub),
> copie cada formato para lá. No tracker de arquivos, cada ticket é um arquivo com este conteúdo.

---

## A. Demanda (entrada)

**Título:** [uma frase do que se quer]

| Campo | Valor |
| --- | --- |
| Tipo | `a classificar` (a triagem troca por feature, mudança, bug ou hotfix) |
| Estado | `backlog` |
| Quem pediu | [nome ou origem] |
| Data | [AAAA-MM-DD] |

### Descrição

[O que se quer ou o que está acontecendo, com as palavras de quem pediu.]

### Para bugs: como reproduzir

1. [passo]
2. [passo]

- **Esperado:** [o que deveria acontecer]
- **Observado:** [o que acontece]
- **Onde:** [ambiente, tela, versão]

### Triagem (preenchido pela triagem)

- **Classificação:** [feature | mudança | bug | hotfix] — [motivo em uma frase]
- **Área sensível:** [sim | não]
- **Encaminhamento:** [planejador | trilha de bug]

---

## B. Tarefa (criada pelo planejador)

**Título:** [uma frase do que deve existir ao final]

As duas primeiras linhas do corpo são fixas, exatamente neste formato:

```
Entrega: #[número do ticket da demanda]
Dependências: #[número], #[número]   (ou: Dependências: nenhuma)
```

| Campo | Valor |
| --- | --- |
| Tipo | `tarefa` · rótulo `tipo:<feature\|mudanca\|bug\|hotfix>` da entrega |
| Estado | `backlog` → `pronta` depois do gate de plano |
| Spec | [link para a spec da entrega] |
| Arquivos previstos | [caminhos onde a mudança deve acontecer] |
| Área sensível | [sim — qual área \| não] |
| Gate de interface | [sim \| não] — sim: o dono do produto valida as telas no PR antes do merge |
| Executor | [vazio até alguém pegar; depois: nome ou ferramenta] |
| PR | [link, quando aberto] |

### Objetivo

[Uma frase.]

### Contexto necessário (ler antes)

- [link para o trecho da spec]
- [link para o trecho da arquitetura, ADR ou spec viva, se necessário]

### Critérios de aceite

- [ ] [critério verificável]
- [ ] [critério verificável]
- [ ] Testes cobrindo os critérios acima (tarefa sem comportamento, como só tipos ou configuração: typecheck e build)

### Fora de escopo

[O que esta tarefa não faz, quando houver risco de confusão.]

### Notas de execução

[Preenchidas pelo executor ao entregar; ver `notas-execucao.md`.]
