import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import AppearancePreviewPanel from "./AppearancePreviewPanel.vue";

vi.mock("./LivePreview.vue", () => ({
  default: {
    name: "LivePreview",
    template: '<div data-testid="live-preview" />',
  },
}));

describe("AppearancePreviewPanel.vue", () => {
  it("mostra empty state quando nao ha pagina selecionada", () => {
    const wrapper = shallowMount(AppearancePreviewPanel, {
      props: {
        isEditingPage: false,
        previewData: {},
        previewMode: "mobile",
      },
    });

    expect(wrapper.text()).toContain("Nenhuma Página Selecionada");
  });

  it("emite troca de preview entre mobile e desktop", async () => {
    const wrapper = shallowMount(AppearancePreviewPanel, {
      props: {
        isEditingPage: true,
        previewData: { title: "Duck" },
        previewMode: "mobile",
      },
    });

    const desktopButton = wrapper.findAll("button")[1];
    expect(desktopButton).toBeDefined();
    await desktopButton!.trigger("click");

    expect(wrapper.emitted("update:previewMode")).toEqual([["desktop"]]);
  });
});
