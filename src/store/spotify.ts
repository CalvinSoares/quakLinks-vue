import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/api";
import { useAuthStore } from "./auth";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

export const useSpotifyStore = defineStore("spotify", () => {
  const authStore = useAuthStore();
  const isConnected = ref(false);
  const isLoading = ref(true);

  async function checkConnectionStatus() {
    isLoading.value = true;
    try {
      const response = await api.get("/spotify/status");
      isConnected.value = response.data.isConnected;
    } catch (error) {
      console.error("Erro ao verificar conexão com Spotify:", error);
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  async function searchTracks(query: string): Promise<SpotifyTrack[]> {
    if (query.length < 3) return [];
    try {
      const response = await api.get("/spotify/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na busca de músicas:", error);
      return [];
    }
  }

  const connectUrl = computed(() => {
    const baseUrl =
      import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api/v1";

    return `${baseUrl}/auth/spotify?token=${authStore.token}`;
  });

  return {
    isConnected,
    isLoading,
    connectUrl,
    checkConnectionStatus,
    searchTracks,
  };
});
