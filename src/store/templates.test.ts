import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTemplatesStore } from "./templates";
import { usePageStore } from "./page";

describe("useTemplatesStore", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const pageStore = usePageStore();
    await pageStore.fetchUserPages();
    await pageStore.fetchPageBySlug("duck");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mapeia templates publicos para o shape consumido pela UI", async () => {
    const store = useTemplatesStore();

    await store.fetchTemplates();

    expect(store.templates[0]?.creator.name).toBe("Quack User");
    expect(store.templates[0]?.blockCount).toBe(3);
    expect(store.templates[0]?.applyCount).toBe(159140);
    expect(store.templates[0]?.tags[0]?.name).toBe("dark");
    expect(store.templates[0]?._count.favoritedBy).toBe(12);
  });

  it("cria template usando pageId explicito informado pelo modal", async () => {
    const store = useTemplatesStore();

    const result = await store.createTemplate({
      pageId: "page-1",
      name: "Duck Creator",
      previewImageFile: new File(["preview"], "preview.png", {
        type: "image/png",
      }),
      tags: ["dark", "creator"],
      visibility: "PUBLIC",
    });

    expect(result.name).toBe("Duck Creator");
    expect(store.myTemplates[0]?.id).toBe("template-created");
    expect(store.myTemplates[0]?.tags.map((tag) => tag.name)).toEqual([
      "dark",
      "creator",
    ]);
  });

  it("aplica template enviando pageId da pagina selecionada", async () => {
    const store = useTemplatesStore();
    const pageStore = usePageStore();

    const result = await store.applyTemplate("template-1");

    expect(result).toBe(true);
    expect(pageStore.currentPage?.id).toBe("page-1");
  });

  it("impede aplicar template sem pagina selecionada quando existem varias paginas", async () => {
    const store = useTemplatesStore();
    const pageStore = usePageStore();

    pageStore.currentPage = null;
    pageStore.userPages = [
      { id: "page-1", slug: "duck" } as any,
      { id: "page-2", slug: "bird" } as any,
    ];

    await expect(store.applyTemplate("template-1")).rejects.toThrow(
      "Selecione a pagina que deseja usar antes de aplicar um template.",
    );
  });

  it("edita template usando o endpoint autenticado atual", async () => {
    const store = useTemplatesStore();

    await store.fetchMyTemplates();
    const result = await store.updateTemplate("template-1", {
      name: "Dark Duck Reloaded",
      previewImageUrl: "https://cdn.example.com/template-dark-duck-updated.png",
      tags: ["dark", "portfolio"],
      visibility: "PRIVATE",
    });

    expect(result.name).toBe("Dark Duck Reloaded");
    expect(store.myTemplates[0]?.name).toBe("Dark Duck Reloaded");
    expect(store.myTemplates[0]?.visibility).toBe("PRIVATE");
  });

  it("carrega detalhe do template com blockCount do endpoint", async () => {
    const store = useTemplatesStore();

    const template = await store.fetchTemplateById("template-1");

    expect(template?.blockCount).toBe(3);
    expect(store.selectedTemplate?.blockCount).toBe(3);
  });

  it("sincroniza favoritos entre a lista aberta e o template selecionado", async () => {
    const store = useTemplatesStore();

    await store.fetchFavoriteTemplates();
    await store.fetchTemplateById("template-2");

    await store.toggleFavorite(store.favoriteTemplates[0]!);

    expect(store.favoriteTemplates).toHaveLength(0);
    expect(store.selectedTemplate?.id).toBe("template-2");
    expect(store.selectedTemplate?.isFavorited).toBe(false);
  });

  it("adiciona o template aos favoritos locais quando o usuario favorita pela exploracao", async () => {
    const store = useTemplatesStore();

    await store.fetchFavoriteTemplates();
    await store.fetchTemplates();

    await store.toggleFavorite(store.templates[0]!);

    expect(store.favoriteTemplates.map((template) => template.id)).toEqual([
      "template-1",
      "template-2",
    ]);
    expect(store.favoriteTemplates[0]?.isFavorited).toBe(true);
  });
});
