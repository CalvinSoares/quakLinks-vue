<template>
    <div
        class="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden font-sans">

        <header class="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center">
            <nav class="w-full max-w-5xl animate-slide-down">
                <div class="relative group">
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    </div>

                    <div
                        class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between p-2 pl-6 pr-2 transition-all duration-300 hover:border-white/20">

                        <a href="/" class="flex items-center gap-3 cursor-pointer group/logo">
                            <div class="relative w-10 h-8 flex items-center justify-center">
                                <div class="absolute inset-0 bg-amber-500 blur-lg opacity-20 animate-pulse-slow">
                                </div>
                                <img src="/ducklogonatal.png" alt="Logo"
                                    class="w-8 h-auto relative z-10 transform group-hover/logo:rotate-12 transition-transform duration-300" />
                            </div>
                            <span class="font-bold text-lg tracking-tight hidden sm:block">
                                Quack<span class="text-amber-400">Links</span>
                            </span>
                        </a>


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

        <section id="hero" class="relative min-h-screen flex items-center pt-32 pb-20 px-4 overflow-hidden">

            <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]">
                </div>
                <div
                    class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]">
                </div>
            </div>

            <div class="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">


                <div class="text-left order-2 lg:order-1">

                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-fade-in-up">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span class="text-xs font-semibold text-slate-300 tracking-wide uppercase">Nova geração de
                            Biolinks</span>
                    </div>


                    <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in-up"
                        style="animation-delay: 100ms">
                        Seu perfil, <br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
                            outra dimensão.
                        </span>
                    </h1>


                    <p class="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed animate-fade-in-up"
                        style="animation-delay: 200ms">
                        A plataforma definitiva para centralizar sua identidade digital. Estética cyberpunk, analytics
                        em tempo real e liberdade total.
                    </p>


                    <div class="flex flex-wrap items-center gap-4 animate-fade-in-up" style="animation-delay: 300ms">
                        <a href="/register"
                            class="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Começar Agora
                            <ArrowRight :size="18" />
                        </a>
                        <a href="#explore"
                            class="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                            <Play :size="18" />
                            Ver Demo
                        </a>
                    </div>


                    <div class="mt-12 flex items-center gap-6 text-sm text-slate-500 animate-fade-in-up"
                        style="animation-delay: 400ms">
                        <div class="flex -space-x-3">
                            <img class="w-10 h-10 rounded-full border-2 border-[#0a0a0a]"
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                            <img class="w-10 h-10 rounded-full border-2 border-[#0a0a0a]"
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ane" />
                            <img class="w-10 h-10 rounded-full border-2 border-[#0a0a0a]"
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" />
                        </div>
                        <p>Junte-se a <span class="text-white font-bold">50k+</span> creators</p>
                    </div>
                </div>


                <div
                    class="relative flex justify-center lg:justify-end order-1 lg:order-2 [perspective:2000px] group/card">


                    <div class="relative w-[280px] sm:w-[340px] aspect-[9/19] transition-all duration-700 ease-out transform-3d animate-float-3d
                                [transform:rotateX(20deg)_rotateY(-25deg)_rotateZ(10deg)] 
                                group-hover/card:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)_scale(1.05)]">


                        <div
                            class="absolute -inset-[2px] bg-gradient-to-tr from-amber-500 via-purple-500 to-sky-500 rounded-[2.5rem] blur-sm opacity-70">
                        </div>

                        <div
                            class="relative w-full h-full bg-[#0f0f0f] rounded-[2.4rem] overflow-hidden border border-white/10 shadow-2xl">


                            <div
                                class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40">
                            </div>
                            <div
                                class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f0f]/80 to-[#0f0f0f]">
                            </div>


                            <div class="relative z-10 flex flex-col items-center pt-16 px-6 h-full">

                                <div
                                    class="w-24 h-24 rounded-full border-2 border-amber-400 p-1 shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-4">
                                    <img src="/ducklogonatal.png"
                                        class="w-full h-full rounded-full bg-slate-800 object-cover" />
                                </div>


                                <h3 class="text-2xl font-bold text-white mb-1">QuackUser</h3>
                                <p class="text-xs text-amber-400 mb-8 font-mono">@quack_king</p>


                                <div class="w-full space-y-3">
                                    <div
                                        class="w-full py-3 px-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-xs font-bold">
                                            YT</div>
                                        <span class="text-sm font-medium">Inscreva-se</span>
                                    </div>
                                    <div
                                        class="w-full py-3 px-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div class="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center">
                                            <Gamepad2 size="16" />
                                        </div>
                                        <span class="text-sm font-medium">Discord Server</span>
                                    </div>
                                    <div
                                        class="w-full py-3 px-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                            <Music size="16" />
                                        </div>
                                        <span class="text-sm font-medium">Spotify Playlist</span>
                                    </div>
                                </div>


                                <div
                                    class="mt-auto mb-8 w-full bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 bg-slate-700 rounded bg-[url('https://i.scdn.co/image/ab67616d0000b27341e31d6ea1d493dd77933ee5')] bg-cover">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="h-2 w-20 bg-white/40 rounded mb-1.5"></div>
                                        <div class="h-1.5 w-12 bg-white/20 rounded"></div>
                                    </div>
                                    <div class="flex gap-1">
                                        <div class="w-0.5 h-3 bg-green-500 animate-pulse"></div>
                                        <div class="w-0.5 h-5 bg-green-500 animate-pulse" style="animation-delay: 0.1s">
                                        </div>
                                        <div class="w-0.5 h-3 bg-green-500 animate-pulse" style="animation-delay: 0.2s">
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20">
                            </div>
                        </div>


                        <div
                            class="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none z-30">
                        </div>
                    </div>


                    <div
                        class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/50 blur-xl rounded-[100%] [transform:rotateX(60deg)] animate-shadow-pulse">
                    </div>

                </div>
            </div>


            <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
        </section>


        <section id="explore" class="py-24 px-4 relative bg-[#0f0f0f] border-t border-white/5">
            <div class="container mx-auto max-w-7xl">
                <div class="grid lg:grid-cols-2 gap-16 items-center">


                    <div v-observe class="scroll-hidden space-y-8 order-2 lg:order-1">
                        <div>
                            <h3 class="text-4xl md:text-5xl font-black mb-6">Explore <span
                                    class="text-amber-400">Possibilidades</span></h3>
                            <p class="text-lg text-slate-400 leading-relaxed">
                                Nossa engine de renderização permite qualquer estilo. Do minimalismo corporativo ao caos
                                do cybercore.
                            </p>
                        </div>


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

                                <div v-if="activeProfileKey === key"
                                    class="absolute bottom-0 left-0 h-1 bg-amber-400 transition-all duration-[4000ms] ease-linear w-full">
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-observe class="scroll-hidden order-1 lg:order-2 flex justify-center perspective-1000">
                        <div
                            class="relative w-[320px] sm:w-[380px] h-[700px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden transform transition-all duration-500 hover:rotate-y-6 hover:scale-105">

                            <div class="w-full h-full relative overflow-y-auto custom-scrollbar transition-all duration-500"
                                :style="getBackgroundStyle(currentDemo)">

                                <div v-if="currentDemo.overlay === 'noise'"
                                    class="absolute inset-0 opacity-10 pointer-events-none bg-noise"></div>
                                <div v-if="currentDemo.overlay === 'scanlines'"
                                    class="absolute inset-0 opacity-20 pointer-events-none bg-scanlines"></div>
                                <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>

                                <div class="relative z-10 flex flex-col items-center pt-16 px-6 pb-10 min-h-full">

                                    <div class="relative mb-6">
                                        <div class="w-24 h-24 rounded-full p-1" :style="getRingStyle(currentDemo)">
                                            <img :src="currentDemo.avatar"
                                                class="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </div>

                                    <h2 class="text-2xl font-bold mb-2 text-center"
                                        :class="getTitleClasses(currentDemo)" :style="{ color: currentDemo.textColor }"
                                        :data-text="currentDemo.username">
                                        {{ currentDemo.username }}
                                    </h2>

                                    <p class="text-sm text-center mb-8 opacity-80"
                                        :style="{ color: currentDemo.textColor }">
                                        {{ currentDemo.bio }}
                                    </p>

                                    <div class="w-full space-y-4">
                                        <div v-for="(link, idx) in currentDemo.links" :key="idx"
                                            class="w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300 cursor-pointer group link-item"
                                            :class="getLinkClasses(currentDemo)"
                                            :style="{ animationDelay: `${idx * 100}ms` }">
                                            <component :is="link.icon" size="20" />
                                            <span class="font-bold text-sm">{{ link.text }}</span>
                                        </div>
                                    </div>

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

                            <div
                                class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="py-24 px-4 bg-[#0a0a0a]">
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

        <section class="py-32 px-4 relative overflow-hidden bg-[#0a0a0a]">
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

        <footer class="border-t border-slate-800/50 py-12 text-center text-slate-500 text-sm bg-[#0a0a0a]">
            <div class="flex items-center justify-center gap-2 mb-4 opacity-50 hover:opacity-100 transition-opacity">
                <img src="/ducklogonatal.png" class="w-6 h-auto grayscale" />
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

const navItems = [
    { name: 'Showcase', href: '#explore' },
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

onMounted(() => {
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

.animate-fade-in {
    animation: slide-in-up 0.5s ease-out forwards;
}

@keyframes float-3d {

    0%,
    100% {
        transform: rotateX(20deg) rotateY(-25deg) rotateZ(10deg) translateY(0);
    }

    50% {
        transform: rotateX(20deg) rotateY(-25deg) rotateZ(10deg) translateY(-20px);
    }
}

@keyframes shadow-pulse {

    0%,
    100% {
        opacity: 0.5;
        transform: translateX(-50%) rotateX(60deg) scale(1);
    }

    50% {
        opacity: 0.3;
        transform: translateX(-50%) rotateX(60deg) scale(0.9);
    }
}

.animate-float-3d {
    animation: float-3d 6s ease-in-out infinite;
}

.animate-shadow-pulse {
    animation: shadow-pulse 6s ease-in-out infinite;
}

.transform-3d {
    transform-style: preserve-3d;
}

.bg-scanlines {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.2));
    background-size: 100% 4px;
}

.bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

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

.effect-neon {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00ff9d, 0 0 40px #00ff9d;
}

.perspective-1000 {
    perspective: 1000px;
}
</style>