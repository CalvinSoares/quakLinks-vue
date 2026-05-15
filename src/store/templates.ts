import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import api from "@/services/api";
import { usePageStore } from "./page";
import { uploadFileWithSignedUrl } from "@/services/uploadService";

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
  createdAt: string;
  creator: TemplateCreator;
  tags: TemplateTag[];
  _count: {
    favoritedBy: number;
  };
  isNew?: boolean;
  isFavorited?: boolean;
  updatedAt?: string;
  pageSnapshot?: Record<string, unknown>;
  blockSnapshots?: Array<Record<string, unknown>>;
  audioSnapshots?: Array<Record<string, unknown>>;
}

export interface TemplateListItem {
  id: string;
  name: string;
  previewImageUrl: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
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

export interface UpdateTemplateInput {
  name: string;
  previewImageFile?: File;
  previewImageUrl?: string;
  tags: string[];
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
}

interface TemplateSummaryResponse {
  id: string;
  creatorId: string;
  creatorName: string;
  name: string;
  previewImageUrl: string;
  tags: string[];
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  blockCount: number;
  favoriteCount: number;
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateResponse extends TemplateSummaryResponse {
  pageSnapshot: Record<string, unknown>;
  blockSnapshots: Array<Record<string, unknown>>;
  audioSnapshots: Array<Record<string, unknown>>;
}

interface PublicTemplateListResponse {
  templates: TemplateSummaryResponse[];
  total: number;
  page: number;
  limit: number;
}

interface PopularTemplateTagResponse {
  name: string;
  usageCount: number;
}

function mapTags(tags: string[]): TemplateTag[] {
  return tags.map((name) => ({ name }));
}

function mapSummary(template: TemplateSummaryResponse): TemplateListItem {
  return {
    id: template.id,
    name: template.name,
    previewImageUrl: template.previewImageUrl,
    visibility: template.visibility,
    createdAt: template.createdAt,
    creator: {
      id: template.creatorId,
      name: template.creatorName,
    },
    tags: mapTags(template.tags),
    _count: {
      favoritedBy: template.favoriteCount,
    },
    isFavorited: template.favorited,
  };
}

function mapTemplate(template: TemplateResponse): Template {
  return {
    ...mapSummary(template),
    updatedAt: template.updatedAt,
    pageSnapshot: template.pageSnapshot,
    blockSnapshots: template.blockSnapshots,
    audioSnapshots: template.audioSnapshots,
  };
}

export const useTemplatesStore = defineStore("templates", () => {
  const templates = ref<TemplateListItem[]>([]);
  const myTemplates = ref<TemplateListItem[]>([]);
  const favoriteTemplates = ref<TemplateListItem[]>([]);
  const recentTemplates = ref<TemplateListItem[]>([]);
  const selectedTemplate = ref<Template | null>(null);
  const popularTags = ref<{ name: string }[]>([]);
  const selectedTags = ref<string[]>([]);
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

  async function ensureSelectedPageId(action: string) {
    const pageStore = usePageStore();

    if (pageStore.currentPage?.id) {
      return pageStore.currentPage.id;
    }

    if (pageStore.userPages.length === 0) {
      await pageStore.fetchUserPages();
    }

    if (pageStore.userPages[0]?.id) {
      return pageStore.userPages[0].id;
    }

    await pageStore.fetchMyPage();

    if (pageStore.currentPage?.id) {
      return pageStore.currentPage.id;
    }

    throw new Error(`Selecione uma pagina antes de ${action}.`);
  }

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
      const response = await api.get<PublicTemplateListResponse>(
        "/public/templates",
        { params: filters },
      );

      const newTemplates = response.data.templates.map(mapSummary);
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
      const response =
        await api.get<TemplateSummaryResponse[]>("/templates/mine");
      myTemplates.value = response.data.map(mapSummary);
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
      const response = await api.get<TemplateSummaryResponse[]>(
        "/templates/favorites",
      );

      favoriteTemplates.value = response.data.map(mapSummary);
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchRecentTemplates() {
    isLoading.value = true;
    try {
      const response = await api.get<TemplateSummaryResponse[]>(
        "/public/templates/recent",
      );

      recentTemplates.value = response.data.map(mapSummary);
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTemplateById(id: string) {
    isLoading.value = true;
    try {
      const response = await api.get<TemplateResponse>(
        `/public/templates/${id}`,
      );
      selectedTemplate.value = mapTemplate(response.data);
    } catch (err: any) {
      error.value = `Could not fetch template ${id}.`;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPopularTags() {
    try {
      const response = await api.get<PopularTemplateTagResponse[]>(
        "/public/templates/tags/popular",
      );
      popularTags.value = response.data.map((tag) => ({ name: tag.name }));
    } catch (err) {
      console.error("Failed to fetch popular tags:", err);
    }
  }

  function setFilter(key: keyof ListTemplatesQuery, value: any) {
    if (filters[key] === value) return;
    (filters[key] as any) = value;
    fetchTemplates();
  }

  function toggleTagFilter(tagName: string) {
    const index = selectedTags.value.indexOf(tagName);
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    } else {
      selectedTags.value.push(tagName);
    }
    filters.tags = selectedTags.value.join(",") || undefined;
    fetchTemplates();
  }

  async function applyTemplate(templateId: string) {
    try {
      const pageId = await ensureSelectedPageId("aplicar um template");

      await api.post(`/templates/${templateId}/apply`, { pageId });
      const pageStore = usePageStore();
      await pageStore.fetchMyPage();
      return true;
    } catch (err: any) {
      console.error("Failed to apply template:", err);
      return false;
    }
  }

  async function toggleFavorite(template: TemplateListItem) {
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
      template.isFavorited = originalState;
      template._count.favoritedBy += originalState ? 1 : -1;
    }
  }

  async function createTemplate(data: CreateTemplateInput) {
    try {
      const pageId = await ensureSelectedPageId("criar um template");
      const uploadedImageUrl = await uploadFileWithSignedUrl(
        data.previewImageFile,
        "template_preview",
      );

      const payload = {
        pageId,
        name: data.name,
        previewImageUrl: uploadedImageUrl,
        tags: data.tags,
        visibility: data.visibility,
      };

      const response = await api.post<TemplateResponse>("/templates", payload);
      const createdTemplate = mapTemplate(response.data);

      if (Array.isArray(myTemplates.value)) {
        myTemplates.value.unshift(createdTemplate);
      }

      return createdTemplate;
    } catch (err: any) {
      console.error("Falha ao criar o template:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível criar o template.",
      );
    }
  }

  async function updateTemplate(id: string, data: UpdateTemplateInput) {
    try {
      const previewImageUrl = data.previewImageFile
        ? await uploadFileWithSignedUrl(
            data.previewImageFile,
            "template_preview",
          )
        : data.previewImageUrl;

      if (!previewImageUrl) {
        throw new Error("Informe uma imagem de preview para o template.");
      }

      const response = await api.put<TemplateResponse>(`/templates/${id}`, {
        name: data.name,
        previewImageUrl,
        tags: data.tags,
        visibility: data.visibility,
      });

      const updatedTemplate = mapTemplate(response.data);
      myTemplates.value = myTemplates.value.map((template) =>
        template.id === id ? updatedTemplate : template,
      );

      if (selectedTemplate.value?.id === id) {
        selectedTemplate.value = updatedTemplate;
      }

      return updatedTemplate;
    } catch (err: any) {
      console.error(`Falha ao editar o template ${id}:`, err);
      throw new Error(
        err.response?.data?.message || "Nao foi possivel editar o template.",
      );
    }
  }

  async function deleteTemplate(id: string) {
    try {
      await api.delete(`/templates/${id}`);

      myTemplates.value = myTemplates.value.filter((t) => t.id !== id);
    } catch (err: any) {
      console.error(`Failed to delete template ${id}:`, err);
      throw new Error(
        err.response?.data?.message || "Could not delete template.",
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
    popularTags,
    selectedTags,
    fetchPopularTags,
    toggleTagFilter,
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
