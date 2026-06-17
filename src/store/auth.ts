import { computed, ref } from "vue";
import { defineStore } from "pinia";

import router from "@/router";
import api from "@/services/api";
import {
  clearPendingSocialProvider,
  clearSessionStorage,
  getAccessToken,
  getPendingSocialAuth,
  getPendingSocialProvider,
  getPendingSocialState,
  getStoredUser,
  setPendingSocialAuth,
  setSessionTokens,
  setStoredUser,
  type SocialProvider,
} from "@/services/authSession";

type UserRole = "FREE" | "PREMIUM";

export interface Account {
  id: string;
  provider: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles: string[];
  image?: string | null;
  imageProvider: string;
  googleImage?: string | null;
  discordImage?: string | null;
  accounts: Account[];
  CustomDomain?: {
    id: string;
    domain: string;
    verified: boolean;
  } | null;
  spotifyConnection?: {
    status: string;
    spotifyUserId: string;
    spotifyUserName: string;
    spotifyUserEmail: string;
    profileUrl?: string | null;
    avatarUrl?: string | null;
    country?: string | null;
    product?: string | null;
    followersTotal?: number | null;
    connectedAt?: string | null;
    disconnectedAt?: string | null;
    lastSyncedAt?: string | null;
  } | null;
}

interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
}

interface SocialAuthorizationResponse {
  provider: SocialProvider;
  state: string;
  authorizationUrl: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  active: boolean;
}

interface AuthSessionsResponse {
  sessions: AuthSession[];
}

function extractAuthErrorMessage(error: any, fallback: string) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallback;
}

interface CurrentUserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  image?: string | null;
  imageProvider?: string | null;
  googleImage?: string | null;
  discordImage?: string | null;
  accounts?: Account[];
  spotifyConnection?: User["spotifyConnection"];
}

function mapCurrentUser(response: CurrentUserResponse): User {
  const roles = response.roles || [];
  const isPremiumUser = roles.includes("PREMIUM");

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    role: isPremiumUser ? "PREMIUM" : "FREE",
    roles,
    image: response.image ?? null,
    imageProvider: response.imageProvider ?? "LOCAL",
    googleImage: response.googleImage ?? null,
    discordImage: response.discordImage ?? null,
    accounts: response.accounts ?? [],
    CustomDomain: null,
    spotifyConnection: response.spotifyConnection ?? null,
  };
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(getAccessToken());
  const user = ref<User | null>(getStoredUser<User>());
  const sessions = ref<AuthSession[]>([]);
  const isLoadingSessions = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isPremium = computed(
    () =>
      user.value?.role === "PREMIUM" ||
      user.value?.roles.includes("PREMIUM") ||
      false,
  );
  const isDiscordConnected = computed(
    () =>
      user.value?.accounts.some((acc) => acc.provider === "discord") ?? false,
  );
  const isGoogleConnected = computed(
    () =>
      user.value?.accounts.some((acc) => acc.provider === "google") ?? false,
  );

  function setTokens(
    payload: Pick<AuthTokenResponse, "accessToken" | "refreshToken">,
  ) {
    setSessionTokens(payload.accessToken, payload.refreshToken);
    token.value = payload.accessToken;
    api.defaults.headers.common["Authorization"] =
      `Bearer ${payload.accessToken}`;
  }

  function setUser(newUser: User) {
    setStoredUser(newUser);
    user.value = newUser;
  }

  function clearAuth() {
    clearSessionStorage();
    sessions.value = [];
    token.value = null;
    user.value = null;
    delete api.defaults.headers.common["Authorization"];
  }

  async function login(credentials: {
    email: string;
    password: string;
    turnstileToken?: string | null;
  }) {
    const response = await api.post<AuthTokenResponse>(
      "/auth/login",
      credentials,
    );
    setTokens(response.data);
    await fetchUser();
  }

  async function register(details: {
    name: string;
    email: string;
    password: string;
    turnstileToken?: string | null;
  }) {
    await api.post("/auth/register", details);
    return true;
  }

  async function verifyEmail(payload: { email: string; token: string }) {
    await api.post("/auth/verify-email", payload);
    return true;
  }

  async function resendVerificationEmail(
    email: string,
    turnstileToken?: string | null,
  ) {
    await api.post("/auth/resend-verification", { email, turnstileToken });
    return true;
  }

  async function requestPasswordReset(email: string) {
    await api.post("/auth/forgot-password", { email });
    return true;
  }

  async function resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
  }) {
    await api.post("/auth/reset-password", payload);
    return true;
  }

  async function fetchUser() {
    if (!token.value) {
      return;
    }

    try {
      const response = await api.get<CurrentUserResponse>("/auth/me");
      setUser(mapCurrentUser(response.data));
    } catch (error) {
      console.error("Erro ao buscar usuario, limpando autenticacao.", error);
      clearAuth();
    }
  }

  async function startSocialLogin(provider: SocialProvider) {
    clearPendingSocialProvider();
    const response = await api.get<SocialAuthorizationResponse>(
      `/auth/oauth/${provider}/authorize`,
    );

    if (
      response.data.provider !== provider ||
      !response.data.state ||
      !response.data.authorizationUrl
    ) {
      throw new Error("Resposta OAuth invalida ao iniciar login social.");
    }

    setPendingSocialAuth(provider, response.data.state);
    window.location.assign(response.data.authorizationUrl);
  }

  async function completeSocialLogin(params: {
    provider?: string | null;
    code: string;
    state: string;
  }) {
    const pendingSocialAuth = getPendingSocialAuth();
    const provider =
      (params.provider as SocialProvider | null) ??
      pendingSocialAuth?.provider ??
      getPendingSocialProvider();

    if (provider !== "google" && provider !== "discord") {
      throw new Error("Provider social invalido ou ausente.");
    }

    if (
      pendingSocialAuth?.provider &&
      pendingSocialAuth.provider !== provider
    ) {
      clearPendingSocialProvider();
      throw new Error("Provider OAuth invalido ou divergente.");
    }

    const pendingState = pendingSocialAuth?.state ?? getPendingSocialState();
    if (!pendingState || pendingState !== params.state) {
      clearPendingSocialProvider();
      throw new Error("State OAuth invalido ou expirado.");
    }

    const response = await api.get<AuthTokenResponse>(
      `/auth/oauth/${provider}/callback`,
      {
        params: {
          code: params.code,
          state: params.state,
        },
      },
    );

    setTokens(response.data);
    clearPendingSocialProvider();
    await fetchUser();
  }

  async function fetchSessions() {
    isLoadingSessions.value = true;
    try {
      const response = await api.get<AuthSessionsResponse>("/auth/sessions");
      sessions.value = response.data.sessions;
      return response.data.sessions;
    } catch (error: any) {
      throw new Error(
        extractAuthErrorMessage(
          error,
          "Nao foi possivel carregar as sessoes da conta.",
        ),
      );
    } finally {
      isLoadingSessions.value = false;
    }
  }

  async function revokeSession(sessionId: string) {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      sessions.value = sessions.value.map((session) =>
        session.id === sessionId
          ? { ...session, revoked: true, active: false }
          : session,
      );
    } catch (error: any) {
      throw new Error(
        extractAuthErrorMessage(error, "Nao foi possivel encerrar a sessao."),
      );
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      await api.delete(`/auth/sessions/${sessionId}/delete`);
      sessions.value = sessions.value.filter(
        (session) => session.id !== sessionId,
      );
    } catch (error: any) {
      throw new Error(
        extractAuthErrorMessage(error, "Nao foi possivel excluir a sessao."),
      );
    }
  }

  async function logoutAllSessions() {
    try {
      await api.post("/auth/logout-all");
    } catch (error: any) {
      throw new Error(
        extractAuthErrorMessage(
          error,
          "Nao foi possivel encerrar todas as sessoes.",
        ),
      );
    }

    sessions.value = [];
    clearAuth();
    await router.push("/login");
  }

  async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (error) {
        console.warn("Falha ao revogar refresh token no logout.", error);
      }
    }

    clearAuth();
    await router.push("/login");
  }

  if (token.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  return {
    token,
    user,
    isAuthenticated,
    isPremium,
    isDiscordConnected,
    isGoogleConnected,
    sessions,
    isLoadingSessions,
    login,
    register,
    logout,
    fetchSessions,
    revokeSession,
    deleteSession,
    logoutAllSessions,
    fetchUser,
    setUser,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    setTokens,
    startSocialLogin,
    completeSocialLogin,
  };
});
