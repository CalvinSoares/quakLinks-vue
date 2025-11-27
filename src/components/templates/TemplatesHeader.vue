<!-- src/components/templates/TemplatesHeader.vue -->
<template>
  <header class="mb-8 flex-shrink-0">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-br from-amber-400/20 to-amber-400/5 rounded-xl border border-amber-400/30">
            <RectangleStackIcon class="w-6 h-6 text-amber-400" />
          </div>
          <h1 class="text-4xl font-bold text-white tracking-tight">Templates</h1>
        </div>
        <p class="text-slate-400 text-lg">Encontre um visual incrível ou gerencie suas criações.</p>
      </div>
      <button @click="$emit('create')"
        class="flex-shrink-0 px-6 py-3 font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 hover:scale-105 transform active:scale-95">
        + Criar Novo Template
      </button>
    </div>
    <div class="mt-8">
      <!-- Container das abas -->
      <div class="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 w-fit">
        <button v-for="tab in tabs" :key="tab.id" @click="$emit('tab-change', tab.id)" :class="[
          'px-4 py-2.5 font-semibold text-sm transition-all duration-300 rounded-lg flex items-center gap-2',
          activeTab === tab.id
            ? 'text-slate-900 bg-white shadow-lg'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        ]">
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, RectangleStackIcon, HeartIcon, ClockIcon } from '@heroicons/vue/24/solid'

type TabId = 'explore' | 'favorites' | 'recent' | 'mine';

defineProps<{ activeTab: TabId }>()
defineEmits<{ 'tab-change': [tab: TabId], create: [] }>()

const tabs = [
  { id: 'explore', label: 'Template Library', icon: MagnifyingGlassIcon },
  { id: 'favorites', label: 'Favorite Templates', icon: HeartIcon },
  { id: 'recent', label: 'Last Used', icon: ClockIcon },
  { id: 'mine', label: 'My Uploads', icon: RectangleStackIcon },
] as const;

</script>