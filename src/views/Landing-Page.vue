<template>
    <div
        class="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden font-sans">

        <!-- HEADER HUD -->
        <header class="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center">
            <nav class="w-full max-w-5xl animate-slide-down">
                <div class="relative group">
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    </div>

                    <div
                        class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between p-2 pl-6 pr-2 transition-all duration-300 hover:border-white/20">

                        <!-- Logo -->
                        <a href="/" class="flex items-center gap-3 cursor-pointer group/logo">
                            <div class="relative w-10 h-8 flex items-center justify-center">
                                <div class="absolute inset-0 bg-amber-500 blur-lg opacity-20 animate-pulse-slow"></div>
                                <img src="/duckbio.png" alt="Logo"
                                    class="w-8 h-auto relative z-10 transform group-hover/logo:rotate-12 transition-transform duration-300" />
                            </div>
                            <span class="font-bold text-lg tracking-tight hidden sm:block">
                                Quack<span class="text-amber-400">Links</span>
                            </span>
                        </a>

                        <!-- Nav Links -->
                        <div
                            class="hidden md:flex items-center gap-1 bg-slate-950/50 rounded-xl p-1 border border-white/5">
                            <a v-for="item in navItems" :key="item.name" :href="item.href"
                                class="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 relative group overflow-hidden">
                                <span class="relative z-10">{{ item.name }}</span>
                                <div
                                    class="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                </div>
                            </a>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-3">
                            <a href="/login"
                                class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                                Entrar
                            </a>
                            <a href="/register"
                                class="relative px-6 py-2.5 bg-amber-400 text-slate-900 text-sm font-bold rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                                <span class="relative z-10 flex items-center gap-2">
                                    Criar Bio
                                    <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div
                                    class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <!-- HERO SECTION (A Nova Section) -->
        <section id="hero" class="relative pt-44 pb-20 px-4 overflow-hidden">
            <!-- Animated background gradients -->
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px] animate-float">
            </div>
            <div
                class="absolute top-40 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px] animate-float-delayed">
            </div>
            <div
                class="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow">
            </div>

            <div class="container mx-auto max-w-7xl relative z-10">
                <div class="text-center" :class="isVisible ? 'animate-fade-in-up' : 'opacity-0'">

                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-gradient-to-r from-sky-500/10 to-amber-500/10 backdrop-blur-xl rounded-full border border-sky-400/20 shadow-lg animate-slide-down">
                        <Sparkles :size="18" class="text-sky-400 animate-spin-slow" />
                        <span
                            class="text-sm font-bold bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">
                            Novo: Integração com Spotify
                        </span>
                        <div class="w-2 h-2 bg-sky-400 rounded-full animate-ping"></div>
                    </div>

                    <!-- Main headline -->
                    <h1
                        class="text-3xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9] animate-fade-in-up-delayed">
                        <span class="block text-balance" style="animation-delay: 0.1s">
                            Seus links,
                        </span>
                        <span
                            class="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 animate-gradient-x"
                            style="animation-delay: 0.2s">
                            seu estilo.
                        </span>
                    </h1>

                    <!-- Subtitle -->
                    <p class="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up"
                        style="animation-delay: 0.3s">
                        A plataforma de biolinks mais completa do Brasil.
                        <span class="text-white font-semibold">Design premium</span>,
                        <span class="text-white font-semibold">analytics avançado</span> e
                        <span class="text-white font-semibold">100% personalizável</span>.
                    </p>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
                        style="animation-delay: 0.4s">
                        <button
                            class="group relative w-full sm:w-auto px-10 py-5 text-lg font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
                            <span class="relative z-10 flex items-center justify-center gap-3">
                                Criar minha página
                                <ArrowRight :size="22"
                                    class="group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            </div>
                        </button>

                        <button
                            class="group w-full sm:w-auto px-10 py-5 text-lg font-black bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 text-white rounded-2xl hover:border-amber-400/50 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105">
                            <div class="relative">
                                <div
                                    class="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity">
                                </div>
                                <Play :size="22" class="fill-current relative z-10" />
                            </div>
                            Ver demonstração
                        </button>
                    </div>

                    <!-- Stats -->
                    <div class="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-12 py-8 px-10 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl animate-fade-in-up"
                        style="animation-delay: 0.5s">
                        <div v-for="stat in stats" :key="stat.label" class="stat-item text-center group cursor-default"
                            @mouseenter="stat.hovered = true" @mouseleave="stat.hovered = false">
                            <div class="relative">
                                <div
                                    class="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                </div>
                                <div
                                    class="text-4xl sm:text-5xl font-black relative z-10 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                                    {{ stat.value }}
                                </div>
                            </div>
                            <div
                                class="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2 group-hover:text-amber-400 transition-colors">
                                {{ stat.label }}
                            </div>
                        </div>
                        <div
                            class="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-slate-700 to-transparent">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- EXPLORE SECTION (Antigo Showcase) -->
        <section id="explore" class="py-24 px-4 relative bg-slate-900/30 border-y border-white/5">
            <div class="container mx-auto max-w-7xl">
                <div class="grid lg:grid-cols-2 gap-16 items-center">

                    <!-- Left: Controls -->
                    <div v-observe class="scroll-hidden space-y-8 order-2 lg:order-1">
                        <div>
                            <h3 class="text-4xl md:text-5xl font-black mb-6">Explore <span
                                    class="text-amber-400">Possibilidades</span></h3>
                            <p class="text-lg text-slate-400 leading-relaxed">
                                Nossa engine de renderização permite qualquer estilo. Do minimalismo corporativo ao caos
                                do cybercore.
                            </p>
                        </div>

                        <!-- Style Switcher Tabs -->
                        <div class="space-y-4">
                            <div v-for="(profile, key) in demoProfiles" :key="key" @click="activeProfileKey = key"
                                class="p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                :class="activeProfileKey === key ? 'bg-slate-800 border-amber-500/50 shadow-2xl' : 'bg-slate-900/50 border-white/5 hover:bg-slate-800'">

                                <div class="flex items-center gap-5 relative z-10">
                                    <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform duration-300"
                                        :class="activeProfileKey === key ? 'scale-110 bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'">
                                        <component :is="profile.icon" size="24" />
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-bold"
                                            :class="activeProfileKey === key ? 'text-white' : 'text-slate-300'">{{
                                                profile.label }}</h4>
                                        <p class="text-sm text-slate-500">{{ profile.desc }}</p>
                                    </div>
                                </div>
                                <!-- Progress bar for active tab -->
                                <div v-if="activeProfileKey === key"
                                    class="absolute bottom-0 left-0 h-1 bg-amber-400 transition-all duration-[4000ms] ease-linear w-full">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: The LIVE Preview -->
                    <div v-observe class="scroll-hidden order-1 lg:order-2 flex justify-center perspective-1000">
                        <div
                            class="relative w-[320px] sm:w-[380px] h-[700px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden transform transition-all duration-500 hover:rotate-y-6 hover:scale-105">

                            <!-- Dynamic Content Render based on activeProfile -->
                            <div class="w-full h-full relative overflow-y-auto custom-scrollbar transition-all duration-500"
                                :style="getBackgroundStyle(currentDemo)">

                                <!-- Overlays -->
                                <div v-if="currentDemo.overlay === 'noise'"
                                    class="absolute inset-0 opacity-10 pointer-events-none bg-noise"></div>
                                <div v-if="currentDemo.overlay === 'scanlines'"
                                    class="absolute inset-0 opacity-20 pointer-events-none bg-scanlines"></div>
                                <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>

                                <!-- Content Container -->
                                <div class="relative z-10 flex flex-col items-center pt-16 px-6 pb-10 min-h-full">

                                    <!-- Avatar -->
                                    <div class="relative mb-6">
                                        <div class="w-24 h-24 rounded-full p-1" :style="getRingStyle(currentDemo)">
                                            <img :src="currentDemo.avatar"
                                                class="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </div>

                                    <!-- Title / Username -->
                                    <h2 class="text-2xl font-bold mb-2 text-center"
                                        :class="getTitleClasses(currentDemo)" :style="{ color: currentDemo.textColor }"
                                        :data-text="currentDemo.username">
                                        {{ currentDemo.username }}
                                    </h2>

                                    <p class="text-sm text-center mb-8 opacity-80"
                                        :style="{ color: currentDemo.textColor }">
                                        {{ currentDemo.bio }}
                                    </p>

                                    <!-- Links -->
                                    <div class="w-full space-y-4">
                                        <div v-for="(link, idx) in currentDemo.links" :key="idx"
                                            class="w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300 cursor-pointer group link-item"
                                            :class="getLinkClasses(currentDemo)"
                                            :style="{ animationDelay: `${idx * 100}ms` }">
                                            <component :is="link.icon" size="20" />
                                            <span class="font-bold text-sm">{{ link.text }}</span>
                                        </div>
                                    </div>

                                    <!-- Fake Spotify Widget -->
                                    <div v-if="currentDemo.showSpotify" class="mt-auto pt-8 w-full animate-fade-in">
                                        <div
                                            class="bg-black/40 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10">
                                            <div
                                                class="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                                                <Music size="20" class="text-black" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="h-3 w-24 bg-white/20 rounded mb-1.5"></div>
                                                <div class="h-2 w-16 bg-white/10 rounded"></div>
                                            </div>
                                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Phone Notch -->
                            <div
                                class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FEATURES GRID -->
        <section id="features" class="py-24 px-4">
            <div class="container mx-auto max-w-6xl">
                <div v-observe class="scroll-hidden text-center mb-16">
                    <h3 class="text-4xl font-bold mb-4">Features <span class="text-amber-400">Insanas</span></h3>
                    <p class="text-slate-400">Tudo o que você precisa para dominar sua presença digital.</p>
                </div>

                <div class="grid md:grid-cols-3 gap-6">
                    <div v-for="(feature, idx) in features" :key="idx" v-observe
                        class="scroll-hidden group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        :style="{ transitionDelay: `${idx * 100}ms` }">

                        <div
                            class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        </div>

                        <div class="relative z-10">
                            <div
                                class="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <component :is="feature.icon" :size="28" class="text-amber-400" />
                            </div>
                            <h4 class="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">
                                {{ feature.title }}</h4>
                            <p class="text-slate-400 leading-relaxed">{{ feature.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PRICING SECTION -->
        <section id="pricing" class="py-24 px-4 bg-slate-900/20 border-y border-white/5">
            <div class="container mx-auto max-w-6xl">
                <div v-observe class="scroll-hidden text-center mb-16">
                    <h3 class="text-4xl font-bold mb-4">Planos</h3>
                    <p class="text-slate-400">Comece grátis. Evolua quando precisar.</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="(plan, idx) in plans" :key="idx" v-observe
                        class="scroll-hidden relative p-8 rounded-3xl border transition-all duration-300 hover:scale-105"
                        :class="plan.popular ? 'bg-slate-900 border-amber-500/50 shadow-2xl shadow-amber-900/10' : 'bg-slate-950/50 border-white/5'"
                        :style="{ transitionDelay: `${idx * 150}ms` }">

                        <div v-if="plan.popular"
                            class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full uppercase tracking-wider">
                            Recomendado
                        </div>

                        <h4 class="text-xl font-bold mb-2">{{ plan.name }}</h4>
                        <div class="flex items-baseline gap-1 mb-6">
                            <span class="text-4xl font-black">{{ plan.price }}</span>
                            <span class="text-sm text-slate-500">/mês</span>
                        </div>

                        <ul class="space-y-4 mb-8">
                            <li v-for="feat in plan.features" :key="feat"
                                class="flex items-start gap-3 text-sm text-slate-300">
                                <Check :size="16" class="text-amber-400 shrink-0 mt-0.5" />
                                {{ feat }}
                            </li>
                        </ul>

                        <button class="w-full py-3 rounded-xl font-bold text-sm transition-all"
                            :class="plan.popular ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-slate-800 text-white hover:bg-slate-700'">
                            {{ plan.cta }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA FINAL -->
        <section class="py-32 px-4 relative overflow-hidden">
            <div class="container mx-auto max-w-4xl relative z-10">
                <div v-observe
                    class="scroll-scale-hidden relative rounded-[3rem] p-12 overflow-hidden text-center border border-amber-500/30 bg-slate-900/80 backdrop-blur-xl">
                    <div
                        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50">
                    </div>

                    <h2 class="text-4xl md:text-6xl font-black mb-6">Pronto para o <span
                            class="text-amber-400">show?</span></h2>
                    <p class="text-xl text-slate-400 mb-10">Junte-se a 50,000+ creators que usam QuackLinks.</p>

                    <a href="/register"
                        class="inline-block px-10 py-5 bg-amber-400 text-slate-900 text-lg font-bold rounded-2xl hover:bg-amber-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300">
                        Criar Conta Grátis
                    </a>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="border-t border-slate-800/50 py-12 text-center text-slate-500 text-sm">
            <div class="flex items-center justify-center gap-2 mb-4 opacity-50 hover:opacity-100 transition-opacity">
                <img src="/duckbio.png" class="w-6 h-auto grayscale" />
                <span>QuackLinks &copy; 2025</span>
            </div>
        </footer>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Sparkles, ArrowRight, Play, Check,
    Link, Palette, BarChart3, Music,
    Zap, Shield, Crown, Terminal, Gamepad2, Brush
} from 'lucide-vue-next'

// --- DIRETIVA DE SCROLL ---
const vObserve = {
    mounted: (el) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible')
                    observer.unobserve(el)
                }
            })
        }, { threshold: 0.15, rootMargin: '50px' })
        observer.observe(el)
    }
}

// --- VARIÁVEIS ADICIONADAS PARA CORRIGIR O ERRO ---
const isVisible = ref(false) // Controla a animação do Hero
const stats = ref([
    { value: '50K+', label: 'Usuários', hovered: false },
    { value: '1M+', label: 'Cliques', hovered: false },
    { value: '100+', label: 'Templates', hovered: false }
])

// --- DADOS DO PREVIEW INTERATIVO ---
const activeProfileKey = ref('gamer')
let intervalId = null

const demoProfiles = {
    gamer: {
        label: 'Pro Gamer',
        desc: 'Estilo agressivo, cores neon, efeitos glitch.',
        icon: Gamepad2,
        username: 'K3VIN_PLAYS',
        bio: 'FPS Pro Player | Live todos os dias às 18h',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        background: 'linear-gradient(to bottom, #2e0202, #0f0f0f)',
        overlay: 'scanlines',
        textColor: '#ff0055',
        titleEffect: 'glitch',
        buttonStyle: 'brutalist',
        showSpotify: true,
        links: [
            { icon: Crown, text: 'Twitch SUB' },
            { icon: Gamepad2, text: 'Discord Community' },
            { icon: Link, text: 'Setup Gear' }
        ]
    },
    artist: {
        label: 'Artista Digital',
        desc: 'Glassmorphism, gradientes suaves, elegante.',
        icon: Brush,
        username: 'Aria.Design',
        bio: 'Visual Designer & 3D Artist. Commissions Open.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
        background: 'linear-gradient(to bottom, #4c1d95, #1e1b4b)',
        overlay: 'noise',
        textColor: '#e9d5ff',
        titleEffect: 'typewriter',
        buttonStyle: 'glass',
        showSpotify: true,
        links: [
            { icon: Palette, text: 'Portfolio 2025' },
            { icon: Link, text: 'Behance' },
            { icon: Link, text: 'Instagram' }
        ]
    },
    dev: {
        label: 'Developer',
        desc: 'Minimalista, fonte mono, foco em conteúdo.',
        icon: Terminal,
        username: '<Dev.Source />',
        bio: 'Fullstack Dev building cool stuff.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        background: '#0a0a0a',
        overlay: 'none',
        textColor: '#00ff9d',
        titleEffect: 'neon',
        buttonStyle: 'minimal',
        showSpotify: false,
        links: [
            { icon: Terminal, text: 'GitHub Repo' },
            { icon: Link, text: 'Documentation' },
            { icon: Link, text: 'Blog Posts' },
            { icon: Link, text: 'Contact Me' }
        ]
    }
}

const currentDemo = computed(() => demoProfiles[activeProfileKey.value])

// --- LOGICA DE ESTILOS DO PREVIEW ---
const getBackgroundStyle = (profile) => ({
    background: profile.background,
})

const getRingStyle = (profile) => {
    if (profile.label === 'Pro Gamer') return { border: '2px solid #ff0055', boxShadow: '0 0 15px #ff0055' }
    if (profile.label === 'Artista Digital') return { background: 'linear-gradient(45deg, #a78bfa, #f472b6)' }
    return { border: '2px dashed #333' }
}

const getTitleClasses = (profile) => {
    if (profile.titleEffect === 'glitch') return 'effect-glitch font-black tracking-widest uppercase'
    if (profile.titleEffect === 'typewriter') return 'typewriter font-mono'
    if (profile.titleEffect === 'neon') return 'effect-neon font-mono'
    return ''
}

const getLinkClasses = (profile) => {
    if (profile.buttonStyle === 'brutalist') return 'bg-white text-black font-bold border-b-4 border-r-4 border-slate-500 hover:translate-x-1 hover:translate-y-1 hover:border-0 hover:shadow-none'
    if (profile.buttonStyle === 'glass') return 'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20'
    if (profile.buttonStyle === 'minimal') return 'border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white'
    return ''
}

// --- DADOS GERAIS ---
const navItems = [
    { name: 'Showcase', href: '#showcase' },
    { name: 'Features', href: '#features' },
    { name: 'Planos', href: '#pricing' }
]

const features = [
    { icon: Zap, title: 'Instantâneo', description: 'Carregamento ultra-rápido para não perder nenhum clique.' },
    { icon: Palette, title: 'Customizável', description: 'Controle total sobre cores, fontes e animações.' },
    { icon: BarChart3, title: 'Analytics', description: 'Saiba exatamente quem está clicando e de onde vêm.' },
    { icon: Music, title: 'Mídia Embed', description: 'Spotify, YouTube, Twitch direto na sua página.' },
    { icon: Shield, title: 'Seguro', description: 'Proteção DDoS e SSL gratuito para todos os links.' },
    { icon: Crown, title: 'Domínio Próprio', description: 'Use seu próprio domínio .com ou .br.' },
]

const plans = [
    { name: 'Starter', price: 'R$ 0', features: ['1 Página', 'Links Ilimitados', 'Temas Básicos'], cta: 'Criar Grátis', popular: false },
    { name: 'Pro', price: 'R$ 29', features: ['3 Páginas', 'Remover Marca', 'Analytics Pro', 'Temas Premium'], cta: 'Assinar Pro', popular: true },
    { name: 'Agency', price: 'R$ 99', features: ['10 Páginas', 'API Access', 'Suporte Prioritário'], cta: 'Contatar', popular: false },
]

// Auto-rotate profiles & Set Visible
onMounted(() => {
    // IMPORTANTE: Ativar a flag para mostrar a Hero Section
    isVisible.value = true

    const keys = Object.keys(demoProfiles)
    let idx = 0
    intervalId = setInterval(() => {
        idx = (idx + 1) % keys.length
        activeProfileKey.value = keys[idx]
    }, 5000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})

</script>

<style scoped>
/* UTILS */
.custom-scrollbar::-webkit-scrollbar {
    width: 0px;
}

.scroll-hidden {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
}

.scroll-scale-hidden {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.8s ease;
}

.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* ANIMATIONS & FX */
@keyframes slide-down {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fade-in-up {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes pulse-slow {

    0%,
    100% {
        opacity: 0.2;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes gradient-x {
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

@keyframes slide-in-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-down {
    animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-up {
    opacity: 0;
    animation: fade-in-up 0.8s ease-out forwards;
}

.animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
}

.animate-gradient-x {
    background-size: 200% auto;
    animation: gradient-x 4s linear infinite;
}

.animate-fade-in {
    animation: slide-in-up 0.5s ease-out forwards;
}

.link-item {
    opacity: 0;
    animation: slide-in-up 0.5s ease-out forwards;
}

/* Animations extra do hero */
@keyframes float {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, -20px);
    }
}

@keyframes float-delayed {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, -10px);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float 8s ease-in-out infinite;
    animation-delay: 1s;
}

/* FX Patterns */
.bg-scanlines {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.2));
    background-size: 100% 4px;
}

.bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Glitch Effect */
.effect-glitch {
    position: relative;
}

.effect-glitch::before,
.effect-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    overflow: hidden;
}

.effect-glitch::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
    clip-path: inset(44% 0 61% 0);
    animation: glitch-anim-1 3s infinite linear alternate-reverse;
}

.effect-glitch::after {
    left: -2px;
    text-shadow: -2px 0 #00fff9;
    clip-path: inset(55% 0 10% 0);
    animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
    0% {
        clip-path: inset(20% 0 80% 0);
    }

    100% {
        clip-path: inset(80% 0 10% 0);
    }
}

@keyframes glitch-anim-2 {
    0% {
        clip-path: inset(10% 0 50% 0);
    }

    100% {
        clip-path: inset(40% 0 20% 0);
    }
}

/* Typewriter */
.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: .15em solid #a78bfa;
    animation: typing 3.5s steps(30, end), blink-caret .75s step-end infinite;
    display: inline-block;
    max-width: 100%;
}

@keyframes typing {
    from {
        width: 0
    }

    to {
        width: 100%
    }
}

@keyframes blink-caret {

    from,
    to {
        border-color: transparent
    }

    50% {
        border-color: #a78bfa;
    }
}

/* Neon */
.effect-neon {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00ff9d, 0 0 40px #00ff9d;
}

.perspective-1000 {
    perspective: 1000px;
}
</style>