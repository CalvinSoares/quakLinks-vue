import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  clickCount: number;
}

interface PageUser {
  image: string | null;
  imageProvider: string;
  name: string;
  role: string;
}

interface PageResponse {
  id: string;
  ownerId: string;
  slug: string;
  title?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  theme?: string | null;
  backgroundType?: string | null;
  backgroundColor?: string | null;
  backgroundUrl?: string | null;
  textColor?: string | null;
  iconColor?: string | null;
  buttonColor?: string | null;
  layoutType?: string | null;
  pageLayout?: "standard" | "banner" | "portrait";
  linkStyle?: string | null;
  layoutLinkStyle?: string | null;
  showProfileCard?: boolean;
  profileCardColor?: string | null;
  profileCardOpacity?: number | null;
  useStandardIconColors?: boolean;
  glowEffect?: string | null;
  showViewCount?: boolean;
  gradientDirection?: string | null;
  gradientColorA?: string | null;
  gradientColorB?: string | null;
  backgroundVideoUrl?: string | null;
  cursorUrl?: string | null;
  titleEffect?: string | null;
  customCss?: string | null;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PublicPageResponse {
  page: PageResponse;
  blocks: BackendBlock[];
  audios: BackendAudio[];
}

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  isVisible: boolean;
  content: Record<string, unknown>;
  pageId: string;
  title?: string | null;
  textContent?: string | null;
  url?: string | null;
}

interface BackendBlock {
  id: string;
  pageId: string;
  type: BlockType;
  title?: string | null;
  textContent?: string | null;
  url?: string | null;
  content?: Record<string, unknown> | null;
  displayOrder: number;
  visible: boolean;
}

export enum BlockType {
  LINK = "LINK",
  HEADER = "HEADER",
  TEXT = "TEXT",
  DIVIDER = "DIVIDER",
  VIDEO = "VIDEO",
  SOCIAL = "SOCIAL",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  YOUTUBE_SUBSCRIBE = "YOUTUBE_SUBSCRIBE",
  PINTEREST = "PINTEREST",
  COUNTDOWN = "COUNTDOWN",
}

export interface Audio {
  id: string;
  title: string;
  url: string;
  type: "DIRECT" | "SPOTIFY" | "SOUNDCLOUD";
  coverUrl?: string | null;
  isActive: boolean;
  order: number;
}

interface BackendAudio {
  id: string;
  pageId: string;
  title: string;
  url: string;
  type: "DIRECT" | "SPOTIFY" | "SOUNDCLOUD";
  coverUrl?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface Page {
  id: string;
  ownerId?: string;
  slug: string;
  title?: string;
  bio?: string;
  avatarUrl?: string | null;
  backgroundType?: string;
  gradientDirection?: string | null;
  gradientColorA?: string | null;
  gradientColorB?: string | null;
  backgroundColor?: string | null;
  backgroundUrl?: string | null;
  backgroundVideoUrl?: string | null;
  location?: string | null;
  theme: string;
  viewCount: number;
  cursorUrl?: string | null;
  links: Link[];
  textColor?: string | null;
  iconColor?: string | null;
  user: PageUser | null;
  fontFamily?: string;
  buttonStyle?: string;
  buttonColor?: string | null;
  buttonRoundness?: string;
  backgroundOverlay?: string;
  buttonShadow?: boolean;
  useStandardIconColors?: boolean;
  glowEffect?: string;
  backgroundBlur?: number;
  typewriterEffect?: boolean;
  titleEffect?: string;
  showProfileCard?: boolean;
  profileCardColor?: string | null;
  profileCardOpacity?: number;
  showViewCount?: boolean;
  linkStyle?: string;
  layoutLinkStyle?: string;
  shuffleAudios: boolean;
  showAudioPlayer: boolean;
  showEmbeds: boolean;
  audios: Audio[];
  profileRingType?: string | null;
  profileRingColors?: string[];
  pageLayout?: "standard" | "banner" | "portrait";
  blocks: Block[];
  customCss?: string | null;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapBlock(block: BackendBlock): Block {
  return {
    id: block.id,
    pageId: block.pageId,
    type: block.type,
    title: block.title ?? null,
    textContent: block.textContent ?? null,
    url: block.url ?? null,
    content: block.content ?? {},
    order: block.displayOrder,
    isVisible: block.visible,
  };
}

function mapAudio(audio: BackendAudio): Audio {
  return {
    id: audio.id,
    title: audio.title,
    url: audio.url,
    type: audio.type,
    coverUrl: audio.coverUrl ?? null,
    isActive: audio.active,
    order: audio.displayOrder,
  };
}

function mapLinksFromBlocks(blocks: Block[]): Link[] {
  return blocks
    .filter((block) => block.type === BlockType.LINK)
    .map((block) => ({
      id: block.id,
      title:
        typeof block.content?.title === "string"
          ? block.content.title
          : block.title || "Link",
      url:
        typeof block.content?.url === "string" ? block.content.url : block.url || "",
      order: block.order,
      clickCount: 0,
    }));
}

function composePage(page: PageResponse, blocks: BackendBlock[], audios: BackendAudio[]): Page {
  const mappedBlocks = blocks.map(mapBlock).sort((a, b) => a.order - b.order);
  const mappedAudios = audios.map(mapAudio).sort((a, b) => a.order - b.order);

  return {
    id: page.id,
    ownerId: page.ownerId,
    slug: page.slug,
    title: page.title ?? "",
    bio: page.bio ?? "",
    avatarUrl: page.avatarUrl ?? null,
    backgroundType: page.backgroundType ?? "COLOR",
    gradientDirection: page.gradientDirection ?? null,
    gradientColorA: page.gradientColorA ?? null,
    gradientColorB: page.gradientColorB ?? null,
    backgroundColor: page.backgroundColor ?? null,
    backgroundUrl: page.backgroundUrl ?? null,
    backgroundVideoUrl: page.backgroundVideoUrl ?? null,
    location: null,
    theme: page.theme ?? "dark",
    viewCount: 0,
    cursorUrl: page.cursorUrl ?? null,
    links: mapLinksFromBlocks(mappedBlocks),
    textColor: page.textColor ?? null,
    iconColor: page.iconColor ?? null,
    user: null,
    buttonColor: page.buttonColor ?? null,
    useStandardIconColors: page.useStandardIconColors ?? false,
    glowEffect: page.glowEffect ?? undefined,
    titleEffect: page.titleEffect ?? undefined,
    showProfileCard: page.showProfileCard ?? true,
    profileCardColor: page.profileCardColor ?? null,
    profileCardOpacity: page.profileCardOpacity ?? 1,
    showViewCount: page.showViewCount ?? false,
    linkStyle: page.linkStyle ?? undefined,
    layoutLinkStyle: page.layoutLinkStyle ?? undefined,
    shuffleAudios: false,
    showAudioPlayer: mappedAudios.length > 0,
    showEmbeds: true,
    audios: mappedAudios,
    pageLayout: page.pageLayout ?? "standard",
    blocks: mappedBlocks,
    customCss: page.customCss ?? null,
    published: page.published ?? true,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export const usePageStore = defineStore("page", () => {
  const currentPage = ref<Page | null>(null);
  const userPages = ref<Page[]>([]);
  const totalPages = ref(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function enrichOwnedPage(page: PageResponse) {
    const [blocksResponse, audiosResponse] = await Promise.all([
      api.get<BackendBlock[]>(`/pages/${page.id}/blocks`),
      api.get<BackendAudio[]>(`/pages/${page.id}/audios`),
    ]);

    return composePage(page, blocksResponse.data, audiosResponse.data);
  }

  async function fetchMyPage() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<PageResponse>("/pages/me");
      currentPage.value = await enrichOwnedPage(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar a pagina do usuario:", err);
      if (err.response?.status === 404) {
        currentPage.value = null;
      } else {
        error.value = err.response?.data?.message || "Nao foi possivel carregar sua pagina.";
        throw err;
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserPages(_page = 1, search = "") {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<PageResponse[]>("/pages");
      const normalizedSearch = search.trim().toLowerCase();
      const filtered = response.data.filter((page) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          page.slug.toLowerCase().includes(normalizedSearch) ||
          (page.title || "").toLowerCase().includes(normalizedSearch)
        );
      });

      userPages.value = filtered.map((page) => composePage(page, [], []));
      totalPages.value = 1;
    } catch (err) {
      console.error("Erro ao listar paginas do usuario:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createNewPage(data: { title: string; slug: string }) {
    const response = await api.post<PageResponse>("/pages", data);
    await fetchUserPages();
    return response.data;
  }

  async function deleteUserPage(id: string) {
    await api.delete(`/pages/${id}`);
    await fetchUserPages();
    if (currentPage.value?.id === id) {
      currentPage.value = null;
    }
  }

  async function findOwnedPageIdBySlug(slug: string) {
    const response = await api.get<PageResponse[]>("/pages");
    const matchedPage = response.data.find((page) => page.slug === slug);
    return matchedPage?.id ?? null;
  }

  async function selectPageToEdit(slug: string) {
    await fetchPageBySlug(slug);
  }

  async function updateMyPage(pageData: Partial<Page>) {
    isLoading.value = true;
    error.value = null;

    try {
      const endpoint = currentPage.value?.id ? `/pages/${currentPage.value.id}` : "/pages/me";
      const response = await api.put<PageResponse>(endpoint, pageData);
      currentPage.value = await enrichOwnedPage(response.data);
      return currentPage.value;
    } catch (err: any) {
      console.error("Erro ao atualizar a pagina:", err);
      error.value = err.response?.data?.message || "Nao foi possivel salvar as alteracoes.";
      throw new Error(error.value || "erro");
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPageBySlug(slug: string) {
    isLoading.value = true;
    error.value = null;
    currentPage.value = null;

    try {
      if (slug.startsWith("public:")) {
        const publicSlug = slug.replace(/^public:/, "");
        const response = await api.get<PublicPageResponse>(`/public/pages/${publicSlug}`);
        currentPage.value = composePage(
          response.data.page,
          response.data.blocks,
          response.data.audios
        );
        return;
      }

      const pageId = await findOwnedPageIdBySlug(slug);
      if (!pageId) {
        throw new Error("Pagina nao encontrada.");
      }

      const response = await api.get<PageResponse>(`/pages/${pageId}`);
      currentPage.value = await enrichOwnedPage(response.data);
    } catch (err: any) {
      console.error(`Erro ao buscar a pagina com slug ${slug}:`, err);
      error.value = err.response?.data?.message || "Pagina nao encontrada.";
    } finally {
      isLoading.value = false;
    }
  }

  async function addAudio(audioData: {
    title: string;
    url: string;
    type: "DIRECT" | "SPOTIFY" | "SOUNDCLOUD";
    coverUrl?: string | null;
  }) {
    if (!currentPage.value) {
      return;
    }

    try {
      const response = await api.post<BackendAudio>(
        `/pages/${currentPage.value.id}/audios`,
        audioData
      );
      currentPage.value.audios.push(mapAudio(response.data));
    } catch (err: any) {
      console.error("Erro ao adicionar audio:", err);
      throw new Error(err.response?.data?.message || "Nao foi possivel adicionar o audio.");
    }
  }

  async function updateAudio(audioId: string, audioData: Partial<Omit<Audio, "id">>) {
    if (!currentPage.value) {
      return;
    }

    try {
      const response = await api.put<BackendAudio>(
        `/pages/${currentPage.value.id}/audios/${audioId}`,
        audioData
      );
      const index = currentPage.value.audios.findIndex((audio) => audio.id === audioId);
      if (index !== -1) {
        currentPage.value.audios[index] = mapAudio(response.data);
      }
    } catch (err: any) {
      console.error("Erro ao atualizar audio:", err);
      throw new Error(err.response?.data?.message || "Nao foi possivel salvar as alteracoes.");
    }
  }

  async function deleteAudio(audioId: string) {
    if (!currentPage.value) {
      return;
    }

    try {
      await api.delete(`/pages/${currentPage.value.id}/audios/${audioId}`);
      currentPage.value.audios = currentPage.value.audios.filter((audio) => audio.id !== audioId);
    } catch (err: any) {
      console.error("Erro ao deletar audio:", err);
      throw new Error(err.response?.data?.message || "Nao foi possivel deletar o audio.");
    }
  }

  async function setActiveAudio(audioId: string) {
    if (!currentPage.value) {
      return;
    }

    try {
      const response = await api.put<BackendAudio>(
        `/pages/${currentPage.value.id}/audios/${audioId}/active`
      );
      currentPage.value.audios.forEach((audio) => {
        audio.isActive = audio.id === response.data.id;
      });
    } catch (err: any) {
      console.error("Erro ao ativar audio:", err);
      throw new Error(err.response?.data?.message || "Nao foi possivel ativar o audio.");
    }
  }

  async function createBlock(blockData: { type: BlockType; content?: Record<string, unknown> }) {
    if (!currentPage.value) {
      return;
    }

    try {
      const response = await api.post<BackendBlock>(`/pages/${currentPage.value.id}/blocks`, {
        type: blockData.type,
        content: blockData.content ?? {},
        visible: true,
      });

      currentPage.value.blocks.push(mapBlock(response.data));
      currentPage.value.blocks.sort((a, b) => a.order - b.order);
      currentPage.value.links = mapLinksFromBlocks(currentPage.value.blocks);
    } catch (err: any) {
      console.error("Erro ao criar bloco:", err);
      throw err;
    }
  }

  async function updateBlock(blockId: string, data: Partial<Block>) {
    if (!currentPage.value) {
      return;
    }

    try {
      const response = await api.put<BackendBlock>(
        `/pages/${currentPage.value.id}/blocks/${blockId}`,
        {
          type: data.type,
          title: data.title,
          textContent: data.textContent,
          url: data.url,
          content: data.content,
          visible: data.isVisible,
        }
      );

      const index = currentPage.value.blocks.findIndex((block) => block.id === blockId);
      if (index !== -1) {
        currentPage.value.blocks[index] = mapBlock(response.data);
        currentPage.value.links = mapLinksFromBlocks(currentPage.value.blocks);
      }
    } catch (err: any) {
      console.error("Erro ao atualizar bloco:", err);
      throw err;
    }
  }

  async function deleteBlock(blockId: string) {
    if (!currentPage.value) {
      return;
    }

    try {
      await api.delete(`/pages/${currentPage.value.id}/blocks/${blockId}`);
      currentPage.value.blocks = currentPage.value.blocks.filter((block) => block.id !== blockId);
      currentPage.value.links = mapLinksFromBlocks(currentPage.value.blocks);
    } catch (err: any) {
      console.error("Erro ao deletar bloco:", err);
      throw err;
    }
  }

  async function reorderBlocks(newOrder: Block[]) {
    if (!currentPage.value) {
      return;
    }

    currentPage.value.blocks = newOrder.map((block, index) => ({
      ...block,
      order: index,
    }));
    currentPage.value.links = mapLinksFromBlocks(currentPage.value.blocks);

    try {
      const payload = currentPage.value.blocks.map((block, index) => ({
        id: block.id,
        order: index,
      }));

      const response = await api.put<BackendBlock[]>(
        `/pages/${currentPage.value.id}/blocks/reorder`,
        { blocks: payload }
      );

      currentPage.value.blocks = response.data.map(mapBlock).sort((a, b) => a.order - b.order);
      currentPage.value.links = mapLinksFromBlocks(currentPage.value.blocks);
    } catch (err: any) {
      console.error("Erro ao reordenar blocos:", err);
      await fetchMyPage();
      throw err;
    }
  }

  return {
    currentPage,
    userPages,
    totalPages,
    isLoading,
    error,
    fetchMyPage,
    fetchUserPages,
    createNewPage,
    deleteUserPage,
    selectPageToEdit,
    updateMyPage,
    fetchPageBySlug,
    addAudio,
    updateAudio,
    deleteAudio,
    setActiveAudio,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  };
});
