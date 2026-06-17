<template>
  <BaseModal :is-open="isOpen" :max-width="maxWidth" @close="$emit('close')">
    <template #title>
      <div class="space-y-1">
        <h2 class="text-lg font-bold text-white">{{ title }}</h2>
        <p v-if="description" class="text-sm text-slate-400">{{ description }}</p>
      </div>
    </template>

    <div v-if="$slots.default" class="text-sm text-slate-300">
      <slot />
    </div>

    <template #footer>
      <div class="flex w-full gap-3">
        <button
          type="button"
          class="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoading"
          @click="$emit('close')"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          :class="confirmButtonClass"
          :disabled="isLoading"
          @click="$emit('confirm')"
        >
          {{ isLoading ? loadingLabel : confirmLabel }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}>(), {
  description: '',
  cancelLabel: 'Cancelar',
  confirmLabel: 'Confirmar',
  loadingLabel: 'Confirmando...',
  maxWidth: 'md',
  isLoading: false,
  variant: 'danger',
});

defineEmits(['close', 'confirm']);

const confirmButtonClass = computed(() =>
  props.variant === 'primary'
    ? 'bg-indigo-600 hover:bg-indigo-500'
    : 'bg-red-600 hover:bg-red-500'
);
</script>
