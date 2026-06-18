<template>
    <section id="pricing" class="relative overflow-hidden py-20 px-4 bg-[#0a0a0a] border-y border-white/5">
        <!-- Background Decorativo -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full">
            </div>
        </div>

        <div class="container mx-auto max-w-5xl relative z-10">
            <!-- Header -->
            <div v-observe class="scroll-fade text-center mb-16">

                <h3 class="text-4xl md:text-6xl font-black mb-4 text-white">
                    Escolha seu <span class="text-amber-400">Poder</span>
                </h3>
                <p class="text-slate-400 text-base max-w-lg mx-auto">
                    {{ copy.pricing.description }}
                </p>
            </div>

            <!-- Grid de Planos com Animações Laterais -->
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto perspective-2000">

                <!-- CARD FREE (Vem da Esquerda) -->
                <article v-observe
                    class="arrival-left group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/40 p-8 flex flex-col transition-all duration-500 hover:border-amber-500/20">
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-8">
                            <div
                                class="p-3 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 group-hover:text-amber-400 transition-colors">
                                <Sparkles :size="24" />
                            </div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-widest text-slate-600">Essencial</span>
                        </div>

                        <h4 class="text-2xl font-black text-white mb-2">{{ pricingCards[0].name }}</h4>
                        <div class="flex items-baseline gap-1 mb-6">
                            <span class="text-5xl font-black text-white tracking-tighter">{{ pricingCards[0].price
                                }}</span>
                            <span class="text-slate-500 text-sm italic">{{ pricingCards[0].priceSuffix }}</span>
                        </div>
                    </div>

                    <ul class="relative z-10 space-y-4 mb-10 py-6 border-t border-white/5">
                        <li v-for="feat in pricingCards[0].features" :key="feat"
                            class="flex items-start gap-3 text-sm text-slate-400">
                            <div class="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500/40"></div>
                            {{ feat }}
                        </li>
                    </ul>

                    <a :href="pricingCards[0].href"
                        class="relative z-10 mt-auto w-full py-4 rounded-2xl border border-white/10 text-white font-bold text-center hover:bg-white/5 transition-all">
                        {{ pricingCards[0].cta }}
                    </a>
                </article>

                <!-- CARD PREMIUM (Vem da Direita + Highlight) -->
                <article v-observe
                    class="arrival-right group relative overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-slate-900/50 p-8 flex flex-col transition-all duration-500 shadow-[0_20px_80px_-20px_rgba(251,191,36,0.15)]">
                    <!-- Efeito de Brilho Interno Amarelo -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[50px] -mr-16 -mt-16"></div>

                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-8">
                            <div
                                class="p-3 rounded-2xl bg-amber-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                <Crown :size="24" />
                            </div>
                            <span
                                class="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-black uppercase text-amber-400">
                                {{ copy.pricing.recommended }}
                            </span>
                        </div>

                        <h4 class="text-2xl font-black text-white mb-2">{{ pricingCards[1].name }}</h4>
                        <div class="flex items-baseline gap-2 mb-6">
                            <span class="text-5xl font-black text-amber-400 tracking-tighter">{{ pricingCards[1].price
                                }}</span>
                            <span class="text-slate-400 text-sm font-medium">{{ pricingCards[1].priceSuffix }}</span>
                        </div>
                    </div>

                    <ul class="relative z-10 space-y-4 mb-10 py-6 border-t border-amber-400/10">
                        <li v-for="feat in pricingCards[1].features" :key="feat"
                            class="flex items-start gap-3 text-sm text-slate-200">
                            <Check :size="18" class="text-amber-400 shrink-0" />
                            <span class="font-medium">{{ feat }}</span>
                        </li>
                    </ul>

                    <a :href="pricingCards[1].href"
                        class="relative z-10 mt-auto w-full py-4 rounded-2xl bg-amber-400 text-slate-900 font-black text-center hover:bg-amber-300 hover:scale-[1.02] shadow-xl transition-all">
                        {{ pricingCards[1].cta }}
                    </a>
                </article>

            </div>
        </div>
    </section>
</template>

<script setup>
import { Crown, Sparkles, Check, ArrowRight } from 'lucide-vue-next';

defineProps({
    copy: Object,
    pricingCards: Array
});

// Diretiva de observação para disparar a classe 'is-visible'
const vObserve = {
    mounted: (el) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible')
                    observer.unobserve(el)
                }
            })
        }, { threshold: 0.2 })
        observer.observe(el)
    }
};
</script>

<style scoped>
.perspective-2000 {
    perspective: 2000px;
}

/* Base das animações */
.scroll-fade,
.arrival-left,
.arrival-right {
    opacity: 0;
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Animação Header */
.scroll-fade.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* CHEGADA DA ESQUERDA (Free) */
.arrival-left {
    transform: translateX(-100px) rotateY(15deg);
}

.arrival-left.is-visible {
    opacity: 1;
    transform: translateX(0) rotateY(0);
}

/* CHEGADA DA DIREITA (Premium) */
.arrival-right {
    transform: translateX(100px) rotateY(-15deg);
}

.arrival-right.is-visible {
    opacity: 1;
    transform: translateX(0) rotateY(0);
}

/* Efeito de hover 3D sutil */
article {
    will-change: transform, opacity;
}

article:hover {
    transform: translateY(-8px) scale(1.01) !important;
}
</style>