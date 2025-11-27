<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max ">
      <template v-for="(template, index) in templates" :key="template.id">
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 "
          :style="{ animationDelay: `${index * 50}ms` }">
          <TemplateCard :template="template" :variant="variant" @view="$emit('view', $event)"
            @apply="$emit('apply', $event)" @favorite="$emit('favorite', $event)" @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)" />
        </div>
      </template>
    </div>

    <div v-if="hasMore && !isLoading" class="mt-12 text-center pb-8">
      <button @click="$emit('load-more')"
        class="px-8 py-3.5 font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl hover:from-slate-600 hover:to-slate-700 border border-slate-600/50 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl">
        Carregar Mais Templates
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TemplateCard from './TemplateCard.vue'
import type { Template } from '@/store/templates'

export type TemplateCardVariant = 'explore' | 'favorites' | 'recent' | 'mine';


defineProps<{
  templates: Template[]
  variant: TemplateCardVariant
  hasMore: boolean
  isLoading: boolean
}>()

defineEmits<{
  view: [id: string]
  apply: [id: string]
  favorite: [template: Template]
  edit: [template: Template]
  delete: [id: string]
  'load-more': []
}>()
</script>
