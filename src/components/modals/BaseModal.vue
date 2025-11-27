<!-- src/components/BaseModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Painel do Modal -->
        <div
          class="relative w-full transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-left align-middle shadow-xl transition-all"
          :class="maxWidthClass"
          @click.stop
        >
          <!-- Título (via slot) -->
          <div v-if="$slots.title" class="px-6 pt-6 pb-4 border-b border-slate-800">
            <h3 class="text-xl font-bold leading-6 text-white">
              <slot name="title" />
            </h3>
          </div>

          <!-- Conteúdo Principal (via slot) -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Rodapé com Botões (via slot) -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  maxWidth: {
    type: String,
    default: 'lg', // 'sm', 'md', 'lg', 'xl', etc.
  }
});

const emit = defineEmits(['close']);

const maxWidthClasses: Record<string, string> = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
};
const maxWidthClass = maxWidthClasses[props.maxWidth] || 'max-w-lg';


// Lógica para fechar com a tecla Escape
const handleKeydown = (e: KeyboardEvent) => {
  if (props.isOpen && e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Animação separada para o overlay para evitar "piscada" */
.modal-fade-enter-active .absolute,
.modal-fade-leave-active .absolute {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from .absolute,
.modal-fade-leave-to .absolute {
  opacity: 0;
}
</style>