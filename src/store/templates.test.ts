import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useTemplatesStore } from "./templates";
import { usePageStore } from "./page";

describe("useTemplatesStore", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());

    const pageStore = usePageStore();
    await pageStore.fetchUserPages();
    await pageStore.fetchPageBySlug("duck");
  });

  it("mapeia templates publicos para o shape consumido pela UI", async () => {
    const store = useTemplatesStore();

    await store.fetchTemplates();

    expect(store.templates[0]?.creator.name).toBe("Quack User");
    expect(store.templates[0]?.tags[0]?.name).toBe("dark");
    expect(store.templates[0]?._count.favoritedBy).toBe(12);
  });

  it("aplica template enviando pageId da pagina selecionada", async () => {
    const store = useTemplatesStore();
    const pageStore = usePageStore();

    const result = await store.applyTemplate("template-1");

    expect(result).toBe(true);
    expect(pageStore.currentPage?.id).toBe("page-1");
  });

  it("edita template usando o endpoint autenticado atual", async () => {
    const store = useTemplatesStore();

    await store.fetchMyTemplates();
    const result = await store.updateTemplate("template-1", {
      name: "Dark Duck Reloaded",
      previewImageUrl: "https://cdn.example.com/template-dark-duck-updated.png",
      tags: ["dark", "updated"],
      visibility: "PRIVATE",
    });

    expect(result.name).toBe("Dark Duck Reloaded");
    expect(store.myTemplates[0]?.name).toBe("Dark Duck Reloaded");
    expect(store.myTemplates[0]?.visibility).toBe("PRIVATE");
  });
});
