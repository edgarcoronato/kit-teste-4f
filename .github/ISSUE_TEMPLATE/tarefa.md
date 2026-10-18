---
name: Tarefa
about: Tarefa de uma entrega (criada pelo planejador)
labels: estado:backlog
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
