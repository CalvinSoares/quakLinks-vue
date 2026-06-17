<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="ui-modal-shell">
        <div class="ui-modal-backdrop" @click="$emit('close')"></div>

        <div
          class="ui-modal-panel max-h-[90vh] transform transition-all"
          :class="maxWidthClass" @click.stop>
          <div v-if="$slots.title" class="ui-modal-header">
            <div class="ui-modal-title-wrap">
              <div class="ui-modal-accent">
                <span class="h-2.5 w-2.5 rounded-full bg-current"></span>
              </div>
              <div class="min-w-0 flex-1 text-white">
                <slot name="title" />
              </div>
            </div>
            <button type="button" class="ui-modal-close" @click="$emit('close')" aria-label="Fechar modal">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="ui-modal-body overflow-y-auto max-h-[calc(90vh-10rem)]">
            <slot />
          </div>

          <div v-if="$slots.footer" class="ui-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  maxWidth: {
    type: String,
    default: 'lg',
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

.modal-fade-enter-active .absolute,
.modal-fade-leave-active .absolute {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from .absolute,
.modal-fade-leave-to .absolute {
  opacity: 0;
}
</style>
