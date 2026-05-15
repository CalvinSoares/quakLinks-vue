import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceProfileTab from "./AppearanceProfileTab.vue";

describe("AppearanceProfileTab.vue", () => {
  it("atualiza o formulario e emite abertura dos efeitos", async () => {
    const form = {
      avatarUrl: null,
      title: "Duck",
      bio: "",
      location: "",
    };

    const wrapper = shallowMount(AppearanceProfileTab, {
      props: { form },
      global: {
        stubs: {
          AssetUploader: {
            template: '<button data-testid="asset-upload" @click="$emit(\'remove\')" />',
          },
        },
      },
    });

    const titleInput = wrapper.get('input[placeholder="Ex: @seunome"]');
    await titleInput.setValue("Quack Links");
    expect(form.title).toBe("Quack Links");

    await wrapper.get('button[title="Efeitos do Texto"]').trigger("click");
    expect(wrapper.emitted("open-effects")).toHaveLength(1);

    await wrapper.get('[data-testid="asset-upload"]').trigger("click");
    expect(wrapper.emitted("remove")).toEqual([["avatarUrl"]]);
  });
});
