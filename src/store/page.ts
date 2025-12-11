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
  discordAvatarUrl: string | null;
  useDiscordAvatar: boolean;
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
  audios: Audio[];

  profileRingType?: string | null;
  profileRingColors?: string[];
}

export const usePageStore = defineStore("page", () => {
  const currentPage = ref<Page | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchMyPage() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<Page>("/pages/my-page");
      console.log("response.data", response.data);
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

  /**
   * Atualiza a página do usuário autenticado.
   * Corresponde à rota PUT /pages/my-page
   * @param {Partial<Page>} pageData - Os dados a serem atualizados.
   */
  async function updateMyPage(pageData: Partial<Page>) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put<Page>("/pages/my-page", pageData);
      currentPage.value = response.data; // Atualiza o state com os dados retornados
      return response.data; // Retorna os dados para possível feedback na UI (ex: "Salvo!")
    } catch (err: any) {
      console.error("Erro ao atualizar a página:", err);
      error.value =
        err.response?.data?.message || "Não foi possível salvar as alterações.";
      throw new Error(error.value || "erro"); // Lança o erro para que o componente possa tratá-lo
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Busca uma página pública pelo seu slug.
   * Corresponde à rota GET /pages/:slug
   * @param {string} slug - O slug da página a ser buscada.
   */
  async function fetchPageBySlug(slug: string) {
    isLoading.value = true;
    error.value = null;
    currentPage.value = null; // Limpa a página anterior
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
      // Atualiza o estado local para refletir qual áudio está ativo
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

  return {
    currentPage,
    isLoading,
    error,
    fetchMyPage,
    updateMyPage,
    fetchPageBySlug,
    addAudio,
    updateAudio,
    deleteAudio,
    setActiveAudio,
  };
});
