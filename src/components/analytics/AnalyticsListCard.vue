<template>
    <div class="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <component :is="iconMap[title]" :class="['w-6 h-6', iconColor]" />
            {{ title }}
        </h3>
        <ul v-if="items && items.length" class="space-y-2">
            <li v-for="(item, index) in items" :key="index" class="flex justify-between items-center text-sm">
                <span class="text-slate-300 truncate">{{ item.label }}</span>
                <span class="font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded">{{ item.value.toLocaleString()
                }}</span>
            </li>
        </ul>
        <p v-else class="text-sm text-slate-500">Nenhum dado disponível.</p>
    </div>
</template>

<script setup lang="ts">
import { LinkIcon, PaperAirplaneIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';
type IconMapKeys = 'Top Links' | 'Top Referrers' | 'Top Countries';

// 2. Definir o tipo do mapa de ícones de forma explícita
const iconMap: Record<IconMapKeys, FunctionalComponent<HTMLAttributes & VNodeProps>> = {
    'Top Links': LinkIcon,
    'Top Referrers': PaperAirplaneIcon,
    'Top Countries': GlobeAltIcon
};

// 3. Usar o tipo `IconMapKeys` para a prop `title`
defineProps<{
    title: IconMapKeys; // Agora o TypeScript sabe que 'title' só pode ser uma dessas três strings
    items?: { label: string; value: number }[];
    iconColor: string;
}>();
</script>