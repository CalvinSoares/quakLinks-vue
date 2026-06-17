<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="ui-modal-shell">
        <div class="ui-modal-backdrop" @click="onClose"></div>
        <div class="ui-modal-panel max-h-[90vh] max-w-md" @click.stop>
          <div class="ui-modal-header">
            <div class="ui-modal-title-wrap">
              <div class="ui-modal-accent">
                <span class="h-2.5 w-2.5 rounded-full bg-current"></span>
              </div>
              <h2 class="ui-modal-title">{{ title }}</h2>
            </div>
            <button @click="onClose" type="button" class="ui-modal-close" :aria-label="closeLabel">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-10rem)]">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="ui-modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
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

const closeLabel = 'Fechar modal';
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
