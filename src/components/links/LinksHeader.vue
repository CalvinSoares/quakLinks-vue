<!-- src/components/links/LinksHeader.vue -->
<template>
  <div class="relative overflow-hidden">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-sky-500/5 to-slate-700/5 rounded-2xl blur-3xl"></div>

    <div class="relative p-8 border border-gradient-to-r border-slate-700/30 rounded-2xl bg-slate-900/50 backdrop-blur-sm">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <component :is="LinkIcon" class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-amber-100 to-sky-200 bg-clip-text text-transparent">
              Gerenciador de Links
            </h1>
          </div>
          <p class="text-slate-400 mt-2 max-w-2xl">
            Personalize sua página com links para seus perfis sociais, sites e conteúdos favoritos.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        <div class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p class="text-xs text-slate-400 mb-1">Status</p>
          <p class="text-lg font-semibold text-amber-400">Ativo</p>
        </div>
        <div class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p class="text-xs text-slate-400 mb-1">Atualizações</p>
          <p class="text-lg font-semibold text-sky-400">Em Tempo Real</p>
        </div>
        <div class="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p class="text-xs text-slate-400 mb-1">Limite</p>
          <p class="text-lg font-semibold text-slate-300">Ilimitado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LinkIcon } from 'vue-tabler-icons';
</script>
