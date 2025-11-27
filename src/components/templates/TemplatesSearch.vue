<!-- src/components/templates/TemplatesSearch.vue -->
<template>
  <div class="mb-8 flex flex-col md:flex-row items-center gap-4">
    <!-- Barra de Pesquisa -->
    <div class="relative group flex-grow w-full md:w-auto">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-slate-500" />
      </div>
      <input :value="search" @input="$emit('update:search', ($event.target as HTMLInputElement).value)" type="search"
        placeholder="Explore community-created templates"
        class="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50" />
    </div>

    <!-- Dropdown de Ordenação -->
    <div class="relative">
      <select :value="sortBy" @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value as SortType)"
        class="appearance-none w-full md:w-48 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50">
        <option value="popular">Trending</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <ChevronDownIcon class="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>

    <!-- Botão de Filtro por Criador (simples) -->
    <div class="relative group">
      <input :value="creator" @input="$emit('update:creator', ($event.target as HTMLInputElement).value)" type="search"
        placeholder="Search by creator"
        class="w-full md:w-48 bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
      <UserIcon class="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, ChevronDownIcon, UserIcon } from '@heroicons/vue/24/solid'

type SortType = 'popular' | 'newest' | 'oldest';

defineProps<{
  search: string,
  sortBy: SortType,
  creator: string
}>()

defineEmits<{
  'update:search': [value: string],
  'update:sortBy': [value: SortType],
  'update:creator': [value: string]
}>()
</script>