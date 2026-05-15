import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import { useAuthStore } from "./auth";

export const useSpotifyStore = defineStore("spotify", () => {
  const authStore = useAuthStore();
  const isConnected = ref(false);
  const isLoading = ref(false);
  const connection = ref<any | null>(null);

  function applyConnection(data: any) {
    connection.value = data;
    isConnected.value = data?.status === "CONNECTED";

    if (authStore.user) {
      authStore.user.spotifyConnection = data;
    }
  }

  async function checkConnectionStatus() {
    isLoading.value = true;
    try {
      const response = await api.get("/spotify/connection");
      applyConnection(response.data);
    } catch (error) {
      console.error("Erro ao verificar conexão com Spotify:", error);
      connection.value = null;
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  async function startConnection() {
    const response = await api.get<{ authorizationUrl: string }>(
      "/spotify/authorize",
    );
    window.location.assign(response.data.authorizationUrl);
  }

  async function completeConnection(payload: { code: string; state: string }) {
    const response = await api.get("/spotify/callback", {
      params: payload,
    });
    applyConnection(response.data);
    await authStore.fetchUser();
    return response.data;
  }

  async function syncProfile() {
    const response = await api.post("/spotify/sync");
    applyConnection(response.data);
    await authStore.fetchUser();
    return response.data;
  }

  async function disconnect() {
    await api.delete("/spotify/connection");
    connection.value = null;
    isConnected.value = false;
    await authStore.fetchUser();
  }

  return {
    connection,
    isConnected,
    isLoading,
    startConnection,
    completeConnection,
    checkConnectionStatus,
    syncProfile,
    disconnect,
  };
});
