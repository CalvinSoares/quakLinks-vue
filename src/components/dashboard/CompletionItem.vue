<template>
  <component :is="componentType" :to="to" @click="handleClick" :class="[
    'group flex items-center p-3 transition-all duration-300 rounded-xl border',
    completed
      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-300 cursor-default'
      : 'bg-slate-800/50 hover:bg-slate-800 hover:border-purple-500/50 border-slate-700 text-slate-300 cursor-pointer hover:scale-[1.02]'
  ]">
    <!-- Check Icon -->
    <div :class="[
      'w-5 h-5 rounded-full flex items-center justify-center mr-3 shrink-0 border-2 transition-all duration-300',
      completed
        ? 'bg-green-400 border-green-300'
        : 'border-slate-500 group-hover:border-purple-400'
    ]">
      <CheckIcon v-if="completed" class="w-3.5 h-3.5 text-slate-900" />
    </div>

    <!-- Label -->
    <span class="text-sm font-medium flex-grow">{{ label }}</span>

    <!-- Arrow Icon -->
    <ChevronRightIcon v-if="!completed"
      class="w-4 h-4 ml-auto text-slate-500 group-hover:text-purple-400 transition-colors" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  label: string;
  completed: boolean;
  to?: string;
  action?: () => void;
}>();

const componentType = computed(() => props.to ? RouterLink : 'button');

function handleClick() {
  if (props.completed) return;
  if (props.action) {
    props.action();
  }
}
</script>
