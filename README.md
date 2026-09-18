# BoletoSafe — Frontend

Primeira versão do frontend do BoletoSafe (A3 Sistemas Distribuídos / Mobile),
em Angular 21, standalone components, `@ngrx/signals` (SignalStore) e o
padrão resource API do Angular.

## Stack

- Angular 21 (standalone components, sem NgModules)
- `@ngrx/signals` — SignalStore para estado por feature
- `provideHttpClient` + interceptor funcional para JWT
- `httpResource()` para leituras (ex.: lista de alertas)
- SCSS puro, sem framework de UI

## Como rodar

```bash
npm install
npm run start
```

A aplicação sobe em `http://localhost:4200`. O `environment.development.ts`
aponta para `http://localhost:8080/api/v1`, que deve bater com o
Auth Service / Boleto Risk Engine do backend (Spring Boot).

## Estrutura

```
src/app/
├── core/               # interceptors, guards, models — sem UI
├── features/
│   ├── auth/           # login + AuthStore (token, sessão)
│   ├── boleto-analise/ # formulário + resultado da análise de risco
│   └── alertas/        # listagem de alertas (usa httpResource)
├── shared/ui/          # componentes de apresentação reutilizáveis
└── app.routes.ts        # lazy loading por feature + authGuard
```

## Padrão adotado: ação (POST) vs leitura (GET)

- `AuthStore.login` e `BoletoStore.analisar` chamam endpoints POST
  (`/auth/login`, `/boleto/analise`) — são ações disparadas pelo usuário,
  implementadas com `rxMethod`.
- `AlertaStore.alertas` é uma leitura (GET `/boleto/alertas`) que reage a um
  signal de filtro — por isso usa `httpResource()`, o padrão "resource API"
  pedido no checkpoint.

## Próximos passos

- Conectar com os endpoints reais do Auth Service e do Boleto Risk Engine
  (hoje o backend ainda não está no ar; os `services` já estão prontos
  para isso).
- Tratamento de erro mais granular (401 → logout automático via interceptor).
- Testes unitários dos stores.
