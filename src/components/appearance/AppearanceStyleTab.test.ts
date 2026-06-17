import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceStyleTab from "./AppearanceStyleTab.vue";

describe("AppearanceStyleTab.vue", () => {
  it("muta o formulario ao escolher layout, estilo e fonte", async () => {
    const form = {
      layoutLinkStyle: "list",
      linkStyle: "classic",
      textColor: "#ffffff",
      buttonColor: "#000000",
      useStandardIconColors: true,
      iconColor: "#cccccc",
      fontFamily: "Inter",
      buttonRoundness: "rounded-lg",
      buttonShadow: false,
    };

    const wrapper = shallowMount(AppearanceStyleTab, {
      props: { form },
      global: {
        stubs: {
          ColorPicker: true,
          SwitchToggle: true,
          CustomDropdown: {
            props: ["modelValue", "options"],
            template:
              '<select class="custom-dropdown-stub" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>',
          },
        },
      },
    });

    await wrapper.findAll("button").find((button) => button.text().includes("Grade"))!.trigger("click");
    expect(form.layoutLinkStyle).toBe("grid");

    await wrapper.findAll("button").find((button) => button.text().includes("Minimal"))!.trigger("click");
    expect(form.linkStyle).toBe("minimal");

    await wrapper.get(".custom-dropdown-stub").setValue("Cinzel");
    expect(form.fontFamily).toBe("Cinzel");
  });

  it("mostra a cor customizada de icones quando a marca nao esta ativa", () => {
    const wrapper = shallowMount(AppearanceStyleTab, {
      props: {
        form: {
          layoutLinkStyle: "list",
          linkStyle: "classic",
          textColor: "#ffffff",
          buttonColor: "#000000",
          useStandardIconColors: false,
          iconColor: "#cccccc",
          fontFamily: "Inter",
          buttonRoundness: "rounded-lg",
          buttonShadow: false,
        },
      },
      global: {
        stubs: {
          ColorPicker: {
            props: ["label"],
            template: '<div class="color-picker-stub">{{ label }}</div>',
          },
          SwitchToggle: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Cor Personalizada dos Ícones");
  });
});
