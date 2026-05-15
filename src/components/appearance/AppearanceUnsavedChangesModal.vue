<template>
  <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl animate-fade-in-up">
      <div class="flex flex-col items-center text-center gap-3">
        <div class="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <ExclamationTriangleIcon class="w-7 h-7" />
        </div>
        <h3 class="text-lg font-bold text-white">Alterações não salvas</h3>
        <p class="text-sm text-slate-400">Você tem alterações pendentes. Deseja sair sem salvar?</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button
          @click="$emit('discard')"
          class="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-all"
        >
          Sair
        </button>
        <button
          @click="$emit('save-and-exit')"
          class="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all"
        >
          Salvar e Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid";

defineProps<{
  open: boolean;
}>();

defineEmits(["discard", "save-and-exit"]);
</script>
