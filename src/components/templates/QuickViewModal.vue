<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <!-- ✅ FIXED: Pass the #title slot unconditionally -->
    <template #title>
      <!-- Move the v-if/v-else logic INSIDE the slot -->
      <div v-if="template" class="flex flex-col">
        <h2 class="text-2xl font-bold text-white">{{ template.name }}</h2>
        <p class="text-sm text-slate-400">
          Criado por <span class="font-semibold text-amber-400">{{ template.creator.name }}</span>
        </p>
      </div>
      <!-- Loading state for the title -->
      <div v-else class="animate-pulse">
        <div class="h-8 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    </template>

    <!-- ✅ FIXED: The main/default slot content -->
    <div v-if="template" class="mt-4">
      <!-- Imagem de Preview -->
      <div class="aspect-video rounded-lg overflow-hidden bg-slate-800 shadow-lg">
        <img :src="template.previewImageUrl" :alt="`Preview of ${template.name}`" class="w-full h-full object-cover" />
      </div>

      <!-- Tags -->
      <div class="mt-4 flex items-center gap-2">
        <TagIcon class="w-5 h-5 text-slate-400" />
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in template.tags" :key="tag.name"
            class="px-3 py-1 bg-slate-700/80 rounded-full text-xs font-medium text-slate-300">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
    <!-- Loading state for the main content -->
    <div v-else class="mt-4 animate-pulse">
      <div class="aspect-video bg-slate-700 rounded-lg"></div>
    </div>

    <!-- ✅ FIXED: Pass the #footer slot unconditionally -->
    <template #footer>
      <!-- Move the v-if logic INSIDE the slot -->
      <template v-if="template">
        <button @click.stop="$emit('favorite', template)" type="button" class="btn-icon">
          <HeartIcon
            :class="['w-5 h-5 transition-colors', template.isFavorited ? 'text-red-500' : 'text-slate-400 hover:text-white']" />
        </button>
        <div class="flex-grow"></div>
        <button @click="$emit('close')" type="button" class="btn-secondary">Cancelar</button>
        <button @click="handleApply" type="button" class="btn-primary flex items-center gap-2">
          <BoltIcon class="w-5 h-5" />
          Aplicar Template
        </button>
      </template>
    </template>

  </BaseModal>
</template>


<script setup lang="ts">
import { BoltIcon, HeartIcon, TagIcon } from '@heroicons/vue/24/solid';
import type { TemplateListItem } from '@/store/templates';
import BaseModal from '../modals/BaseModal.vue'; // Verifique o caminho para o seu BaseModal

const props = defineProps<{
  isOpen: boolean,
  template: TemplateListItem | null // Recebe o objeto completo, pode ser nulo ao fechar
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'apply', templateId: string): void,
  (e: 'favorite', template: TemplateListItem): void
}>();

function handleApply() {
  if (props.template) {
    emit('apply', props.template.id);
    emit('close'); // Fecha o modal após a ação ser disparada
  }
}
</script>

<style scoped>
/* Estilos dos botões, adaptados do seu DetailModal */
.btn-primary {
  @apply px-5 py-2.5 text-sm font-semibold text-slate-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-all duration-200 transform active:scale-95 shadow-lg shadow-amber-500/20;
}

.btn-secondary {
  @apply px-5 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors;
}

.btn-icon {
  @apply p-2.5 rounded-full hover:bg-slate-700/50 transition-colors;
}
</style>