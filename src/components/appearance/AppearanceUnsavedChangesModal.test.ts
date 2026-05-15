import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceUnsavedChangesModal from "./AppearanceUnsavedChangesModal.vue";

describe("AppearanceUnsavedChangesModal.vue", () => {
  it("nao renderiza quando fechado", () => {
    const wrapper = shallowMount(AppearanceUnsavedChangesModal, {
      props: { open: false },
    });

    expect(wrapper.text()).toBe("");
  });

  it("emite descarte e salvar ao clicar nas acoes", async () => {
    const wrapper = shallowMount(AppearanceUnsavedChangesModal, {
      props: { open: true },
    });

    expect(wrapper.text()).toContain("Alterações não salvas");

    const buttons = wrapper.findAll("button");
    await buttons[0]!.trigger("click");
    await buttons[1]!.trigger("click");

    expect(wrapper.emitted("discard")).toHaveLength(1);
    expect(wrapper.emitted("save-and-exit")).toHaveLength(1);
  });
});
