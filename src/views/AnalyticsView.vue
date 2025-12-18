<template>
    <DashboardLayout>
        <div class="space-y-8">
            <OverviewHeader title="Analytics" subtitle="Acompanhe o desempenho da sua página em tempo real."
                :icon="ChartBarIcon" class="flex-grow" />

            <div class="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 w-fit">
                <button v-for="period in timePeriods" :key="period.value" @click="handlePeriodChange(period.value)"
                    :class="[
                        'px-4 py-2 font-semibold text-sm transition-all duration-300 rounded-lg',
                        selectedPeriod === period.value
                            ? 'text-slate-900 bg-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    ]">
                    {{ period.label }}
                </button>
            </div>

            <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center space-y-4">
                    <div
                        class="w-16 h-16 mx-auto border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin">
                    </div>
                    <p class="text-slate-400">Carregando estatísticas...</p>
                </div>
            </div>

            <div v-else-if="error" class="text-center p-8 bg-slate-800/50 rounded-2xl border border-red-500/30">
                <h2 class="text-2xl font-bold text-red-400">Ocorreu um erro</h2>
                <p class="mt-2 text-slate-400">{{ error }}</p>
                <button @click="analyticsStore.fetchAnalytics(selectedPeriod)"
                    class="mt-4 px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-lg">
                    Tentar Novamente
                </button>
            </div>

            <div v-else-if="analytics" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Views" :value="analytics.totalViews" :icon="EyeIcon"
                        gradient-class="from-cyan-500 to-blue-500" />
                    <StatCard title="Total Clicks" :value="analytics.totalClicks" :icon="ClickIcon"
                        gradient-class="from-purple-500 to-indigo-500" />
                    <StatCard title="Click-Through Rate" :value="`${analytics.clickThroughRate.toFixed(2)}%`"
                        :icon="CursorArrowRaysIcon" gradient-class="from-emerald-500 to-teal-500" />
                </div>

                <div class="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-4">Views e Cliques ({{ selectedPeriodLabel }})</h3>

                    <div v-if="chartSeries.length > 0 && chartCategories.length > 0">
                        <ApexLineChart :series="chartSeries" :categories="chartCategories" />
                    </div>

                    <div v-else class="flex items-center justify-center h-[350px] text-slate-500">
                        <p>Não há dados suficientes para exibir o gráfico.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AnalyticsListCard title="Top Links" :items="topLinks" icon-color="text-purple-400" />
                    <AnalyticsListCard title="Top Referrers" :items="topReferrers" icon-color="text-sky-400" />
                    <AnalyticsListCard title="Top Countries" :items="topCountries" icon-color="text-green-400" />
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAnalyticsStore, type TimePeriod } from '@/store/analytics';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

import StatCard from '@/components/dashboard/StatCard.vue';
import AnalyticsListCard from '@/components/analytics/AnalyticsListCard.vue';

import { ChartBarIcon, EyeIcon, CursorArrowRaysIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { ClickIcon } from 'vue-tabler-icons';
import OverviewHeader from '@/components/dashboard/OverviewHeader.vue';
import ApexLineChart from '@/components/charts/ApexLineChart.vue';


const analyticsStore = useAnalyticsStore();
const { analytics, isLoading, error } = storeToRefs(analyticsStore);

onMounted(() => {
    if (!analytics.value) {
        analyticsStore.fetchAnalytics();
    }
});

const selectedPeriod = ref<TimePeriod>('30d');
const timePeriods = [
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Últimos 90 dias', value: '90d' },
    { label: 'Todo o período', value: 'all' },
] as const;

const selectedPeriodLabel = computed(() => {
    return timePeriods.find(p => p.value === selectedPeriod.value)?.label || 'Carregando...';
});

function handlePeriodChange(newPeriod: TimePeriod) {
    selectedPeriod.value = newPeriod;
    analyticsStore.fetchAnalytics(newPeriod);
}


const chartSeries = computed(() => {
    if (!analytics.value) return [];
    return [
        {
            name: 'Views',
            data: analytics.value.viewsOverTime.map(item => item.views),
        },
        {
            name: 'Cliques',
            data: analytics.value.clicksOverTime.map(item => item.clicks),
        },
    ];
});

const chartCategories = computed(() => {
    if (!analytics.value) return [];
    return analytics.value.viewsOverTime.map(item =>
        new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    );
});

const topLinks = computed(() => analytics.value?.topLinks.map(l => ({ label: l.title, value: l.clicks })));
const topReferrers = computed(() => analytics.value?.topReferrers.map(r => ({ label: r.source, value: r.views })));
const topCountries = computed(() => analytics.value?.topCountries.map(c => ({ label: c.country, value: c.views })));
</script>