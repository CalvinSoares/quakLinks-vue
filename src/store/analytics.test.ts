import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAnalyticsStore } from "./analytics";

describe("useAnalyticsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("carrega analytics usando o contrato atual do backend Spring", async () => {
    const store = useAnalyticsStore();

    await store.fetchAnalytics("30d");

    expect(store.analytics?.slug).toBe("duck");
    expect(store.analytics?.topBlocks[0]?.title).toBe("Meu site");
    expect(store.analytics?.topReferrers[0]?.source).toBe("direct");
  });

  it("carrega analytics da pagina selecionada quando pageId e informado", async () => {
    const store = useAnalyticsStore();

    await store.fetchAnalytics("30d", "page-2");

    expect(store.analytics?.pageId).toBe("page-2");
    expect(store.analytics?.slug).toBe("bird");
    expect(store.analytics?.topReferrers[0]?.source).toBe("twitter.com");
  });
});
