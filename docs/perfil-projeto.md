# Perfil do projeto — [PREENCHER: nome do projeto]

> **Como usar este modelo**
> - Preenchido nos Fundamentos (Fase 2) e completado na Fundação (tracker e harness).
> - Atualizado no fechamento de qualquer entrega que mude stack, ferramentas ou regras;
>   registre a mudança no histórico, no fim do arquivo.
> - Cada campo traz o que registrar e um exemplo (web com Next.js e Supabase).
>   Apague os exemplos ao preencher.
> - **Uma fonte da verdade:** o que os agentes usam em toda sessão (comandos, caminhos
>   das áreas sensíveis, proibições) fica no `AGENTS.md`. Este Perfil guarda as escolhas
>   do projeto e os motivos, e aponta para o `AGENTS.md` quando for o caso.

## Identificação

| Campo | Valor | Exemplo |
| --- | --- | --- |
| Tipo de projeto | [PREENCHER] | Web app multiempresa |
| Modo de uso | [PREENCHER: completo, leve ou manutenção] | Completo |
| Versão do kit | v1 | v1 |
| Perfil de partida (catálogo) | [PREENCHER: web, app, firmware, serviço] | Web full-stack |
| Dono do produto | [PREENCHER] | Edgar |

## Stack

| Campo | Valor | Exemplo |
| --- | --- | --- |
| Linguagens | [PREENCHER] | TypeScript |
| Frameworks e bibliotecas principais | [PREENCHER] | Next.js (App Router, Server Actions), Tailwind, shadcn/ui |
| Banco de dados | [PREENCHER] | Supabase (Postgres, Auth, RLS) |
| Infraestrutura e hospedagem | [PREENCHER] | VPS própria |
| Integrações externas | [PREENCHER] | Servidor MCP para agentes externos |

## Desenvolvimento

| Campo | Valor | Exemplo |
| --- | --- | --- |
| Framework de SDD | [PREENCHER: OpenSpec, ou outro com link para o ADR] | OpenSpec |
| Tracker | Arquivos no repositório | GitHub Issues + Projects |
| Skills comuns | triagem, planejador, executor, revisor, bug, tracker, padroes-de-codigo | — |
| Skills da stack | [PREENCHER] | nextjs, supabase, shadcn |
| Ferramentas de agente em uso | [PREENCHER] | Claude Code; Codex como revisor |
| Idioma do código | [PREENCHER: nomes / comentários] | Nomes em inglês, comentários em português |
| Branches | [PREENCHER: principal e padrão de nome] | `main`; `tipo/ID-descricao` |
| Comandos | Ficam no `AGENTS.md`, seção "Comandos" | — |

## Qualidade

| Campo | Valor | Exemplo |
| --- | --- | --- |
| Limites de tamanho | [PREENCHER: só se mudar o padrão do kit] | Padrão: 400 linhas por arquivo, 80 por função, 300 a 400 por PR |
| Níveis de teste | [PREENCHER: o que cada nível cobre] | Unitário (regras), integração (actions e banco), E2E (fluxos principais) |
| Testes obrigatórios específicos | [PREENCHER] | Isolamento de dados entre empresas em toda tabela nova |
| CI | [PREENCHER: o que roda e quando] | Lint, typecheck, testes e build em todo PR; vermelho bloqueia o merge |

## Ambientes e deploy

| Campo | Valor | Exemplo |
| --- | --- | --- |
| Ambientes | [PREENCHER] | Local, staging, produção |
| Como o deploy acontece | [PREENCHER] | Merge na `main` → build → deploy na VPS |
| Onde ficam os segredos | [PREENCHER: o serviço ou cofre, nunca os valores] | Variáveis de ambiente da VPS e do CI |

## Áreas sensíveis

A lista com os caminhos fica no `AGENTS.md`. Aqui fica o motivo de cada área.

| Área | Por que é sensível | Exemplo de motivo |
| --- | --- | --- |
| [PREENCHER] | [PREENCHER] | Autenticação: um erro dá acesso indevido |
| [PREENCHER] | [PREENCHER] | Políticas RLS: um erro expõe dados de outra empresa |

## Exceções ao método

| ADR | Exceção aprovada |
| --- | --- |
| [PREENCHER: link] | [PREENCHER] |

## Histórico do perfil

Mais recente primeiro.

| Data | Mudança | Origem (entrega ou ADR) |
| --- | --- | --- |
| [PREENCHER] | Perfil criado | Fundamentos |
