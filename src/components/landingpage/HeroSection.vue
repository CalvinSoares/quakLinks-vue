<template>
    <section v-if="copy" id="hero" @mousemove="handleGlobalParallax"
        class="relative min-h-screen flex items-center pt-32 pb-20 px-4 overflow-hidden">
        <div class="absolute inset-0 pointer-events-none z-0 opacity-70">
            <GridScan :sensitivity="0.55" :line-thickness="1" lines-color="#2F293A" :grid-scale="0.1"
                scan-color="#FBBF24" :scan-opacity="0.4" enable-post :bloom-intensity="0.6"
                :chromatic-aberration="0.002" :noise-intensity="0.01" class-name="pointer-events-none" />
            <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
        </div>
        <!-- 1. BACKGROUND PARALLAX BLOBS -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] transition-transform duration-300 ease-out"
                :style="{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] transition-transform duration-300 ease-out"
                :style="{ transform: `translate(${-parallax.x}px, ${-parallax.y}px)` }"></div>
        </div>

        <div class="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <!-- LADO ESQUERDO: TEXTO -->
            <div class="text-left order-2 lg:order-1">
                <!-- Badge com Glitch Suave -->
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-fade-in-up">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span class="text-xs font-semibold text-slate-300 tracking-wide uppercase">{{ copy.hero.badge
                    }}</span>
                </div>

                <!-- Headline com Troca de Palavras (ou Gradiente Animado) -->
                <h1
                    class="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
                    {{ copy.hero.titleStart }} <br />
                    <span
                        class="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 bg-[length:200%_auto] animate-gradient-shift">
                        {{ copy.hero.titleHighlight }}
                    </span>
                </h1>

                <p class="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed animate-fade-in-up"
                    style="animation-delay: 200ms">
                    {{ copy.hero.description }}
                </p>

                <!-- CTAs com Hover Magnético (Efeito de Escala) -->
                <div class="flex flex-wrap items-center gap-4 animate-fade-in-up" style="animation-delay: 300ms">
                    <a href="/register"
                        class="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-amber-400 hover:text-slate-900 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        {{ copy.hero.primaryCta }}
                        <ArrowRight :size="18" />
                    </a>
                    <a href="#explore"
                        class="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2">
                        <Play :size="18" />
                        {{ copy.hero.secondaryCta }}
                    </a>
                </div>

                <!-- Social Proof -->
                <div class="mt-12 flex items-center gap-6 text-sm text-slate-500 animate-fade-in-up"
                    style="animation-delay: 400ms">
                    <div class="flex -space-x-3">
                        <img v-for="i in 3" :key="i"
                            class="w-10 h-10 rounded-full border-2 border-[#0a0a0a] hover:z-10 transition-transform hover:scale-110"
                            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`" />
                    </div>
                    <p>{{ copy.hero.joinPrefix }} <span class="text-white font-bold">50k+</span> {{
                        copy.hero.joinSuffix }}</p>
                </div>
            </div>

            <!-- LADO DIREITO: MOCKUP INTERATIVO -->
            <div class="relative flex justify-center lg:justify-end order-1 lg:order-2 [perspective:2000px] group/card">

                <!-- ÍCONES FLUTUANTES AO REDOR -->
                <div class="absolute top-10 left-0 animate-float pointer-events-none" style="animation-delay: 0s">
                    <div class="p-3 bg-slate-900/80 border border-white/10 rounded-2xl backdrop-blur-md">
                        <Instagram class="text-pink-500" :size="24" />
                    </div>
                </div>
                <div class="absolute bottom-20 right-0 animate-float pointer-events-none" style="animation-delay: 1.5s">
                    <div class="p-3 bg-slate-900/80 border border-white/10 rounded-2xl backdrop-blur-md">
                        <Youtube class="text-red-500" :size="24" />
                    </div>
                </div>

                <!-- MOCKUP COM TILT 3D -->
                <div class="relative w-[280px] sm:w-[340px] aspect-[9/19] transition-all duration-200 ease-out transform-3d"
                    :style="mockupStyle" @mousemove="handleMockupTilt" @mouseleave="resetMockupTilt">
                    <div
                        class="absolute -inset-[2px] bg-gradient-to-tr from-amber-500 via-purple-500 to-sky-500 rounded-[2.5rem] blur-sm opacity-70 group-hover/card:opacity-100 transition-opacity">
                    </div>

                    <div
                        class="relative w-full h-full bg-[#0f0f0f] rounded-[2.4rem] overflow-hidden border border-white/10 shadow-2xl">
                        <!-- Conteúdo Interno do Mockup (Mantido do seu original) -->
                        <div
                            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40">
                        </div>
                        <div class="relative z-10 flex flex-col items-center pt-16 px-6 h-full">
                            <!-- Avatar -->
                            <div
                                class="w-24 h-24 rounded-full border-2 border-amber-400 p-1 shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-4">
                                <img src="/duckbio.png" class="w-full h-full rounded-full bg-slate-800 object-cover" />
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-1">QuackUser</h3>
                            <!-- Restante dos links... -->
                            <div class="w-full space-y-3 mt-4">
                                <div v-for="i in 3" :key="i"
                                    class="w-full h-12 bg-white/5 border border-white/10 rounded-xl animate-pulse">
                                </div>
                            </div>
                        </div>

                        <!-- REFLEXO DINÂMICO (GLARE) -->
                        <div class="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover/card:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent"
                            :style="glareStyle"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, Play, Instagram, Youtube } from 'lucide-vue-next'
import GridScan from './GridScan.vue'

// LÓGICA DE PARALLAX DO FUNDO
const parallax = ref({ x: 0, y: 0 })
const props = defineProps({
    copy: Object
})


// LÓGICA DE TILT 3D DO MOCKUP
const tilt = ref({ x: 0, y: 0 })
const handleMockupTilt = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calcula a inclinação (máx 15 graus)
    tilt.value.x = (y - centerY) / 10
    tilt.value.y = -(x - centerX) / 10
}

const resetMockupTilt = () => {
    tilt.value.x = 0
    tilt.value.y = 0
}

const mockupStyle = computed(() => ({
    transform: `rotateX(${tilt.value.x + 20}deg) rotateY(${tilt.value.y - 25}deg) rotateZ(10deg)`
}))

const glareStyle = computed(() => ({
    transform: `translate(${tilt.value.y * 20}px, ${tilt.value.x * 20}px)`
}))
</script>

<style scoped>
/* ANIMAÇÃO DE FLUTUAÇÃO (LEVITATION) */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

.animate-float {
    animation: float 4s ease-in-out infinite;
}

/* GRADIENTE ANIMADO NO TEXTO */
@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-gradient-shift {
    animation: gradient-shift 6s ease infinite;
}

/* Restante do CSS preservado... */
.transform-3d {
    transform-style: preserve-3d;
}
</style>
