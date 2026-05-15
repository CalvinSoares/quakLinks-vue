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
  });

  it("carrega pagina do owner resolvendo slug para id antes de buscar detalhes", async () => {
    const store = usePageStore();

    await store.fetchPageBySlug("duck");

    expect(store.currentPage?.id).toBe("page-1");
    expect(store.currentPage?.audios[0]?.isActive).toBe(true);
  });
});
