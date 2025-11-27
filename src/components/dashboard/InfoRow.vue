<template>
  <div>
    <label class="text-sm font-medium text-slate-400">{{ label }}</label>
    <component 
      :is="isEditable ? 'button' : 'div'"
      @click="isEditable ? $emit('click') : null"
      class="flex items-center justify-between w-full p-3 mt-1 text-left bg-slate-800/50 border border-slate-700 rounded-lg transition-colors"
      :class="{ 'hover:bg-slate-800 cursor-pointer': isEditable }"
    >
      <span class="text-white truncate">{{ value }}</span>
      <PencilIcon v-if="isEditable" class="w-4 h-4 text-slate-500 shrink-0" />
    </component>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid';

defineProps<{
  label: string;
  value: string;
  isEditable?: boolean;
}>();

defineEmits(['click']);
</script>