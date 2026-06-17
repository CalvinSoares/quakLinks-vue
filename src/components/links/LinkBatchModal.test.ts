import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/store/auth";
import LinkBatchModal from "./LinkBatchModal.vue";

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

describe("LinkBatchModal.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    openPlans.mockReset();
  });

  it("mostra aviso de premium para agendamento no plano free", async () => {
    setPlan(false);

    const wrapper = shallowMount(LinkBatchModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          teleport: true,
          transition: false,
        },
      },
    });

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Custom"))!
      .trigger("click");

    expect(wrapper.text()).toContain("PREMIUM");
    expect(wrapper.text()).toContain(
      "Agendamento de links está disponível no plano PREMIUM.",
    );
    expect(wrapper.text()).not.toContain("Início (Aparecer)");

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Ver planos"))!
      .trigger("click");

    expect(openPlans).toHaveBeenCalledWith(
      "Agendamento de links está disponível no plano PREMIUM.",
    );
  });

  it("libera campos de agendamento no plano premium", async () => {
    setPlan(true);

    const wrapper = shallowMount(LinkBatchModal, {
      props: {
        isOpen: true,
      },
      global: {
        stubs: {
          teleport: true,
          transition: false,
        },
      },
    });

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Custom"))!
      .trigger("click");

    expect(wrapper.text()).toContain("Agendamento");
    expect(wrapper.text()).toContain("Início (Aparecer)");
    expect(wrapper.text()).toContain("Fim (Sumir)");
  });
});
