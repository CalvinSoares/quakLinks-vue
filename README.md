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

## Padronizacao UI

### Direcao Visual

- priorizar `amber/yellow` como cor principal de CTA
- manter base `slate` para fundos, superficies e estados neutros
- evitar novos botoes `purple` em modais e fluxos de confirmacao
- reservar `red` para acoes destrutivas e `emerald` para estados de sucesso

### Classes Compartilhadas

As classes globais ficam em `src/assets/main.css` e devem ser a primeira escolha para novos modais e botoes:

- `ui-modal-shell`
- `ui-modal-backdrop`
- `ui-modal-panel`
- `ui-modal-header`
- `ui-modal-title`
- `ui-modal-copy`
- `ui-modal-footer`
- `ui-modal-close`
- `ui-btn-primary`
- `ui-btn-secondary`
- `ui-btn-ghost`
- `ui-btn-danger`
- `ui-btn-success`
- `ui-btn-icon`
- `ui-label`
- `ui-input`
- `ui-input-shell`
- `ui-radio`
- `ui-dropdown-trigger`
- `ui-dropdown-menu`
- `ui-dropdown-item`

### Botoes

- `ui-btn-primary`: CTA principal do modal ou da secao; usar amarelo da marca
- `ui-btn-secondary`: acao secundaria, navegacao auxiliar ou cancelar
- `ui-btn-ghost`: acao de baixa enfase, geralmente em headers ou toolbars
- `ui-btn-danger`: exclusao, logout ou acoes irreversiveis
- `ui-btn-success`: confirmacoes positivas muito especificas
- evitar criar novos aliases locais como `btn-primary` em componentes; preferir as classes globais

### Modais

- todo modal novo deve usar `src/components/dashboard/Modal.vue` ou `src/components/modals/BaseModal.vue`
- header sempre com titulo claro, botao de fechar consistente e separacao visual do corpo
- footer sempre alinhado com `ui-modal-footer`
- CTA principal do modal fica no footer e usa `ui-btn-primary`
- formulario dentro de modal deve usar `ui-label` + `ui-input`

### Inputs

- `ui-input` cobre `input`, `textarea` e `select` na maioria dos casos
- `ui-input-shell` serve para wrappers customizados, como campo de tags com multiplos chips
- manter foco em amarelo para consistencia do sistema

### Dropdown (Select)

- usar `src/components/ui/CustomDropdown.vue` para selects customizados em vez de `<select>` nativo
- usar `src/components/ui/CustomMultiDropdown.vue` para filtros com multi-seleção (ex: categorias)
- baseado em `@headlessui/vue` (`Listbox`) para acessibilidade WAI-ARIA
- classes globais: `ui-dropdown-trigger`, `ui-dropdown-menu`, `ui-dropdown-item`
- opcoes tipadas com `{ label, value, icon? }` via `DropdownOption` em `src/types/dropdown.ts`
- exemplo completo em `src/components/ui/CustomDropdown.example.vue`

```vue
<CustomDropdown
  id="sort"
  v-model="sortBy"
  :options="[
    { label: 'Em alta', value: 'popular', icon: FireIcon },
    { label: 'Mais recentes', value: 'newest', icon: ClockIcon },
  ]"
  placeholder="Escolha uma ordenação"
/>
```

### Templates (Biblioteca)

- cards em `TemplateCard.vue`: preview, criador (@handle), stats (usos, favoritos, blocos), tags e ações fixas (usar, copiar link, preview)
- `QuickViewModal.vue`: preview ao vivo via `PageRenderer` + snapshots; copy link com deep link `?preview={id}`
- `TemplatePreviewGate.vue`: overlay com opacidade → preview full-screen (`PageRenderer`) → botão "Ver template" abre o modal
- helpers: `src/utils/templateShare.ts`, `src/utils/templatePreview.ts`

### Estado Atual

Esta rodada alinhou principalmente:

- `dashboard/Modal.vue`
- `modals/BaseModal.vue`
- modais de `templates`
- modais de `audio`
- modais de `account settings/overview`
- alguns modais de `appearance`

Ainda existem componentes legacy com estilo proprio, especialmente fluxos muito customizados como `LinkBatchModal.vue`. Ao tocar neles, migrar para a base `ui-*` em vez de adicionar nova variacao local.

### Storybook

Storybook pode ajudar, mas eu recomendo introduzir so depois de estabilizar essa camada base. A ordem sugerida e:

1. consolidar `ui-*` no app real
2. extrair exemplos minimos de `Button`, `Modal` e `Field`
3. adicionar Storybook apenas para documentacao visual e regressao

Se for seguir por esse caminho depois, o ideal e criar historias para:

- botoes por variante e estado (`default`, `hover`, `disabled`, `loading`)
- modal simples, modal com formulario e modal destrutivo
- inputs com erro, help text e estado desabilitado

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
