<template>
    <div
        class="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl h-full">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <SparklesIcon class="w-6 h-6 text-yellow-400" />
                Profile Completion
            </h2>
            <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                {{ completion.percentage }}%
            </span>
        </div>

        <div class="mb-6">
            <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                <div class="h-3 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-yellow-500 via-pink-500 to-indigo-500"
                    :style="{ width: completion.percentage + '%' }">

                </div>
            </div>
        </div>

        <div v-if="completion.percentage < 100"
            class="mb-6 flex items-start gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl transition-all duration-300 hover:border-amber-500/50">
            <ExclamationTriangleIcon class="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
                <h3 class="font-semibold text-amber-300 mb-1">Seu perfil ainda não está completo!</h3>
                <p class="text-sm text-amber-400/90">Complete as etapas para torná-lo mais atraente.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CompletionItem v-for="item in completion.tasks" :key="item.label" :label="item.label"
                :completed="item.completed" :to="item.to" :action="item.action" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SparklesIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import CompletionItem from '@/components/dashboard/CompletionItem.vue'; // Você já tinha este componente

defineProps<{
    completion: {
        percentage: number;
        tasks: Array<{
            label: string;
            completed: boolean;
            to?: string;
            action?: () => void;
        }>;
    };
}>();
</script>

<style scoped>
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}
</style>