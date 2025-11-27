<template>
  <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
    <p v-if="description" class="mt-1 text-sm text-slate-400">{{ description }}</p>
    <div class="mt-6 space-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>