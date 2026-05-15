# quakLinks-vue

Frontend em `Vue 3 + Vite + TypeScript` alinhado ao backend Spring em `demo`.

## Stack

- `Vue 3`
- `TypeScript`
- `Vite`
- `Pinia`
- `Vue Router`
- `Axios`
- `Vitest`
- `Vue Test Utils`
- `MSW`
- `Playwright`

## Setup

```sh
npm install
```

## Ambiente

Variavel principal esperada:

```env
VITE_API_URL=http://localhost:8080/api
```

Voce pode copiar `.env.example` para `.env` antes de rodar o frontend.

Se essa variavel apontar para a API Node legada, o frontend volta a consumir contratos antigos e parte dos fluxos abaixo quebra.

## Scripts

```sh
npm run dev
npm run build
npm test
npm run test:e2e
```

## Fluxos Alinhados

### Auth

- login e registro com `accessToken + refreshToken`
- refresh automatico em `401`
- `logout` e `logout all sessions`
- listagem de sessoes da conta
- OAuth social por `Google` e `Discord` com `authorize -> callback(code,state)`
- validacao fail-fast de `provider/state` pendente no callback
- leitura de contas sociais conectadas via `/auth/me`
- troca de email
- troca de senha
- unlink de `Google` e `Discord`

### Spotify

- `GET /spotify/authorize`
- `GET /spotify/callback`
- `GET /spotify/connection`
- `POST /spotify/sync`
- `DELETE /spotify/connection`

### Paginas E Upload

- `pages/me`, `pages`, `pages/{pageId}`
- `blocks` e `audios` por `pageId`
- fluxo de upload gerenciado:
  - signed URL
  - upload binario
  - complete asset

### Templates

- listagem publica em `/public/templates`
- recentes e tags populares em `/public/templates/recent` e `/public/templates/tags/popular`
- favoritos
- `mine`
- criar template com `pageId`
- aplicar template com `pageId`
- editar metadados do template autenticado
- deletar template

## Cobertura Atual

### Unit/Component

- `auth`
- `page`
- `analytics`
- `templates`
- `user`
- `uploadService`
- callback OAuth
- `AppearanceSidebar`
- `AppearancePreviewPanel`
- `AppearanceProfileTab`
- `AppearanceStyleTab`
- `AppearanceBackgroundTab`
- `AppearanceUnsavedChangesModal`

### E2E

- guard de rota protegida
- callback OAuth principal
- sessoes em `/settings`
- unlink social em `/dashboard/overview`
- troca de email com logout/redirect em `/settings`
- troca de senha com logout/redirect em `/settings`
- erro de credenciais invalidas em troca de email/senha

## Observacoes

- `npm test` ainda pode emitir warnings de parse CSS do `jsdom` em componentes visuais legacy; hoje eles nao quebram a suite.
- `npm run build` esta limpo dos warnings anteriores de `browserslist`, assets estaticos (`/noise.png`, `/scanlines.png`) e chunks grandes.
- a edicao de template atualiza metadados e preview; ela nao recria o snapshot do conteudo da pagina.
- `AppearanceView.vue` ja foi dividida em subcomponentes para `profile`, `style`, `background`, `extras`, editor de blocos, sidebar, painel de preview e modal de alteracoes nao salvas.

## Proximos Itens Tecnicos

- decidir se vale manter ou remover componentes visuais legacy que ainda geram warnings de CSS no `jsdom`
- considerar testes de componente para `AppearanceBlockEditorModal` e `AppearanceExtrasTab`
