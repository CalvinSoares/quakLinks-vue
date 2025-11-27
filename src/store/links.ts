import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// Reutilize sua instância do Axios configurada com o token
const api = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
  }/links`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface baseada no seu schema Prisma
export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  clickCount: number; // Adicionando clickCount que vem da Page
  // Novos campos opcionais para agendamento
  isActive?: boolean;
  scheduledAt?: string | null;
  expiresAt?: string | null;
}

type CreateLinkPayload = Omit<Link, "id" | "order" | "clickCount" | "isActive">;
type UpdateLinkPayload = Partial<CreateLinkPayload>;

export const useLinkStore = defineStore("link", () => {
  // --- STATE ---
  const links = ref<Link[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // --- ACTIONS ---

  // Inicializa a store com os links vindos da pageStore
  function setLinks(initialLinks: Link[]) {
    links.value = [...initialLinks].sort((a, b) => a.order - b.order);
  }

  // POST /links
  async function createLink(data: CreateLinkPayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<Link>("/", data);
      links.value.push(response.data);
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao criar o link.";
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  // ATUALIZADO: updateLink para aceitar os novos campos
  async function updateLink(linkId: string, data: UpdateLinkPayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put<Link>(`/${linkId}`, data);
      const index = links.value.findIndex((link) => link.id === linkId);
      if (index !== -1) {
        // Atualiza o link local com os dados retornados
        links.value[index] = { ...links.value[index], ...response.data };
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao atualizar o link.";
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  // DELETE /links/:linkId
  async function deleteLink(linkId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(`/${linkId}`);
      links.value = links.value.filter((link) => link.id !== linkId);
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao deletar o link.";
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  // PUT /links/reorder
  async function reorderLinks() {
    isLoading.value = true;
    error.value = null;
    // Cria o payload que a API espera
    const payload = links.value.map((link, index) => ({
      id: link.id,
      order: index,
    }));
    try {
      await api.put("/reorder", payload);
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erro ao reordenar os links.";
      // Opcional: reverter a ordem visual se a API falhar
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    links,
    isLoading,
    error,
    setLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
});
