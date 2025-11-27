<!-- src/components/Modal.vue (Exemplo de como deveria ser) -->
<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="onClose">
        <div class="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
          <!-- Cabeçalho -->
          <div class="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
            <button @click="onClose" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <!-- Conteúdo (Slot) -->
          <div>
            <slot></slot>
          </div>

          <!-- Rodapé (Slot Opcional) -->
          <div v-if="$slots.footer" class="p-4 border-t border-slate-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true // Esta linha é a causa do erro de TypeScript
  },
  title: {
    type: String,
    default: 'Modal'
  }
});

const emit = defineEmits(['close']);

const onClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>