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

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  isVisible: boolean;
  content: any;
  pageId: string;
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

export interface Page {
  id: string;
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
  backgroundVideoUrl?: string;
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

  createdAt: string;
  updatedAt: string;
}

export const usePageStore = defineStore("page", () => {
  const currentPage = ref<Page | null>(null);
  const userPages = ref<Page[]>([]);
  const totalPages = ref(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchMyPage() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<Page>("/pages/my-page");
      currentPage.value = response.data;
    } catch (err: any) {
      console.error("Erro ao buscar a página do usuário:", err);
      if (err.response && err.response.status === 404) {
        currentPage.value = null;
      } else {
        error.value =
          err.response?.data?.message ||
          "Não foi possível carregar sua página.";
        throw err;
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserPages(page = 1, search = "") {
    isLoading.value = true;
    try {
      const res = await api.get(`/pages/list?page=${page}&search=${search}`);
      userPages.value = res.data.pages;
      totalPages.value = res.data.totalPages;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createNewPage(data: { title: string; slug: string }) {
    const res = await api.post("/pages", data);
    await fetchUserPages();
    return res.data;
  }

  async function deleteUserPage(id: string) {
    await api.delete(`/pages/${id}`);
    await fetchUserPages();
    if (currentPage.value?.id === id) currentPage.value = null;
  }

  async function selectPageToEdit(slug: string) {
    await fetchPageBySlug(slug);
  }

  async function updateMyPage(pageData: Partial<Page>) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put<Page>("/pages/my-page", pageData);
      currentPage.value = response.data;
      return response.data;
    } catch (err: any) {
      console.error("Erro ao atualizar a página:", err);
      error.value =
        err.response?.data?.message || "Não foi possível salvar as alterações.";
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
      const response = await api.get<Page>(`/pages/${slug}`);
      currentPage.value = response.data;
    } catch (err: any) {
      console.error(`Erro ao buscar a página com slug ${slug}:`, err);
      error.value = err.response?.data?.message || "Página não encontrada.";
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
    if (!currentPage.value) return;
    try {
      const response = await api.post<Audio>("/audios/", audioData);

      currentPage.value.audios.push(response.data);
    } catch (err: any) {
      console.error("Erro ao adicionar áudio:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível adicionar o áudio."
      );
    }
  }

  async function updateAudio(
    audioId: string,
    audioData: Partial<Omit<Audio, "id">>
  ) {
    if (!currentPage.value) return;
    try {
      const response = await api.put<Audio>(`/audios/${audioId}`, audioData);
      const index = currentPage.value.audios.findIndex((a) => a.id === audioId);
      if (index !== -1) {
        currentPage.value.audios[index] = response.data;
      }
    } catch (err: any) {
      console.error("Erro ao atualizar áudio:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível salvar as alterações."
      );
    }
  }

  async function deleteAudio(audioId: string) {
    if (!currentPage.value) return;
    try {
      await api.delete(`/audios/${audioId}`);
      currentPage.value.audios = currentPage.value.audios.filter(
        (a) => a.id !== audioId
      );
    } catch (err: any) {
      console.error("Erro ao deletar áudio:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível deletar o áudio."
      );
    }
  }

  async function setActiveAudio(audioId: string) {
    if (!currentPage.value) return;
    try {
      const response = await api.post<Audio>(`/audios/${audioId}/set-active`);
      currentPage.value.audios.forEach((audio) => {
        audio.isActive = audio.id === response.data.id;
      });
    } catch (err: any) {
      console.error("Erro ao ativar áudio:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível ativar o áudio."
      );
    }
  }

  async function createBlock(blockData: { type: BlockType; content?: any }) {
    if (!currentPage.value) return;
    try {
      const response = await api.post<Block>("/blocks", blockData);
      currentPage.value.blocks.push(response.data);
      currentPage.value.blocks.sort((a, b) => a.order - b.order);
    } catch (err: any) {
      console.error("Erro ao criar bloco:", err);
      throw err;
    }
  }

  async function updateBlock(blockId: string, data: Partial<Block>) {
    if (!currentPage.value) return;
    try {
      const response = await api.put<Block>(`/blocks/${blockId}`, data);
      const index = currentPage.value.blocks.findIndex((b) => b.id === blockId);
      if (index !== -1) {
        currentPage.value.blocks[index] = {
          ...currentPage.value.blocks[index],
          ...response.data,
        };
      }
    } catch (err: any) {
      console.error("Erro ao atualizar bloco:", err);
      throw err;
    }
  }

  async function deleteBlock(blockId: string) {
    if (!currentPage.value) return;
    try {
      await api.delete(`/blocks/${blockId}`);
      currentPage.value.blocks = currentPage.value.blocks.filter(
        (b) => b.id !== blockId
      );
    } catch (err: any) {
      console.error("Erro ao deletar bloco:", err);
      throw err;
    }
  }

  async function reorderBlocks(newOrder: Block[]) {
    if (!currentPage.value) return;

    currentPage.value.blocks = newOrder;

    try {
      const payload = newOrder.map((block, index) => ({
        id: block.id,
        order: index,
      }));

      await api.put("/blocks/reorder", { blocks: payload });
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
