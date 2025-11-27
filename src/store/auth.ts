import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

type UserRole = "FREE" | "PREMIUM";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  discordAvatarUrl?: string | null;
  useDiscordAvatar?: boolean;
  CustomDomain?: {
    id: string;
    domain: string;
    verified: boolean;
  } | null;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  console.log("user", user.value);

  const isPremium = computed(() => user.value?.role === "PREMIUM");

  // Actions
  function setToken(newToken: string | string[]) {
    const tokenStr = Array.isArray(newToken) ? newToken[0] : newToken;

    if (typeof tokenStr === "string") {
      localStorage.setItem("token", tokenStr);
      token.value = tokenStr;
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenStr}`;
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

  // Ação de Login
  async function login(credentials: { email: string; password: string }) {
    const response = await api.post("/auth/login", credentials);
    const { token } = response.data;
    setToken(token);

    // Após o login, buscar os dados do usuário
    await fetchUser();
  }

  // Ação de Registro
  async function register(details: any) {
    await api.post("/auth/register", details);
  }

  async function verifyEmail(payload: { email: string; token: string }) {
    const response = await api.post("/auth/verify-email", payload);
    return response.data;
  }

  // Ação para buscar dados do usuário logado
  async function fetchUser() {
    if (token.value) {
      try {
        const response = await api.get<User>("/users/me");

        console.log("user fetch", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário, limpando autenticação.", error);
        clearAuth();
      }
    }
  }

  // Ação de Logout
  function logout() {
    clearAuth();
    router.push("/login");
  }

  // Garante que o header de autorização seja definido ao carregar a store
  if (token.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  return {
    token,
    user,
    isAuthenticated,
    isPremium,
    login,
    register,
    logout,
    fetchUser,
    setUser,
    verifyEmail,
    setToken,
  };
});
