<template>
    <section id="explore" ref="scrollTrack" class="explore-sticky-track relative h-[300vh] bg-[#0a0a0a]">

        <!-- O Container Sticky: Ocupa exatamente a tela do usuário -->
        <div class="explore-sticky-pin h-screen w-full flex items-center overflow-hidden">

            <!-- Background Dinâmico Suave -->
            <div class="absolute inset-0 transition-all duration-1000 opacity-10 pointer-events-none"
                :style="{ backgroundColor: steps[activeIndex].themeColor }"></div>

            <div class="container mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between h-full py-20 transition-all duration-500 ease-out"
                :style="contentShellStyle">

                <!-- LADO ESQUERDO: TEXTOS -->
                <div class="w-full lg:w-1/2 flex flex-col justify-center z-20 order-2 lg:order-1 mt-10 lg:mt-0"
                    :style="textColumnStyle">
                    <div class="relative h-48 sm:h-64">
                        <TransitionGroup name="text-fade">
                            <div v-for="(step, index) in steps" :key="index" v-show="activeIndex === index"
                                class="absolute inset-0 flex flex-col justify-center">

                                <div class="flex items-center gap-3 mb-4">
                                    <div class="h-[1px] w-12 bg-amber-400"></div>
                                    <span class="text-amber-400 font-mono text-xs tracking-[0.2em] uppercase">
                                        {{ step.tag }}
                                    </span>
                                </div>

                                <h2
                                    class="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.85] tracking-tighter">
                                    {{ step.titleStart }}<br />
                                    <span :style="{ color: step.themeColor }" class="transition-colors duration-500">
                                        {{ step.titleHighlight }}
                                    </span>
                                </h2>

                                <p
                                    class="text-slate-400 max-w-sm text-lg leading-relaxed border-l border-white/10 pl-6">
                                    {{ step.description }}
                                </p>
                            </div>
                        </TransitionGroup>
                    </div>

                    <!-- Indicador de progresso lateral (estilo PagFlex) -->
                    <div class="flex items-center gap-4 mt-16">
                        <div v-for="(_, i) in steps" :key="i" class="group cursor-pointer flex items-center"
                            @click="scrollToStep(i)">
                            <div class="h-1.5 transition-all duration-500 rounded-full"
                                :class="activeIndex === i ? 'w-10 bg-amber-400' : 'w-2 bg-white/20'">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LADO DIREITO: O CELULAR -->
                <div class="w-full lg:w-1/2 flex items-center justify-center lg:justify-end order-1 lg:order-2">
                    <div class="relative w-[260px] sm:w-[320px] aspect-[9/18.5] transition-transform duration-400"
                        :style="phoneFrameStyle">

                        <!-- Glow de fundo que reage ao scroll -->
                        <div class="absolute -inset-20 blur-[100px] opacity-20 transition-colors duration-1000 -z-10"
                            :style="{ backgroundColor: steps[activeIndex].themeColor }"></div>

                        <!-- Frame do Celular -->
                        <div
                            class="relative w-full h-full bg-[#050505] rounded-[3rem] border-[10px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">

                            <Transition name="phone-content" mode="out-in">
                                <div :key="activeIndex" class="absolute inset-0 flex flex-col">

                                    <!-- Midia de Background -->
                                    <div class="absolute inset-0 z-0">
                                        <video v-if="steps[activeIndex].type === 'video'" autoplay muted loop
                                            playsinline class="w-full h-full object-cover opacity-60">
                                            <source :src="steps[activeIndex].bgSource" type="video/mp4">
                                        </video>
                                        <img v-else-if="steps[activeIndex].type === 'image'"
                                            :src="steps[activeIndex].bgSource"
                                            class="w-full h-full object-cover opacity-50" />
                                        <div v-else class="w-full h-full opacity-40"
                                            :style="{ background: steps[activeIndex].bgSource }"></div>

                                        <!-- Overlay de Scanlines apenas no Cyber -->
                                        <div v-if="steps[activeIndex].overlay === 'scanlines'"
                                            class="absolute inset-0 bg-scanlines opacity-40"></div>
                                        <div
                                            class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black">
                                        </div>
                                    </div>

                                    <!-- UI mock -->
                                    <div class="relative z-10 p-6 pt-16 flex flex-col items-center h-full">
                                        <div class="w-20 h-20 rounded-full p-1 border-2 mb-4 transition-all duration-700"
                                            :style="{ borderColor: steps[activeIndex].themeColor, transform: 'scale(1)' }">
                                            <img :src="steps[activeIndex].avatar"
                                                class="w-full h-full rounded-full object-cover bg-slate-800" />
                                        </div>

                                        <h3 class="text-xl font-bold text-white mb-1"
                                            :class="steps[activeIndex].fontClass">
                                            {{ steps[activeIndex].username }}
                                        </h3>

                                        <div class="w-full mt-8 space-y-3">
                                            <div v-for="l in 3" :key="l"
                                                class="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
                                                <div class="w-2 h-2 rounded-full"
                                                    :style="{ backgroundColor: steps[activeIndex].themeColor }"></div>
                                                <div class="h-1.5 w-20 bg-white/20 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>

                            <div
                                class="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-50">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const activeIndex = ref(0)
const scrollTrack = ref(null)
const sectionProgress = ref(0)

const steps = [
    {
        tag: "Digital Identity",
        titleStart: "Estética",
        titleHighlight: "Cybercore",
        description: "Layouts futuristas com glitches e scanlines para quem vive na vanguarda digital.",
        themeColor: "#ff0055",
        type: "color",
        bgSource: "linear-gradient(45deg, #2e0202, #000)",
        overlay: "scanlines",
        username: "K3VIN_PLAYS",
        fontClass: "font-black tracking-tighter",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    {
        tag: "Vibrant Motion",
        titleStart: "Fundo em",
        titleHighlight: "Vídeo",
        description: "Adicione movimento e energia com backgrounds dinâmicos que prendem a atenção.",
        themeColor: "#a78bfa",
        type: "video",
        bgSource: "https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-purple-and-blue-gradient-23875-large.mp4",
        username: "Aria.Vibes",
        fontClass: "font-sans",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    },
    {
        tag: "Premium Visual",
        titleStart: "Fotografia",
        titleHighlight: "Imersiva",
        description: "Utilize imagens em alta definição para criar uma conexão real e profissional.",
        themeColor: "#fbbf24",
        type: "image",
        bgSource: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
        username: "Nature.PH",
        fontClass: "font-serif italic",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    },
    {
        tag: "High Conversion",
        titleStart: "Foco no",
        titleHighlight: "Essencial",
        description: "Design minimalista e limpo. Velocidade máxima de carregamento e foco em cliques.",
        themeColor: "#00ff9d",
        type: "color",
        bgSource: "#050505",
        username: "<Dev.Source />",
        fontClass: "font-mono",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    }
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const contentShellStyle = computed(() => {
    const introProgress = clamp(sectionProgress.value * 2.2, 0, 1)

    return {
        opacity: `${0.72 + introProgress * 0.28}`,
        transform: `translateY(${(1 - introProgress) * 28}px) scale(${0.965 + introProgress * 0.035})`,
    }
})

const textColumnStyle = computed(() => {
    const segmentSize = 1 / steps.length
    const currentSegmentStart = activeIndex.value * segmentSize
    const progressInSegment = clamp((sectionProgress.value - currentSegmentStart) / segmentSize, 0, 1)

    return {
        transform: `translateY(${(1 - progressInSegment) * 12}px)`,
        opacity: `${0.88 + progressInSegment * 0.12}`,
    }
})

const phoneFrameStyle = computed(() => {
    const introProgress = clamp(sectionProgress.value * 2, 0, 1)

    return {
        transform: `translateY(${(1 - introProgress) * 20}px) scale(${0.94 + introProgress * 0.06})`,
    }
})

const handleScroll = () => {
    if (!scrollTrack.value) return

    const rect = scrollTrack.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const totalScrollable = Math.max(rect.height - windowHeight, 1)
    const rawProgress = clamp((-rect.top) / totalScrollable, 0, 1)

    sectionProgress.value = rawProgress
    if (rect.top > 0) {
        activeIndex.value = 0
        return
    }

    if (rect.bottom < windowHeight) {
        activeIndex.value = steps.length - 1
        return
    }

    const segmentProgress = rawProgress * steps.length
    const stepIndex = Math.min(Math.floor(segmentProgress), steps.length - 1)

    if (activeIndex.value !== stepIndex) {
        activeIndex.value = stepIndex
    }
}

const scrollToStep = (index) => {
    if (!scrollTrack.value) return
    const rect = scrollTrack.value.getBoundingClientRect()
    const sectionTop = window.scrollY + rect.top
    const totalScrollable = Math.max(scrollTrack.value.offsetHeight - window.innerHeight, 1)
    const stepProgress = steps.length === 1 ? 0 : index / (steps.length - 1)
    const targetScroll = sectionTop + totalScrollable * stepProgress

    window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    })
}

onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
/* Melhorei o tempo das transições para 0.8s para dar mais suavidade ao "passar" */
.phone-content-enter-active,
.phone-content-leave-active {
    transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.phone-content-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
}

.phone-content-leave-to {
    opacity: 0;
    transform: scale(1.1) translateY(-30px);
}

.text-fade-enter-active,
.text-fade-leave-active {
    transition: all 0.45s ease-in-out;
}

.text-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.text-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.bg-scanlines {
    background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.5));
    background-size: 100% 4px;
}

.explore-sticky-track {
    scroll-snap-align: start;
    scroll-margin-top: 0;
    overflow: visible;
    backface-visibility: hidden;
}

.explore-sticky-pin {
    position: sticky;
    top: 0;
}
</style>
