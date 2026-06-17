import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { usePageStore } from "./page";

describe("usePageStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("carrega pagina publica no shape consumido pela UI atual", async () => {
    const store = usePageStore();

    await store.fetchPageBySlug("public:duck");

    expect(store.currentPage?.slug).toBe("duck");
    expect(store.currentPage?.blocks).toHaveLength(1);
    expect(store.currentPage?.links[0]?.url).toBe("https://portfolio.example.com");
    expect(store.currentPage?.viewCount).toBe(789);
    expect(store.currentPage?.fontFamily).toBe("Cinzel");
    expect(store.currentPage?.backgroundOverlay).toBe("vignette");
    expect(store.currentPage?.showEmbeds).toBe(false);
    expect(store.currentPage?.profileRingType).toBe("gradient");
  });

  it("carrega pagina do owner resolvendo slug para id antes de buscar detalhes", async () => {
    const store = usePageStore();

    await store.fetchPageBySlug("duck");

    expect(store.currentPage?.id).toBe("page-1");
    expect(store.currentPage?.audios[0]?.isActive).toBe(true);
    expect(store.currentPage?.viewCount).toBe(321);
    expect(store.currentPage?.buttonStyle).toBe("glass");
    expect(store.currentPage?.buttonRoundness).toBe("rounded-full");
    expect(store.currentPage?.backgroundBlur).toBe(6);
    expect(store.currentPage?.profileRingColors).toEqual([
      "#ffffff",
      "#8b5cf6",
    ]);
  });

  it("carrega pagina publica por dominio customizado", async () => {
    const store = usePageStore();

    await store.fetchPublicPageByDomain("links.example.com");

    expect(store.currentPage?.slug).toBe("domain-duck");
    expect(store.currentPage?.blocks[0]?.id).toBe("public-domain-block-1");
    expect(store.currentPage?.viewCount).toBe(790);
  });
});
