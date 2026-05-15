import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export type TimePeriod = "7d" | "30d" | "90d" | "all";

// --- DEFINIÇÃO DE TIPOS ---
export interface AnalyticsData {
  pageId: string;
  slug: string;
  totalViews: number;
  totalClicks: number;
  clickThroughRate: number;
  topBlocks: { blockId: string; title: string; clicks: number }[];
  topReferrers: { source: string; views: number }[];
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const analytics = ref<AnalyticsData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAnalytics(period: TimePeriod = "30d") {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<AnalyticsData>("/analytics/me", {
        params: { period },
      });
      analytics.value = response.data;
    } catch (err: any) {
      console.error("Erro ao buscar dados de analytics:", err);
      error.value =
        err.response?.data?.message ||
        "Não foi possível carregar as estatísticas.";
    } finally {
      isLoading.value = false;
    }
  }

  // Ação para limpar os dados ao fazer logout, por exemplo
  function clearAnalytics() {
    analytics.value = null;
  }

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    clearAnalytics,
  };
});
