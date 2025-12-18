<template>
    <div
        class="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600 transition">
        <img :src="audio.coverUrl || '/default-cover.png'" class="w-12 h-12 rounded-md object-cover">
        <div class="flex-1">
            <p class="font-semibold text-white">{{ audio.title }}</p>
            <p class="text-xs text-slate-400">0:20</p>
        </div>
        <div v-if="audio.isActive" class="px-2 py-0.5 text-xs font-bold text-green-300 bg-green-500/20 rounded-full">
            ATIVO</div>
        <button @click="$emit('edit', audio)" class="p-1 text-slate-400 hover:text-white">
            <IconPencil class="w-4 h-4" />
        </button>
        <button @click="$emit('delete', audio.id)" class="p-1 text-red-500 hover:text-red-400">
            <IconTrash class="w-4 h-4" />
        </button>
    </div>
</template>

<script setup lang="ts">
import type { Audio } from '@/store/page';

defineProps<{ audio: Audio }>();
defineEmits(['edit', 'delete', 'set-active']);
</script>