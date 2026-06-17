import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceExtrasTab from "./AppearanceExtrasTab.vue";

describe("AppearanceExtrasTab.vue", () => {
  it("bloqueia recursos premium para usuarios free", async () => {
    const wrapper = shallowMount(AppearanceExtrasTab, {
      props: {
        form: {
          cursorUrl: null,
        },
        audioCount: 0,
        isPremiumUser: false,
      },
      global: {
        stubs: {
          AssetUploader: true,
        },
      },
    });

    expect(wrapper.text()).toContain("PREMIUM");
    expect(wrapper.text()).toContain(
      "Uploads de áudio e players estão disponíveis no plano PREMIUM.",
    );

    const manageButton = wrapper.get("button");
    await manageButton.trigger("click");
    expect(wrapper.emitted("open-audio-manager")).toBeUndefined();
    expect(wrapper.emitted("open-plans")).toEqual([
      ["Uploads de áudio e players estão disponíveis no plano PREMIUM."],
    ]);
  });

  it("permite abrir o gerenciador de audio para usuarios premium", async () => {
    const wrapper = shallowMount(AppearanceExtrasTab, {
      props: {
        form: {
          cursorUrl: null,
        },
        audioCount: 2,
        isPremiumUser: true,
      },
      global: {
        stubs: {
          AssetUploader: true,
        },
      },
    });

    const manageButton = wrapper.get("button");
    await manageButton.trigger("click");

    expect(wrapper.emitted("open-audio-manager")).toEqual([[]]);
  });
});
