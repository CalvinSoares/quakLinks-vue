import api from "@/services/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export type TimePeriod = "7d" | "30d" | "90d" | "all";

// --- DEFINIÇÃO DE TIPOS ---
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  clickThroughRate: number;
  viewsOverTime: { date: string; views: number }[];
  clicksOverTime: { date: string; clicks: number }[];
  topLinks: { title: string; url: string; clicks: number }[];
  topReferrers: { source: string; views: number }[];
  topCountries: { country: string; views: number }[];
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const analytics = ref<AnalyticsData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAnalytics(period: TimePeriod = "30d") {
    isLoading.value = true;
    error.value = null;
    try {
      // Supondo que você criará a rota GET /analytics no backend
      const response = await api.get<AnalyticsData>("/analytics/my-page", {
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
