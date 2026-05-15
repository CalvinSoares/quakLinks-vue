import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppearanceSidebar from "./AppearanceSidebar.vue";

function mountSidebar(
  props?: Partial<InstanceType<typeof AppearanceSidebar>["$props"]>,
) {
  return shallowMount(AppearanceSidebar, {
    props: {
      activeTab: "profile",
      isDirty: false,
      isEditingPage: false,
      isLoading: false,
      isSaving: false,
      userPages: [
        { id: "page-1", title: "Duck Links", slug: "duck" },
        { id: "page-2", title: "Bird Hub", slug: "bird" },
      ],
      ...props,
    },
    global: {
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });
}

describe("AppearanceSidebar.vue", () => {
  it("lista paginas e emite selecao no modo de escolha", async () => {
    const wrapper = mountSidebar();

    expect(wrapper.text()).toContain("Selecionar Página");
    expect(wrapper.text()).toContain("Duck Links");

    const firstPageButton = wrapper.findAll("button")[0];
    expect(firstPageButton).toBeDefined();
    await firstPageButton!.trigger("click");

    expect(wrapper.emitted("select-page")).toEqual([["duck"]]);
  });

  it("emite troca de aba, salvar e voltar no modo de edicao", async () => {
    const wrapper = mountSidebar({
      isEditingPage: true,
      isDirty: true,
      activeTab: "profile",
    });

    expect(wrapper.text()).toContain("Editor");

    await wrapper.get('button[title="Voltar para seleção"]').trigger("click");
    expect(wrapper.emitted("back")).toHaveLength(1);

    const styleButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Estilo"));
    expect(styleButton).toBeDefined();
    await styleButton!.trigger("click");
    expect(wrapper.emitted("select-tab")).toContainEqual(["style"]);

    const saveButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Publicar"));
    expect(saveButton).toBeDefined();
    await saveButton!.trigger("click");
    expect(wrapper.emitted("save")).toHaveLength(1);
  });
});
