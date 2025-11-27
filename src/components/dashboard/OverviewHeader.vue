<template>
    <header class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
            <div
                class="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-xl border border-yellow-400/30 flex-shrink-0">
                <component :is="icon" class="w-7 h-7 text-yellow-400" />
            </div>
            <div>
                <h1 class="text-4xl font-bold text-white bg-clip-text text-transparent">
                    {{ title }}
                </h1>
                <p class="mt-1 text-slate-400">{{ subtitle }}</p>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    subtitle: string;
    icon: object;
}>();
</script>