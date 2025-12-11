import { defineStore } from "pinia";
import { useAuthStore } from "./auth"; // Precisamos da authStore para atualizar os dados locais
import api from "@/services/api";

interface UserUpdatePayload {
  name?: string;
  useDiscordAvatar?: boolean;
}

// --- NOVAS INTERFACES ---
interface UpdateEmailPayload {
  currentPassword?: string;
  newEmail?: string;
  confirmNewEmail?: string;
}

interface UpdatePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const useUserStore = defineStore("user", () => {
  /**
   * Atualiza os dados do perfil do usuário logado.
   * Corresponde à rota PUT /users/:id
   * @param {UserUpdatePayload} data - Os dados a serem atualizados (ex: { name: 'novoNome' }).
   */
  async function updateUserProfile(data: UserUpdatePayload) {
    const authStore = useAuthStore();
    const currentUser = authStore.user;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      // O backend espera o ID do usuário na URL
      const response = await api.put(`/users/${currentUser.id}`, data);

      // IMPORTANTE: Após o sucesso, atualizamos o estado na authStore
      // para que a UI reflita a mudança instantaneamente.
      authStore.setUser(response.data);

      return response.data;
    } catch (err: any) {
      console.error("Erro ao atualizar o perfil:", err);
      const errorMessage =
        err.response?.data?.message || "Não foi possível salvar as alterações.";
      throw new Error(errorMessage);
    }
  }

  async function updateEmail(payload: UpdateEmailPayload) {
    try {
      const response = await api.put("/account/email", payload);
      // Após a atualização, o usuário precisa verificar o novo e-mail
      // e talvez fazer login novamente. A authStore pode ser limpa.
      // const authStore = useAuthStore();
      // authStore.logout(); // Opcional, mas recomendado
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao atualizar e-mail."
      );
    }
  }

  /**
   * Atualiza a senha do usuário logado. Requer senha atual.
   * Corresponde à rota PUT /account/password
   */
  async function updatePassword(payload: UpdatePasswordPayload) {
    try {
      const response = await api.put("/account/password", payload);
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao atualizar senha."
      );
    }
  }

  async function unlinkDiscord() {
    const authStore = useAuthStore();
    if (!authStore.user) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      // Chama a nova rota DELETE que criamos
      const response = await api.delete("/users/me/connections/discord");

      // Atualiza o estado local do usuário com os dados retornados (que terão os campos do Discord como nulos)
      authStore.setUser(response.data);

      return response.data;
    } catch (err: any) {
      console.error("Erro ao desvincular conta do Discord:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível desvincular a conta."
      );
    }
  }

  async function redirectToCheckout() {
    try {
      // A rota de billing está na raiz da API, não em /users
      const response = await api.post("/billing/checkout");

      if (response.data.url) {
        // Redireciona o usuário para a página de pagamento do Stripe
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de checkout não recebida.");
      }
    } catch (err: any) {
      console.error("Erro ao iniciar o checkout:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível iniciar o pagamento."
      );
    }
  }

  async function fetchCustomDomain() {
    const authStore = useAuthStore();
    if (!authStore.isPremium || !authStore.user) return;

    try {
      const response = await api.get("/domains");

      if (authStore.user) {
        authStore.user.CustomDomain = response.data;
      }
    } catch (err: any) {
      console.error("Erro ao buscar o estado do domínio:", err);
    }
  }

  async function addCustomDomain(domain: string) {
    const authStore = useAuthStore();

    try {
      // Usamos uma chamada POST para a rota de domínios
      const response = await api.post("/domains", { domain });

      if (authStore.user) {
        authStore.user.CustomDomain = response.data;
      }

      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao adicionar domínio."
      );
    }
  }

  async function removeCustomDomain() {
    const authStore = useAuthStore();
    try {
      // Chama a nova rota DELETE
      await api.delete("/domains");

      // Atualiza o usuário localmente para remover o domínio
      if (authStore.user) {
        authStore.user.CustomDomain = null;
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao remover domínio."
      );
    }
  }

  async function verifyCustomDomain() {
    const authStore = useAuthStore();

    try {
      const response = await api.post("/domains/verify");
      // Refazer o fetch para pegar o status 'verified: true'
      if (
        authStore.user &&
        authStore.user.CustomDomain &&
        response.data.success
      ) {
        authStore.user.CustomDomain.verified = true;
      }

      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao verificar domínio."
      );
    }
  }

  return {
    updateUserProfile,
    updateEmail,
    updatePassword,
    unlinkDiscord,
    redirectToCheckout,
    addCustomDomain,
    removeCustomDomain,
    verifyCustomDomain,
    fetchCustomDomain,
  };
});
