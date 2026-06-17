import { acceptHMRUpdate, defineStore } from "pinia";
import { useAuthStore } from "./auth";
import api from "@/services/api";
import { withIdempotencyKey } from "@/services/idempotency";

interface UserUpdatePayload {
  name?: string;
  image?: string | null;
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

export interface CustomDomainResponse {
  id: string;
  ownerId: string;
  pageId: string | null;
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

interface CheckoutSessionResponse {
  checkoutUrl?: string;
  url?: string;
  customerId?: string;
}

export interface BillingStatusResponse {
  userId: string;
  email: string;
  premium: boolean;
  billingCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  lastProcessedEventId: string | null;
  roles: string[];
}

export interface BillingWebhookEventResponse {
  eventId: string;
  billingCustomerId: string;
  subscriptionId: string | null;
  type: string;
  eventCreatedAt: string;
  processed: boolean;
  outcome: string;
  createdAt: string;
}

interface BillingWebhookEventsResponse {
  events: BillingWebhookEventResponse[];
}

function extractApiErrorMessage(err: any, fallback: string) {
  const data = err?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallback;
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
      const response = await api.post<CheckoutSessionResponse>(
        "/billing/checkout",
        undefined,
        withIdempotencyKey("billing-checkout"),
      );
      const checkoutUrl = response.data.checkoutUrl || response.data.url;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
      } else {
        throw new Error("URL de checkout não recebida pelo backend.");
      }
    } catch (err: any) {
      console.error("Erro ao iniciar o checkout:", err);
      throw new Error(
        err.response?.data?.message || "Não foi possível iniciar o pagamento.",
      );
    }
  }

  async function fetchBillingStatus() {
    try {
      const response = await api.get<BillingStatusResponse>("/billing/me");
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Não foi possível carregar o status do billing.",
      );
    }
  }

  async function fetchBillingEvents() {
    try {
      const response =
        await api.get<BillingWebhookEventsResponse>("/billing/me/events");
      return response.data.events || [];
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Não foi possível carregar o histórico de billing.",
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
      throw new Error(extractApiErrorMessage(err, "Erro ao buscar dominio customizado."));
    }
  }

  async function addCustomDomain(pageId: string, domain: string) {
    return addOwnedDomain(domain, pageId);
  }

  async function listOwnedDomains() {
    try {
      const response = await api.get<CustomDomainResponse[]>("/domains");
      return response.data;
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao listar dominios."));
    }
  }

  async function addOwnedDomain(domain: string, pageId?: string | null) {
    try {
      const response = await api.post<CustomDomainResponse>(
        "/domains",
        {
          domain,
          pageId: pageId ?? null,
        },
        withIdempotencyKey("domain-add"),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao adicionar dominio."));
    }
  }

  async function removeCustomDomain(pageId: string) {
    const customDomain = await fetchCustomDomain(pageId);
    if (!customDomain) {
      return;
    }

    return deleteOwnedDomain(customDomain.id);
  }

  async function assignOwnedDomain(domainId: string, pageId: string) {
    try {
      const response = await api.post<CustomDomainResponse>(
        `/domains/${domainId}/assign`,
        { pageId },
        withIdempotencyKey("domain-assign"),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao vincular dominio."));
    }
  }

  async function unassignOwnedDomain(domainId: string) {
    try {
      const response = await api.post<CustomDomainResponse>(
        `/domains/${domainId}/unassign`,
        undefined,
        withIdempotencyKey("domain-unassign"),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao desvincular dominio."));
    }
  }

  async function deleteOwnedDomain(domainId: string) {
    try {
      await api.delete(`/domains/${domainId}`);
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao remover dominio."));
    }
  }

  async function verifyCustomDomain(pageId: string) {
    const customDomain = await fetchCustomDomain(pageId);
    if (!customDomain) {
      throw new Error("Dominio nao configurado.");
    }

    return verifyOwnedDomain(customDomain.id);
  }

  async function verifyOwnedDomain(domainId: string) {
    try {
      const response = await api.post<VerifyCustomDomainResponse>(
        `/domains/${domainId}/verify`,
        undefined,
        withIdempotencyKey("domain-verify"),
      );
      return response.data;
    } catch (err: any) {
      throw new Error(extractApiErrorMessage(err, "Erro ao verificar dominio."));
    }
  }

  return {
    updateUserProfile,
    updateEmail,
    updatePassword,
    unlinkDiscord,
    redirectToCheckout,
    fetchBillingStatus,
    fetchBillingEvents,
    listOwnedDomains,
    addOwnedDomain,
    assignOwnedDomain,
    unassignOwnedDomain,
    deleteOwnedDomain,
    verifyOwnedDomain,
    addCustomDomain,
    removeCustomDomain,
    verifyCustomDomain,
    fetchCustomDomain,
    unlinkAccount,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
