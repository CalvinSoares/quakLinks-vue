# Planejamento do Dashboard Publico

## Objetivo

Evoluir a pagina publica principal para apresentar o produto de forma mais clara, mais visual e mais conectada ao dashboard real do sistema.

O foco desta etapa e reorganizar a experiencia publica para:

- apresentar o dashboard com narrativa de produto;
- destacar a personalizacao das paginas;
- usar uma imagem central do editor como prova visual;
- incluir FAQ;
- incluir footer completo com secoes do dashboard e link para o GitHub;
- atualizar o comportamento do header para iniciar colado no topo e, ao scrollar, se desprender com animacao dinamica.

## Base Atual Revisada

Arquivos principais identificados:

- `src/views/Landing-Page.vue`: landing publica atual na rota `/`;
- `src/router/index.ts`: confirma que a home publica atual e `Landing-Page.vue`;
- `src/views/AppearanceView.vue`: referencia real da personalizacao;
- `src/views/PagesManager.vue`: gerenciamento de paginas;
- `src/views/TemplatesView.vue`: biblioteca de modelos;
- `src/views/AnalyticsView.vue`: analises;
- `src/views/PlansView.vue`: planos;
- `public/image.png`: imagem ja disponivel no projeto e adequada para o showcase central.

## Direcao de Produto

O novo dashboard publico deve vender a ideia de "controle total da pagina" com prova visual do editor real.

Narrativa principal:

1. o usuario entende o produto no topo;
2. o usuario visualiza o dashboard real em destaque;
3. o scroll revela os modulos do sistema;
4. a personalizacao de paginas ganha uma secao propria;
5. FAQ reduz friccao;
6. footer consolida navegacao, credibilidade e GitHub.

## Estrutura Proposta da Pagina

### 1. Header Hero

Objetivo:

- começar encostado no topo da pagina;
- parecer integrado ao hero no estado inicial;
- ao scrollar, se desprender visualmente e assumir o estilo flutuante atual;
- ganhar uma animacao elegante e dinamica na transicao.

Comportamento esperado:

- estado inicial:
  - header no topo absoluto da pagina;
  - menos padding vertical;
  - mais transparente;
  - integrado ao background do hero;
- estado apos scroll:
  - header vira flutuante;
  - recebe `backdrop-blur`, sombra e borda;
  - desce levemente com animacao;
  - reduz largura para reforcar o efeito de "solto".

Sugestao tecnica:

- usar `scrollY` com listener leve;
- criar estado `isDetached`;
- animar com `transform`, `opacity`, `backdrop-filter`, `box-shadow` e `border-color`;
- usar `transition` suave ou `motion-safe`.

Referencia de UX:

- inicio: "grudado no topo";
- depois: "capsula premium flutuante".

### 2. Hero

Objetivo:

- manter a proposta de valor;
- simplificar o excesso visual;
- conectar imediatamente com a experiencia do editor.

Conteudo:

- titulo forte;
- subtitulo curto e orientado a valor;
- CTA principal;
- CTA secundario para navegar ate o showcase do dashboard.

## Secao Principal de Showcase do Dashboard

### 3. Imagem Central do Editor

Objetivo:

- usar a imagem enviada como prova real do produto;
- posicionar a captura de tela no centro da pagina;
- tratar a imagem como "hero visual" do dashboard.

Asset:

- usar `public/image.png`.

Comportamento visual:

- imagem centralizada;
- container com borda suave, sombra e glow discreto;
- hover com zoom elegante;
- manter leitura do layout em desktop e mobile.

Interacao desejada:

- `hover:scale(1.03)` ou `1.05`;
- transicao com easing premium;
- opcional: leve parallax no wrapper;
- opcional: highlight nas bordas com gradiente.

Estrutura sugerida:

- titulo da secao;
- texto explicando que o usuario controla layout, blocos, midia e publicacao;
- imagem central do editor;
- cards ou bullets laterais com explicacao do que esta sendo visto.

## Storytelling Conforme o Scroll

### 4. Secao "O que existe dentro do dashboard"

Objetivo:

- conforme o usuario desce a pagina, mostrar o que o sistema tem;
- transformar o scroll em uma apresentacao guiada do painel.

Secoes recomendadas:

1. `Paginas`
   - criar e gerenciar varias paginas;
   - organizar slugs;
   - publicar experiencias diferentes.

2. `Personalizacao`
   - foco principal da pagina;
   - destacar perfil, estilo, fundo, extras e blocos;
   - explicar que a personalizacao acontece em tempo real.

3. `Blocos`
   - mostrar composicao da pagina por links, texto, cabecalho, divisores e outros elementos;
   - reforcar modularidade.

4. `Midia e Integracoes`
   - audio, Spotify, video, embeds e recursos visuais;
   - vincular com a riqueza do editor.

5. `Modelos`
   - uso de templates e reaproveitamento visual;
   - produtividade para criadores, agencias e freelancers.

6. `Analises`
   - mostrar que nao e so visual;
   - existe leitura de performance e acompanhamento.

Formato visual sugerido:

- layout em blocos alternados;
- texto de um lado e mini prova visual do outro;
- entrada por scroll com `fade-up`, `slide`, `scale`;
- cada secao conecta com um modulo real do sistema.

## Secao Dedicada a Personalizacao

### 5. Destaque da Personalizacao das Paginas

Objetivo:

- tornar a personalizacao o centro da narrativa publica;
- mostrar que este e o diferencial principal do produto.

Conteudo sugerido:

- subtitulo: "Personalize cada pagina do seu jeito";
- explicacao curta;
- pontos de destaque:
  - avatar e cabecalho;
  - estilos e botoes;
  - fundos e gradientes;
  - blocos e organizacao;
  - extras premium;
  - preview em tempo real.

Sugestao visual:

- grid com 4 a 6 cards;
- cada card ligado a uma parte real do editor;
- usar linguagem visual coerente com `AppearanceView.vue`.

## FAQ

### 6. Secao de Perguntas Frequentes

Objetivo:

- reduzir duvidas antes do cadastro;
- apoiar conversao;
- evitar excesso de texto espalhado.

Perguntas recomendadas:

1. Posso criar mais de uma pagina?
2. Consigo personalizar fundo, avatar, botoes e layout?
3. O dashboard permite adicionar blocos e links diferentes?
4. Existe suporte para audio, video e integracoes?
5. Posso reutilizar modelos prontos?
6. Existe plano gratis e recursos premium?

Formato sugerido:

- accordion;
- animacao suave de abertura;
- icone com rotacao;
- textos curtos e objetivos.

## Footer

### 7. Footer Completo

Objetivo:

- fechar a pagina com navegacao util e credibilidade;
- substituir o footer atual simples.

Estrutura sugerida:

- coluna 1: marca e descricao curta;
- coluna 2: secoes do dashboard;
- coluna 3: produto;
- coluna 4: recursos;
- coluna 5: GitHub e links externos.

Links sugeridos para "Secoes do Dashboard":

- Paginas
- Personalizacao
- Blocos
- Modelos
- Analises
- Planos

Links sugeridos para "Produto":

- Como funciona
- FAQ
- Criar conta
- Entrar

Links sugeridos para "GitHub":

- Meu GitHub
- Repositorio do projeto

Observacao:

- o link do GitHub deve ser parametrizavel para facilitar troca futura.

## Componentizacao Recomendada

Para evitar que `Landing-Page.vue` continue crescendo demais, a recomendacao e quebrar a pagina em componentes:

- `PublicDashboardHeader.vue`
- `PublicDashboardHero.vue`
- `PublicDashboardShowcase.vue`
- `PublicDashboardStorySection.vue`
- `PublicDashboardCustomization.vue`
- `PublicDashboardFaq.vue`
- `PublicDashboardFooter.vue`

Beneficios:

- facilita manutencao;
- melhora leitura;
- permite iteracoes por secao;
- reduz risco de quebrar a landing inteira em futuras alteracoes.

## Dados e Conteudo

Recomendacao:

- manter o conteudo em objetos `translations` como ja acontece hoje;
- criar novas chaves para:
  - FAQ;
  - footer;
  - showcase do dashboard;
  - secao de personalizacao;
  - estados do header.

## Animacoes Recomendadas

### Header

- transicao entre `top-attached` e `floating`;
- `translateY`, `scale`, `blur`, `shadow`.

### Imagem do Dashboard

- zoom no hover;
- sombra dinamica;
- glow nas bordas;
- opcional: leve `tilt`.

### Storytelling das secoes

- `fade-up`;
- `stagger` nos cards;
- `scale-in` em imagens;
- `progress reveal` conforme scroll.

## Ordem de Implementacao

### Fase 1

- extrair e reorganizar estrutura da landing atual;
- criar header com comportamento de desprendimento no scroll;
- criar nova secao de showcase com `public/image.png`.

### Fase 2

- criar secao "o que tem no dashboard";
- criar secao dedicada a personalizacao;
- alinhar copy com os modulos reais do sistema.

### Fase 3

- adicionar FAQ;
- adicionar footer completo com secoes do dashboard e GitHub;
- revisar responsividade.

### Fase 4

- polir animacoes;
- revisar performance;
- validar experiencia mobile.

## Criterios de Aceite

- header inicia no topo da pagina e se desprende ao scroll com animacao clara;
- imagem do dashboard fica centralizada e com zoom no hover;
- a pagina explica, ao longo do scroll, os modulos reais do sistema;
- existe uma secao forte de personalizacao das paginas;
- existe FAQ funcional;
- existe footer completo com secoes do dashboard e link para GitHub;
- a nova estrutura continua responsiva;
- a landing fica mais organizada do que a implementacao atual.

## Observacoes Tecnicas

- a landing atual ja tem muitos efeitos visuais; a nova versao deve priorizar clareza;
- importante evitar excesso de animacao competindo com o showcase central;
- o scroll storytelling deve reforcar o produto, nao distrair;
- ideal manter `Landing-Page.vue` como composicao de secoes, nao como arquivo monolitico.

## Proximo Passo Recomendado

Implementar primeiro a reorganizacao estrutural da landing e o novo bloco central com a imagem do dashboard. Depois, encaixar FAQ, footer e a narrativa por scroll.
