<!-- src/components/templates/TemplateDetailModal.vue -->
<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #title>
      {{ store.selectedTemplate?.name }}
    </template>

    <div class="mt-4">
      <div class="aspect-[4/3] rounded-lg overflow-hidden bg-slate-800">
        <img v-if="store.selectedTemplate" :src="store.selectedTemplate.previewImageUrl" class="w-full h-full object-cover" />
      </div>
      <div class="mt-4 space-y-2 text-sm text-slate-300">
        <p>Criado por: <span class="font-semibold text-amber-400">{{ store.selectedTemplate?.creator.name }}</span></p>
        <div class="flex items-center gap-2">
          <p>Tags:</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in store.selectedTemplate?.tags" :key="tag.name" class="px-2 py-1 bg-slate-700 rounded-md text-xs">{{ tag.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <button @click="$emit('close')" type="button" class="btn-secondary">Fechar</button>
      <button @click="handleApply" type="button" class="btn-primary">Aplicar</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useTemplatesStore } from '@/store/templates';
import BaseModal from '../modals/BaseModal.vue';

const props = defineProps<{ isOpen: boolean, templateId: string }>();
const emit = defineEmits(['close']);
const store = useTemplatesStore();

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.templateId) {
    store.fetchTemplateById(props.templateId);
  }
});

async function handleApply() {
  if (store.selectedTemplate) {
    await store.applyTemplate(store.selectedTemplate.id);
    alert('Template aplicado!');
    emit('close');
  }
}
</script>

<style scoped>
/* Criando estilos de botão reutilizáveis para os modais */
.btn-primary {
  @apply px-6 py-2 text-sm font-medium text-slate-900 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors;
}
.btn-secondary {
  @apply px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors;
}
</style>