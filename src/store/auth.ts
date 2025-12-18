import { defineStore } from "pinia";
import { ref, computed } from "vue";

import router from "@/router";
import api from "@/services/api";

type UserRole = "FREE" | "PREMIUM";

export interface Account {
  id: string;
  provider: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const isAuthenticated = computed(() => !!token.value);

  const isPremium = computed(() => user.value?.role === "PREMIUM");

  const isDiscordConnected = computed(
    () =>
      user.value?.accounts.some((acc) => acc.provider === "discord") ?? false
  );

  const isGoogleConnected = computed(
    () => user.value?.accounts.some((acc) => acc.provider === "google") ?? false
  );

  function setToken(newToken: string | string[]) {
    const tokenStr = Array.isArray(newToken) ? newToken[0] : newToken;

    if (typeof tokenStr === "string") {
      localStorage.setItem("token", tokenStr);
      token.value = tokenStr;
    }
  }

  function setUser(newUser: User) {
    localStorage.setItem("user", JSON.stringify(newUser));
    user.value = newUser;
  }

  function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    token.value = null;
    user.value = null;
    delete api.defaults.headers.common["Authorization"];
  }

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post("/auth/login", credentials);
    const { token } = response.data;
    setToken(token);

    await fetchUser();
  }

  async function register(details: any) {
    await api.post("/auth/register", details);
  }

  async function verifyEmail(payload: { email: string; token: string }) {
    const response = await api.post("/auth/verify-email", payload);
    return response.data;
  }

  async function fetchUser() {
    if (token.value) {
      try {
        const response = await api.get<User>("/users/me");

        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário, limpando autenticação.", error);
        clearAuth();
      }
    }
  }

  function logout() {
    clearAuth();
    router.push("/login");
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
    login,
    register,
    logout,
    fetchUser,
    setUser,
    verifyEmail,
    setToken,
  };
});
