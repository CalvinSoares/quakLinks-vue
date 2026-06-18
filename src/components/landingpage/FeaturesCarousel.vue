<template>
    <section id="features" class="py-16 bg-[#0a0a0a] overflow-hidden border-y border-white/5">


        <!-- Container do Carrossel Infinito -->
        <div class="relative flex">

            <div class="flex gap-6 animate-marquee whitespace-nowrap">
                <div v-for="(feature, idx) in [...features, ...features]" :key="idx"
                    class="flex-shrink-0 w-[280px] group relative p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                            <component :is="feature.icon" :size="24" class="text-amber-400" />
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                {{ feature.title }}
                            </h4>
                            <p class="text-xs text-slate-500 mt-1 whitespace-normal line-clamp-2">
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gradientes laterais para suavizar a entrada/saída -->
            <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
            <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    features: {
        type: Array,
        default: () => [],
    },
    sectionCopy: {
        type: Object,
        default: () => ({
            titleStart: 'Recursos',
            titleHighlight: '',
            description: '',
        }),
    },
})
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-marquee {
    display: flex;
    width: max-content;
    animation: marquee 30s linear infinite;
}

/* Pausa o carrossel quando o usuário passa o mouse para facilitar a leitura */
.animate-marquee:hover {
    animation-play-state: paused;
}
</style>
