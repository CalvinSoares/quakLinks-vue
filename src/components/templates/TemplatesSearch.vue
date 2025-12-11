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
    <Menu as="div" class="relative inline-block text-left w-full md:w-48">
      <div>
        <MenuButton
          class="inline-flex justify-between w-full rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50">
          <span>{{ selectedTags.length > 0 ? `${selectedTags.length} tags selecionadas` : 'Filtrar por Tags' }}</span>
          <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5 text-slate-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems
          class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-700 rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div class="px-1 py-1">
            <MenuItem v-for="tag in tags" :key="tag.name" v-slot="{ active }">
            <button @click="$emit('toggleTag', tag.name)" :class="[
              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              active ? 'bg-amber-500 text-white' : 'text-slate-300',
            ]">
              <div class="w-5 h-5 mr-2 flex items-center justify-center">
                <CheckIcon v-if="isActive(tag.name)" class="h-4 w-4" />
              </div>
              {{ tag.name }}
            </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
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
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import { MagnifyingGlassIcon, ChevronDownIcon, UserIcon } from '@heroicons/vue/24/solid'
import { CheckIcon } from 'vue-tabler-icons';

type SortType = 'popular' | 'newest' | 'oldest';

const props = defineProps<{
  search: string,
  sortBy: SortType,
  creator: string,
  tags: { name: string }[],
  selectedTags: string[]
}>()

defineEmits<{
  'update:search': [value: string],
  'update:sortBy': [value: SortType],
  'update:creator': [value: string],
  'toggleTag': [tagName: string]
}>()

const isActive = (tagName: string) => {
  return props.selectedTags.includes(tagName);
}
</script>