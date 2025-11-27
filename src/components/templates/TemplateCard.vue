<!-- src/components/templates/TemplateCard.vue -->
<template>
  <div
    class="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl cursor-pointer border-2 border-slate-700/50 hover:border-amber-400/80 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/20">
    <!-- Image container with enhanced zoom effect -->
    <img :src="template.previewImageUrl" :alt="template.name"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />

    <!-- Enhanced gradient overlay with dynamic opacity -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
    </div>


    <div v-if="template.isNew"
      class="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-green-400 to-cyan-400 text-slate-900 px-3 py-1.5 rounded-full shadow-lg">
      New
    </div>


    <!-- Info Section -->
    <div
      class="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-all duration-300 group-hover:translate-y-0">
      <h3 class="font-bold text-lg truncate group-hover:text-amber-300 transition-colors">{{ template.name }}</h3>
      <p class="text-sm text-slate-300 truncate">por {{ template.creator.name }}</p>
    </div>

    <!-- Badge with animated background -->
    <div v-if="variant === 'explore'"
      class="absolute top-4 right-4 flex items-center gap-2 text-xs bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-slate-700/50 hover:border-red-400/50 transition-all">
      <HeartIcon class="w-4 h-4 text-red-400 animate-pulse" />
      <span class="font-semibold">{{ template._count.favoritedBy }}</span>
    </div>
    <div v-else
      class="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-amber-300 border border-amber-400/30">
      {{ template.visibility }}
    </div>

    <!-- Enhanced action buttons with better positioning and animations -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent/0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-3 p-5">
      <!-- Ações para a Tab "Explore" -->
      <div v-if="variant === 'explore'" class="flex flex-col gap-3 w-full transform transition-all duration-300">
        <button @click.stop="$emit('apply', template.id)"
          class="action-button bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 hover:scale-105">
          Aplicar Agora
        </button>
        <button @click.stop="$emit('favorite', template)"
          class="action-button bg-slate-700/90 hover:bg-slate-600 border border-slate-600 hover:border-red-400 hover:text-red-300">
          Favoritar
        </button>
        <button @click.stop="$emit('view', template.id)"
          class="action-button bg-sky-500/20 border-2 border-sky-400/50 text-sky-300 hover:bg-sky-500/40 hover:border-sky-400">Ver
          Detalhes</button>
      </div>
      <!-- Ações para a Tab "My Templates" -->
      <div v-else class="flex flex-col gap-3 w-full transform transition-all duration-300">
        <button @click.stop="$emit('apply', template.id)"
          class="action-button bg-amber-400 text-slate-900  hover:bg-amber-300 shadow-lg shadow-amber-400/30">
          Usar Template
        </button>
        <button @click.stop="$emit('edit', template)"
          class="action-button bg-sky-500/80 hover:bg-sky-500 border border-sky-600 hover:shadow-lg hover:shadow-sky-500/30">Editar</button>
        <button @click.stop="$emit('delete', template.id)"
          class="action-button bg-red-600/80 hover:bg-red-600 border border-red-700 hover:shadow-lg hover:shadow-red-600/30">Excluir</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon } from '@heroicons/vue/24/solid';
import type { Template } from '@/store/templates';
import type { TemplateCardVariant } from './TemplatesGrid.vue';

defineProps<{
  template: Template,
  variant: TemplateCardVariant
}>();

defineEmits(['view', 'apply', 'favorite', 'edit', 'delete']);
</script>

<style scoped>
.action-button {
  @apply w-full py-3 px-3 text-center font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform;
}
</style>
