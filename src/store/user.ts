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

interface CustomDomainResponse {
  id: string;
  pageId: string;
  domain: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VerifyCustomDomainResponse {
  success: boolean;
  message: string;
  domain: CustomDomainResponse;
}

export const useUserStore = defineStore("user", () => {
  async function updateUserProfile(data: UserUpdatePayload) {
    const authStore = useAuthStore();
    const currentUser = authStore.user;

    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      const response = await api.put(`/users/me`, data);
      await authStore.fetchUser();
      return response.data;
    } catch (err: any) {
      console.error("Erro ao atualizar o perfil:", err);
      const errorMessage =
        err.response?.data?.message || "Não foi possível salvar as alterações.";
      throw new Error(errorMessage);
    }
  }

  async function updateEmail(payload: UpdateEmailPayload) {
    if (!payload.currentPassword || !payload.newEmail) {
      throw new Error("Preencha a senha atual e o novo e-mail.");
    }

    if (payload.newEmail !== payload.confirmNewEmail) {
      throw new Error("A confirmacao do novo e-mail nao confere.");
    }

    try {
      await api.put("/auth/email", {
        currentPassword: payload.currentPassword,
        newEmail: payload.newEmail,
      });
      return true;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Nao foi possivel alterar o e-mail.",
      );
    }
  }

  async function updatePassword(payload: UpdatePasswordPayload) {
    if (!payload.currentPassword || !payload.newPassword) {
      throw new Error("Preencha a senha atual e a nova senha.");
    }

    if (payload.newPassword !== payload.confirmNewPassword) {
      throw new Error("A confirmacao da nova senha nao confere.");
    }

    try {
      await api.put("/auth/password", {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
      return true;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Nao foi possivel alterar a senha.",
      );
    }
  }

  async function unlinkDiscord() {
    return unlinkAccount("discord");
  }

  // Função genérica para desvincular contas
  async function unlinkAccount(provider: "discord" | "google") {
    const authStore = useAuthStore();

    try {
      await api.delete(`/auth/connections/${provider}`);
      await authStore.fetchUser();
      return true;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          `Nao foi possivel desvincular ${provider}.`,
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
        err.response?.data?.message || "Não foi possível iniciar o pagamento.",
      );
    }
  }

  async function fetchCustomDomain(pageId: string) {
    try {
      const response = await api.get<CustomDomainResponse>(
        `/pages/${pageId}/domain`,
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      console.error("Erro ao buscar o estado do dominio:", err);
      throw new Error(
        err.response?.data?.message || "Erro ao buscar dominio customizado.",
      );
    }
  }

  async function addCustomDomain(pageId: string, domain: string) {
    try {
      const response = await api.post<CustomDomainResponse>(
        `/pages/${pageId}/domain`,
        { domain },
      );
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao adicionar dominio.",
      );
    }
  }

  async function removeCustomDomain(pageId: string) {
    try {
      await api.delete(`/pages/${pageId}/domain`);
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao remover dominio.",
      );
    }
  }

  async function verifyCustomDomain(pageId: string) {
    try {
      const response = await api.post<VerifyCustomDomainResponse>(
        `/pages/${pageId}/domain/verify`,
      );
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erro ao verificar dominio.",
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
