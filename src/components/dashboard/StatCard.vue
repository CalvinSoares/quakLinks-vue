<template>
  <div
    class="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-start justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-xl">
    <div :class="[
      'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br',
      gradientClass
    ]"></div>

    <div class="relative z-10">
      <p class="text-sm font-medium text-slate-400 mb-1">{{ title }}</p>
      <p class="text-2xl font-bold text-white truncate">{{ value }}</p>
    </div>

    <div :class="[
      'relative z-10 p-2.5 rounded-xl transition-all duration-300 bg-gradient-to-br opacity-20 group-hover:opacity-30',
      gradientClass
    ]">
      <component :is="icon" class="w-6 h-6 text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon: object;
  gradientClass: string;
}>();
</script>