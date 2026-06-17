<template>
    <DashboardLayout>
        <div class="space-y-8">
            <OverviewHeader :title="copy.headerTitle" :subtitle="copy.headerSubtitle" :icon="ChartBarIcon"
                class="flex-grow" />

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

            <div class="w-full max-w-sm">
                <label class="ui-label">{{ copy.pageLabel }}</label>
                <CustomDropdown
                    v-model="selectedPageSlug"
                    :options="pageDropdownOptions"
                    :placeholder="copy.pageLabel"
                    @update:model-value="handlePageChange"
                />
            </div>

            <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center space-y-4">
                    <div
                        class="w-16 h-16 mx-auto border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin">
                    </div>
                    <p class="text-slate-400">{{ copy.loading }}</p>
                </div>
            </div>

            <div v-else-if="error" class="text-center p-8 bg-slate-800/50 rounded-2xl border border-red-500/30">
                <h2 class="text-2xl font-bold text-red-400">{{ copy.errorTitle }}</h2>
                <p class="mt-2 text-slate-400">{{ error }}</p>
                <button @click="analyticsStore.fetchAnalytics(selectedPeriod)"
                    class="mt-4 px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-lg">
                    {{ copy.tryAgain }}
                </button>
            </div>

            <div v-else-if="analytics" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard :title="copy.totalViews" :value="analytics.totalViews" :icon="EyeIcon"
                        gradient-class="from-cyan-500 to-blue-500" />
                    <StatCard :title="copy.totalClicks" :value="analytics.totalClicks" :icon="ClickIcon"
                        gradient-class="from-purple-500 to-indigo-500" />
                    <StatCard :title="copy.ctr" :value="`${analytics.clickThroughRate.toFixed(2)}%`"
                        :icon="CursorArrowRaysIcon" gradient-class="from-emerald-500 to-teal-500" />
                </div>

                <div class="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-2">{{ copy.summaryTitle }}</h3>
                    <p class="text-slate-400">
                        {{ copy.summaryPrefix }} <span class="text-white font-semibold">/{{ analytics.slug }}</span>
                        {{ copy.summarySuffix(selectedPeriodLabel.toLowerCase()) }}.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnalyticsListCard :title="copy.topBlocks" icon-key="Top Blocos" :items="topBlocks"
                        icon-color="text-purple-400" />
                    <AnalyticsListCard :title="copy.topReferrers" icon-key="Top Referrers" :items="topReferrers"
                        icon-color="text-sky-400" />
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAnalyticsStore, type TimePeriod } from '@/store/analytics';
import { usePageStore } from '@/store/page';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

import StatCard from '@/components/dashboard/StatCard.vue';
import AnalyticsListCard from '@/components/analytics/AnalyticsListCard.vue';

import { ChartBarIcon, EyeIcon, CursorArrowRaysIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { ClickIcon } from 'vue-tabler-icons';
import OverviewHeader from '@/components/dashboard/OverviewHeader.vue';
import { useAppLanguage } from '@/composables/useAppLanguage';
import CustomDropdown from '@/components/ui/CustomDropdown.vue';


const analyticsStore = useAnalyticsStore();
const pageStore = usePageStore();
const { analytics, isLoading, error } = storeToRefs(analyticsStore);
const { currentPage, userPages } = storeToRefs(pageStore);
const { locale } = useAppLanguage();

const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                headerTitle: 'Analytics',
                headerSubtitle: 'Track your page performance in real time.',
                loading: 'Loading statistics...',
                errorTitle: 'An error occurred',
                tryAgain: 'Try Again',
                totalViews: 'Total Views',
                totalClicks: 'Total Clicks',
                ctr: 'Click-Through Rate',
                summaryTitle: 'Page Summary',
                summaryPrefix: 'Showing aggregated metrics for',
                summarySuffix: (period: string) => `for ${period}`,
                topBlocks: 'Top Blocks',
                topReferrers: 'Top Referrers',
                loadingLabel: 'Loading...',
                pageLabel: 'Page',
                periods: {
                    seven: 'Last 7 days',
                    thirty: 'Last 30 days',
                    ninety: 'Last 90 days',
                    all: 'All time',
                },
                blockFallback: 'Block',
            };
        case 'es':
            return {
                headerTitle: 'Analytics',
                headerSubtitle: 'Acompaña el rendimiento de tu página en tiempo real.',
                loading: 'Cargando estadísticas...',
                errorTitle: 'Ocurrió un error',
                tryAgain: 'Intentar de nuevo',
                totalViews: 'Vistas Totales',
                totalClicks: 'Clicks Totales',
                ctr: 'Tasa de Clicks',
                summaryTitle: 'Resumen de la Página',
                summaryPrefix: 'Mostrando métricas agregadas de',
                summarySuffix: (period: string) => `para ${period}`,
                topBlocks: 'Top Bloques',
                topReferrers: 'Top Referrers',
                loadingLabel: 'Cargando...',
                pageLabel: 'Página',
                periods: {
                    seven: 'Últimos 7 días',
                    thirty: 'Últimos 30 días',
                    ninety: 'Últimos 90 días',
                    all: 'Todo el período',
                },
                blockFallback: 'Bloque',
            };
        default:
            return {
                headerTitle: 'Analytics',
                headerSubtitle: 'Acompanhe o desempenho da sua página em tempo real.',
                loading: 'Carregando estatísticas...',
                errorTitle: 'Ocorreu um erro',
                tryAgain: 'Tentar Novamente',
                totalViews: 'Total Views',
                totalClicks: 'Total Clicks',
                ctr: 'Click-Through Rate',
                summaryTitle: 'Resumo da Página',
                summaryPrefix: 'Exibindo métricas agregadas de',
                summarySuffix: (period: string) => `para ${period}`,
                topBlocks: 'Top Blocos',
                topReferrers: 'Top Referrers',
                loadingLabel: 'Carregando...',
                pageLabel: 'Página',
                periods: {
                    seven: 'Últimos 7 dias',
                    thirty: 'Últimos 30 dias',
                    ninety: 'Últimos 90 dias',
                    all: 'Todo o período',
                },
                blockFallback: 'Bloco',
            };
    }
});

onMounted(() => {
    pageStore.fetchUserPages().then(() => {
        if (!currentPage.value && userPages.value[0]?.slug) {
            selectedPageSlug.value = userPages.value[0].slug;
            return pageStore.selectPageToEdit(userPages.value[0].slug);
        }

        selectedPageSlug.value = currentPage.value?.slug || userPages.value[0]?.slug || '';
    }).finally(() => {
        analyticsStore.fetchAnalytics(selectedPeriod.value, currentPage.value?.id);
    });
});

const selectedPeriod = ref<TimePeriod>('30d');
const selectedPageSlug = ref('');
const timePeriods = computed(() => [
    { label: copy.value.periods.seven, value: '7d' },
    { label: copy.value.periods.thirty, value: '30d' },
    { label: copy.value.periods.ninety, value: '90d' },
    { label: copy.value.periods.all, value: 'all' },
] as const);

const selectedPeriodLabel = computed(() => {
    return timePeriods.value.find(p => p.value === selectedPeriod.value)?.label || copy.value.loadingLabel;
});

const pageOptions = computed(() =>
    userPages.value.map(page => ({
        slug: page.slug,
        title: page.title || `/${page.slug}`,
    }))
);

const pageDropdownOptions = computed(() =>
    pageOptions.value.map(page => ({
        label: page.title,
        value: page.slug,
    }))
);

function handlePeriodChange(newPeriod: TimePeriod) {
    selectedPeriod.value = newPeriod;
    analyticsStore.fetchAnalytics(newPeriod, currentPage.value?.id);
}

async function handlePageChange() {
    if (!selectedPageSlug.value) {
        return;
    }

    await pageStore.selectPageToEdit(selectedPageSlug.value);
    analyticsStore.fetchAnalytics(selectedPeriod.value, currentPage.value?.id);
}

const topBlocks = computed(() => analytics.value?.topBlocks.map(block => ({ label: block.title || copy.value.blockFallback, value: block.clicks })));
const topReferrers = computed(() => analytics.value?.topReferrers.map(r => ({ label: r.source, value: r.views })));
</script>
