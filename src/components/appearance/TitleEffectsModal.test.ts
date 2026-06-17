import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/store/auth";
import TitleEffectsModal from "./TitleEffectsModal.vue";

const openPlans = vi.fn();

vi.mock("@/composables/usePlansNavigation", () => ({
  usePlansNavigation: () => ({
    openPlans,
  }),
}));

function setPlan(isPremium: boolean) {
  const authStore = useAuthStore();
  authStore.setUser({
    id: "user-1",
    name: "Duck",
    email: "duck@example.com",
    role: isPremium ? "PREMIUM" : "FREE",
    roles: isPremium ? ["PREMIUM"] : ["FREE"],
    image: null,
    imageProvider: "LOCAL",
    googleImage: null,
    discordImage: null,
    accounts: [],
    CustomDomain: null,
    spotifyConnection: null,
  });
}

describe("TitleEffectsModal.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    openPlans.mockReset();
  });

  it("bloqueia efeitos premium para usuarios free", async () => {
    setPlan(false);

    const wrapper = shallowMount(TitleEffectsModal, {
      props: {
        modelValue: "none",
        title: "Quak Links",
      },
    });

    expect(wrapper.text()).toContain(
      "Alguns efeitos do nome são exclusivos do plano PREMIUM.",
    );

    const typewriterButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Máquina de Escrever"))!;

    expect(typewriterButton.attributes("disabled")).toBeDefined();
    expect(typewriterButton.text()).toContain("PREMIUM");

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Ver planos"))!
      .trigger("click");
    expect(openPlans).toHaveBeenCalledWith(
      "Alguns efeitos do nome são exclusivos do plano PREMIUM.",
    );
    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Salvar"))!
      .trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([["none"]]);
  });

  it("permite selecionar efeito premium para usuarios premium", async () => {
    setPlan(true);

    const wrapper = shallowMount(TitleEffectsModal, {
      props: {
        modelValue: "none",
        title: "Quak Links",
      },
    });

    const typewriterButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Máquina de Escrever"))!;

    expect(typewriterButton.attributes("disabled")).toBeUndefined();

    await typewriterButton.trigger("click");
    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Salvar"))!
      .trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([["typewriter"]]);
  });
});
