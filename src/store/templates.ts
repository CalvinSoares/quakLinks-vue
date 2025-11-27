import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import api from "@/services/api";
import { usePageStore } from "./page";
import { uploadFileWithSignedUrl } from "@/services/uploadService";

// --- DEFINIÇÃO DE TIPOS ---
export interface TemplateTag {
  name: string;
}

export interface TemplateCreator {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
  previewImageUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  pageData: Record<string, any>;
  createdAt: string;
  creator: TemplateCreator;
  tags: TemplateTag[];
  _count: {
    favoritedBy: number;
  };
  isNew?: boolean;
  isFavorited?: boolean;
}

export interface ListTemplatesQuery {
  search?: string;
  tags?: string;
  sortBy?: "popular" | "newest" | "oldest";
  page?: number;
  limit?: number;
  creatorName?: string;
}

export interface CreateTemplateInput {
  name: string;
  previewImageFile: File;
  previewImageUrl?: string;
  tags: string[];
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
}

// --- FIM DOS TIPOS ---

export const useTemplatesStore = defineStore("templates", () => {
  // --- STATE ---
  const templates = ref<Template[]>([]);
  const myTemplates = ref<Template[]>([]);
  const favoriteTemplates = ref<Template[]>([]); // NOVO
  const recentTemplates = ref<Template[]>([]);
  const selectedTemplate = ref<Template | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const pagination = reactive({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: true,
  });

  const filters = reactive<ListTemplatesQuery>({
    page: 1,
    limit: 12,
    sortBy: "popular",
    search: undefined,
    creatorName: undefined,
    tags: undefined,
  });

  // --- ACTIONS ---

  async function fetchTemplates(loadMore = false) {
    if (isLoading.value) return;
    isLoading.value = true;
    error.value = null;

    if (!loadMore) {
      pagination.page = 1;
      templates.value = [];
    }

    filters.page = pagination.page;

    try {
      const response = await api.get<{
        templates: Template[];
        total: number;
      }>("/templates", { params: filters });

      const newTemplates = response.data.templates;
      templates.value = loadMore
        ? [...templates.value, ...newTemplates]
        : newTemplates;

      pagination.total = response.data.total;
      pagination.hasMore = templates.value.length < pagination.total;
      if (pagination.hasMore) {
        pagination.page++;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch templates.";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMyTemplates() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<{ templates: Template[] }>(
        "/templates/mine"
      );
      myTemplates.value = response.data.templates;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Falha ao buscar seus templates.";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchFavoriteTemplates() {
    isLoading.value = true;
    try {
      const response = await api.get<{ templates: Template[] }>(
        "/templates/favorites"
      );
      favoriteTemplates.value = response.data.templates;
    } catch (err) {
      /* ... */
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchRecentTemplates() {
    isLoading.value = true;
    try {
      const response = await api.get<{ templates: Template[] }>(
        "/templates/recent"
      );
      recentTemplates.value = response.data.templates;
    } catch (err) {
      /* ... */
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTemplateById(id: string) {
    isLoading.value = true;
    try {
      const response = await api.get<Template>(`/templates/${id}`);
      selectedTemplate.value = response.data;
    } catch (err: any) {
      error.value = `Could not fetch template ${id}.`;
    } finally {
      isLoading.value = false;
    }
  }

  function setFilter(key: keyof ListTemplatesQuery, value: any) {
    if (filters[key] === value) return;
    (filters[key] as any) = value;
    fetchTemplates();
  }

  async function applyTemplate(templateId: string) {
    try {
      await api.post(`/templates/${templateId}/apply`);
      // Após aplicar, atualiza os dados da página do usuário
      const pageStore = usePageStore();
      await pageStore.fetchMyPage();
      return true;
    } catch (err: any) {
      console.error("Failed to apply template:", err);
      return false;
    }
  }

  async function toggleFavorite(template: Template) {
    const originalState = template.isFavorited;

    template.isFavorited = !template.isFavorited;
    template._count.favoritedBy += template.isFavorited ? 1 : -1;

    try {
      if (template.isFavorited) {
        await api.post(`/templates/${template.id}/favorite`);
      } else {
        await api.delete(`/templates/${template.id}/favorite`);
      }
    } catch (err) {
      console.error("Falha ao favoritar o template:", err);
      // Reverte a mudança na UI em caso de erro
      template.isFavorited = originalState;
      template._count.favoritedBy += originalState ? 1 : -1;
    }
  }

  async function createTemplate(data: CreateTemplateInput) {
    try {
      // 1. Faz o upload da imagem de preview primeiro
      const uploadedImageUrl = await uploadFileWithSignedUrl(
        data.previewImageFile,
        "template_preview"
      );

      // 2. Prepara o payload para a nossa API principal, já com a URL final
      const payload = {
        name: data.name,
        previewImageUrl: uploadedImageUrl, // <-- Usa a URL retornada pelo serviço de upload
        tags: data.tags,
        visibility: data.visibility,
      };

      // 3. Envia os dados para criar o template
      const response = await api.post<Template>("/templates", payload);

      myTemplates.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Falha ao criar o template:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível criar o template."
      );
    }
  }

  async function updateTemplate(
    id: string,
    data: Partial<CreateTemplateInput>
  ) {
    try {
      const payload: any = { ...data };

      if (data.previewImageFile) {
        payload.previewImageUrl = await uploadFileWithSignedUrl(
          data.previewImageFile,
          "template_preview"
        );
      }
      delete payload.previewImageFile; // Remove o arquivo do payload final

      const response = await api.put<Template>(`/templates/${id}`, payload);
      const index = myTemplates.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        myTemplates.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      console.error(`Failed to update template ${id}:`, err);
      throw new Error(
        err.response?.data?.message || "Could not update template."
      );
    }
  }

  // --- NOVA AÇÃO ---
  async function deleteTemplate(id: string) {
    try {
      await api.delete(`/templates/${id}`);
      // Remove da lista local
      myTemplates.value = myTemplates.value.filter((t) => t.id !== id);
    } catch (err: any) {
      console.error(`Failed to delete template ${id}:`, err);
      throw new Error(
        err.response?.data?.message || "Could not delete template."
      );
    }
  }

  return {
    templates,
    myTemplates,
    favoriteTemplates,
    recentTemplates,
    selectedTemplate,
    isLoading,
    error,
    pagination,
    filters,
    fetchTemplates,
    fetchMyTemplates,
    fetchTemplateById,
    setFilter,
    applyTemplate,
    toggleFavorite,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fetchFavoriteTemplates,
    fetchRecentTemplates,
  };
});
