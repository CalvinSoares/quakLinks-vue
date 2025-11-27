<!-- src/components/dashboard/Header.vue -->
<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b-2 dark:border-gray-700">
    <div class="flex items-center">
      <!-- Botão Hamburger para Mobile -->
      <button @click="$emit('toggleSidebar')" class="text-gray-500 focus:outline-none lg:hidden">
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline';
defineEmits(['toggleSidebar']);
</script>