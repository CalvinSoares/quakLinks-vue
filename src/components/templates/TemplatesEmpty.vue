<template>
  <div class="text-center py-16">
    <div class="inline-flex flex-col items-center gap-3">
      <div class="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <RectangleStackIcon class="w-8 h-8 text-slate-500" />
      </div>
      <p class="text-slate-400 font-medium">{{ message }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { RectangleStackIcon } from '@heroicons/vue/24/solid'

defineProps<{
  message: string
}>()
</script>
