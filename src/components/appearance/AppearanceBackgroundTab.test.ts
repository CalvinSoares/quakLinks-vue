import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceBackgroundTab from "./AppearanceBackgroundTab.vue";

describe("AppearanceBackgroundTab.vue", () => {
  it("emite troca de layout e muda o tipo de fundo no layout padrao", async () => {
    const form = {
      pageLayout: "standard",
      backgroundType: "solid",
      backgroundColor: "#111111",
      gradientDirection: "to bottom",
      gradientColorA: "#000000",
      gradientColorB: "#ffffff",
      backgroundUrl: null,
      backgroundVideoUrl: null,
      backgroundBlur: 0,
      backgroundOverlay: "none",
      showProfileCard: true,
      profileCardColor: "#000000",
      profileCardOpacity: 0.5,
    };

    const wrapper = shallowMount(AppearanceBackgroundTab, {
      props: {
        form,
        isBodyGradient: false,
        availableBackgroundTabs: ["solid", "gradient", "image", "video"],
      },
      global: {
        stubs: {
          AssetUploader: true,
          ColorPicker: true,
          SwitchToggle: true,
        },
      },
    });

    await wrapper.findAll("button").find((button) => button.text().includes("Banner"))!.trigger("click");
    expect(wrapper.emitted("change-layout")).toEqual([["banner"]]);

    await wrapper.findAll("button").find((button) => button.text().includes("Vídeo"))!.trigger("click");
    expect(form.backgroundType).toBe("video");
  });

  it("emite alternancia do gradiente do corpo no layout de banner", async () => {
    const wrapper = shallowMount(AppearanceBackgroundTab, {
      props: {
        form: {
          pageLayout: "banner",
          backgroundType: "image",
          backgroundColor: "#111111",
          gradientDirection: "to bottom",
          gradientColorA: "#000000",
          gradientColorB: "#ffffff",
          backgroundUrl: null,
          backgroundVideoUrl: null,
          backgroundBlur: 0,
          backgroundOverlay: "none",
          showProfileCard: true,
          profileCardColor: "#000000",
          profileCardOpacity: 0.5,
        },
        isBodyGradient: false,
        availableBackgroundTabs: ["image", "video"],
      },
      global: {
        stubs: {
          AssetUploader: true,
          ColorPicker: true,
          SwitchToggle: true,
        },
      },
    });

    await wrapper.findAll("button").find((button) => button.text().includes("Gradiente"))!.trigger("click");
    expect(wrapper.emitted("update:isBodyGradient")).toEqual([[true]]);
  });
});
