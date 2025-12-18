import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import api from "@/services/api";

interface UserUpdatePayload {
  name?: string;
  imageProvider?: string;
}

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
  async function updateUserProfile(data: UserUpdatePayload) {
    const authStore = useAuthStore();
    const currentUser = authStore.user;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      const response = await api.put(`/users/${currentUser.id}`, data);

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

      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao atualizar e-mail."
      );
    }
  }

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
      const response = await api.delete("/users/me/connections/discord");
      authStore.setUser(response.data);

      return response.data;
    } catch (err: any) {
      console.error("Erro ao desvincular conta do Discord:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível desvincular a conta."
      );
    }
  }

  // Função genérica para desvincular contas
  async function unlinkAccount(provider: "discord" | "google") {
    const authStore = useAuthStore();
    if (!authStore.user) throw new Error("Usuário não autenticado.");

    try {
      const endpoint =
        provider === "discord"
          ? "/users/me/connections/discord"
          : `/users/me/connections/${provider}`;

      const response = await api.delete(endpoint);
      authStore.setUser(response.data);
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || `Erro ao desvincular ${provider}.`
      );
    }
  }

  async function redirectToCheckout() {
    try {
      const response = await api.post("/billing/checkout");

      if (response.data.url) {
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
      await api.delete("/domains");

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
    unlinkAccount,
  };
});
