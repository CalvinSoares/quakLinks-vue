import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import api from "@/services/api";
import { withIdempotencyKey } from "@/services/idempotency";
import { usePageStore } from "./page";
import { uploadFileWithSignedUrl } from "@/services/uploadService";

export interface TemplateTag {
  name: string;
}

export interface TemplateCreator {
  id: string;
  name: string;
  displayHandle: string;
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
  blockCount: number;
  applyCount: number;
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
  blockCount: number;
  applyCount: number;
  updatedAt?: string;
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
  pageId: string;
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
  applyCount?: number;
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

function normalizeTagName(tag: string) {
  return tag.trim().toLowerCase();
}

function mapTags(tags: string[]): TemplateTag[] {
  return tags.map((name) => ({ name }));
}

function deriveCreatorHandle(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "");
  return slug || "creator";
}

function isTemplateNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return created >= weekAgo;
}

function mapSummary(template: TemplateSummaryResponse): TemplateListItem {
  return {
    id: template.id,
    name: template.name,
    previewImageUrl: template.previewImageUrl,
    visibility: template.visibility,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    creator: {
      id: template.creatorId,
      name: template.creatorName,
      displayHandle: deriveCreatorHandle(template.creatorName),
    },
    tags: mapTags(template.tags),
    blockCount: template.blockCount ?? 0,
    applyCount: template.applyCount ?? 0,
    _count: {
      favoritedBy: template.favoriteCount,
    },
    isFavorited: template.favorited,
    isNew: isTemplateNew(template.createdAt),
  };
}

function mapTemplate(template: TemplateResponse): Template {
  const blockCount =
    template.blockCount ??
    template.blockSnapshots?.length ??
    0;

  return {
    ...mapSummary({ ...template, blockCount }),
    updatedAt: template.updatedAt,
    pageSnapshot: template.pageSnapshot,
    blockSnapshots: template.blockSnapshots ?? [],
    audioSnapshots: template.audioSnapshots ?? [],
    blockCount,
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
  const isDetailLoading = ref(false);
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

    if (pageStore.userPages.length === 1 && pageStore.userPages[0]?.id) {
      return pageStore.userPages[0].id;
    }

    if (pageStore.userPages.length > 1) {
      throw new Error(`Selecione a pagina que deseja usar antes de ${action}.`);
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
    isDetailLoading.value = true;
    try {
      const response = await api.get<TemplateResponse>(
        `/public/templates/${id}`,
      );
      selectedTemplate.value = mapTemplate(response.data);
      return selectedTemplate.value;
    } catch (err: any) {
      error.value = `Could not fetch template ${id}.`;
      return null;
    } finally {
      isDetailLoading.value = false;
    }
  }

  async function fetchPopularTags() {
    try {
      const response = await api.get<PopularTemplateTagResponse[]>(
        "/public/templates/tags/popular",
      );
      popularTags.value = response.data.map((tag) => ({
        name: normalizeTagName(tag.name),
      }));
      const availableTagNames = new Set(
        popularTags.value.map((tag) => tag.name),
      );
      selectedTags.value = selectedTags.value.filter((tag) =>
        availableTagNames.has(tag),
      );
      filters.tags = selectedTags.value.join(",") || undefined;
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
    const normalizedTag = normalizeTagName(tagName);
    if (!popularTags.value.some((tag) => tag.name === normalizedTag)) {
      return;
    }

    const index = selectedTags.value.indexOf(normalizedTag);
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    } else {
      selectedTags.value.push(normalizedTag);
    }
    filters.tags = selectedTags.value.join(",") || undefined;
    fetchTemplates();
  }

  async function applyTemplate(templateId: string) {
    try {
      const pageId = await ensureSelectedPageId("aplicar um template");

      await api.post(
        `/templates/${templateId}/apply`,
        { pageId },
        withIdempotencyKey("template-apply"),
      );
      const pageStore = usePageStore();
      await pageStore.fetchMyPage();
      syncTemplateAcrossLists(templateId, (item) => ({
        ...item,
        applyCount: item.applyCount + 1,
      }));
      if (selectedTemplate.value?.id === templateId) {
        selectedTemplate.value = {
          ...selectedTemplate.value,
          applyCount: selectedTemplate.value.applyCount + 1,
        };
      }
      return true;
    } catch (err: any) {
      console.error("Failed to apply template:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Nao foi possivel aplicar o template.",
      );
    }
  }

  function syncTemplateAcrossLists(
    templateId: string,
    updater: (template: TemplateListItem) => TemplateListItem | null,
  ) {
    const applyUpdate = (list: TemplateListItem[]) =>
      list
        .map((template) =>
          template.id === templateId ? updater(template) : template,
        )
        .filter((template): template is TemplateListItem => template !== null);

    templates.value = applyUpdate(templates.value);
    myTemplates.value = applyUpdate(myTemplates.value);
    favoriteTemplates.value = applyUpdate(favoriteTemplates.value);
    recentTemplates.value = applyUpdate(recentTemplates.value);
  }

  function buildOptimisticFavoriteTemplate(
    template: TemplateListItem,
    isFavorited: boolean,
  ): TemplateListItem {
    return {
      ...template,
      isFavorited,
      _count: {
        ...template._count,
        favoritedBy: Math.max(
          0,
          template._count.favoritedBy + (isFavorited ? 1 : -1),
        ),
      },
    };
  }

  async function toggleFavorite(template: TemplateListItem) {
    const templateId = template.id;
    const originalState = Boolean(template.isFavorited);
    const nextState = !originalState;
    const wasInFavorites = favoriteTemplates.value.some(
      (item) => item.id === templateId,
    );
    const optimisticTemplate = buildOptimisticFavoriteTemplate(
      template,
      nextState,
    );

    syncTemplateAcrossLists(templateId, (item) => ({
      ...item,
      isFavorited: nextState,
      _count: {
        ...item._count,
        favoritedBy: Math.max(
          0,
          item._count.favoritedBy + (nextState ? 1 : -1),
        ),
      },
    }));

    if (selectedTemplate.value?.id === templateId) {
      selectedTemplate.value = {
        ...selectedTemplate.value,
        isFavorited: nextState,
        _count: {
          ...selectedTemplate.value._count,
          favoritedBy: Math.max(
            0,
            selectedTemplate.value._count.favoritedBy + (nextState ? 1 : -1),
          ),
        },
      };
    }

    if (
      nextState &&
      !favoriteTemplates.value.some((item) => item.id === templateId)
    ) {
      favoriteTemplates.value = [
        optimisticTemplate,
        ...favoriteTemplates.value,
      ];
    }

    try {
      if (nextState) {
        await api.post(`/templates/${templateId}/favorite`);
      } else {
        await api.delete(`/templates/${templateId}/favorite`);
        favoriteTemplates.value = favoriteTemplates.value.filter(
          (item) => item.id !== templateId,
        );
      }
    } catch (err) {
      console.error("Falha ao favoritar o template:", err);
      syncTemplateAcrossLists(templateId, (item) => ({
        ...item,
        isFavorited: originalState,
        _count: {
          ...item._count,
          favoritedBy: Math.max(
            0,
            item._count.favoritedBy + (originalState ? 1 : -1),
          ),
        },
      }));

      if (selectedTemplate.value?.id === templateId) {
        selectedTemplate.value = {
          ...selectedTemplate.value,
          isFavorited: originalState,
          _count: {
            ...selectedTemplate.value._count,
            favoritedBy: Math.max(
              0,
              selectedTemplate.value._count.favoritedBy +
                (originalState ? 1 : -1),
            ),
          },
        };
      }

      if (!originalState && !wasInFavorites) {
        favoriteTemplates.value = favoriteTemplates.value.filter(
          (item) => item.id !== templateId,
        );
      }
    }
  }

  async function createTemplate(data: CreateTemplateInput) {
    try {
      if (!data.pageId) {
        throw new Error(
          "Selecione a pagina que deseja usar para criar o template.",
        );
      }

      const uploadedImageUrl = await uploadFileWithSignedUrl(
        data.previewImageFile,
        "template_preview",
      );

      const payload = {
        pageId: data.pageId,
        name: data.name,
        previewImageUrl: uploadedImageUrl,
        tags: data.tags,
        visibility: data.visibility,
      };

      const response = await api.post<TemplateResponse>(
        "/templates",
        payload,
        withIdempotencyKey("template-create"),
      );
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
    isDetailLoading,
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
