<template>
    <!-- Header fixo para mobile e tablet, escondido em telas grandes -->
    <header
        class="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 lg:hidden">
        <!-- Botão de Menu Hambúrguer Animado -->
        <button @click="$emit('toggleSidebar')" class="relative w-8 h-8 flex items-center justify-center">
            <span class="sr-only">Abrir menu</span>
            <div class="space-y-1.5">
                <span class="block w-6 h-0.5 bg-slate-300 transition-transform duration-300 ease-in-out"
                    :class="{ 'rotate-45 translate-y-2': isSidebarOpen }"></span>
                <span class="block w-6 h-0.5 bg-slate-300 transition-opacity duration-300"
                    :class="{ 'opacity-0': isSidebarOpen }"></span>
                <span class="block w-6 h-0.5 bg-slate-300 transition-transform duration-300 ease-in-out"
                    :class="{ '-rotate-45 -translate-y-2': isSidebarOpen }"></span>
            </div>
        </button>

        <!-- Logo (opcional, para reforçar a marca no mobile) -->
        <div class="flex items-center gap-2">
            <img src="/duckbio.png" alt="QuackLinks Logo" class="w-7 h-5" />
            <h1 class="text-xl font-bold tracking-wider text-white">Quack<span class="text-amber-400">Links</span></h1>
        </div>


    </header>
</template>

<script setup lang="ts">
defineProps<{
    isSidebarOpen: boolean;
}>();

defineEmits(['toggleSidebar']);
</script>