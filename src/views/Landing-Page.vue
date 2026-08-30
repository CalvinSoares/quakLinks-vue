<template>
    <div
        class="landing-page min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-400 selection:text-slate-900 font-sans">

        <header :class="[
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
            isExploreActive ? 'opacity-0 -translate-y-full pointer-events-none' : '',
            isScrolled ? 'pt-4 px-4' : 'pt-0 px-0'
        ]">
            <nav :class="[
                'mx-auto transition-all duration-500 ease-in-out w-full',
                isScrolled ? 'max-w-5xl' : 'max-w-full'
            ]">
                <div class="relative group">
                    <div :class="[
                        'absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 blur-xl transition-opacity duration-700',
                        isScrolled ? 'opacity-100 rounded-2xl' : 'opacity-0'
                    ]"></div>

                    <div :class="[
                        'relative transition-all duration-500 ease-in-out flex items-center justify-between border-white/10 backdrop-blur-xl',
                        isScrolled
                            ? 'bg-slate-900/80 rounded-2xl shadow-2xl p-2 pl-6 pr-2 border'
                            : 'bg-slate-950/40 rounded-none p-4 px-8 border-b'
                    ]">
                        <a href="/" class="flex items-center gap-3 cursor-pointer group/logo">
                            <div class="relative w-10 h-8 flex items-center justify-center">
                                <div class="absolute inset-0 bg-amber-500 blur-lg opacity-20 animate-pulse-slow"></div>
                                <img src="/duckbio.png" alt="QuackLinks — logo da plataforma de biolinks"
                                    class="w-8 h-auto relative z-10 transform group-hover/logo:rotate-12 transition-transform duration-300" />
                            </div>
                            <span class="font-bold text-lg tracking-tight hidden sm:block">
                                Quack<span class="text-amber-400">Links</span>
                            </span>
                        </a>

                        <div :class="[
                            'hidden md:flex items-center gap-1 transition-all duration-500 rounded-xl p-1',
                            isScrolled ? 'bg-slate-950/50 border border-white/5' : 'bg-transparent'
                        ]">
                            <a v-for="item in navItems" :key="item.name" :href="item.href"
                                class="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 relative group overflow-hidden">
                                <span class="relative z-10">{{ item.name }}</span>
                                <div
                                    class="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                </div>
                            </a>
                        </div>

                        <div class="flex items-center gap-3">
                            <LanguageMenuButton button-class="h-10 w-10 border-white/10 bg-slate-950/60"
                                panel-class="right-0 top-[calc(100%+0.75rem)]" panel-width-class="w-72" />

                            <a href="/login"
                                class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                                {{ copy.auth.login }}
                            </a>

                            <a href="/register" :class="[
                                'relative bg-amber-400 text-slate-900 text-sm font-bold overflow-hidden group hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
                                isScrolled ? 'px-6 py-2.5 rounded-xl' : 'px-8 py-3 rounded-lg'
                            ]">
                                <span class="relative z-10 flex items-center gap-2">
                                    {{ copy.auth.createBio }}
                                    <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <HeroSection :copy="copy" />

        <FeaturesCarousel :features="features" :section-copy="copy.features" />

        <ExploreStickySection @explore-active="isExploreActive = $event" />

        <PricingSection :copy="copy" :pricing-cards="pricingCards" />

        <FaqSection />

        <!-- Final CTA Section with refined natural ScrollExpand -->
        <section ref="finalCtaSection" class="final-cta-section relative bg-[#0a0a0a]" :style="containerStyle">
            <div class="scroll-expand-sticky">
                <div class="scroll-expand-frame" :style="frameStyle">
                    <div class="scroll-expand-content-inner">
                        <div class="text-center max-w-3xl mx-auto px-4 w-full">
                            <h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white tracking-tight">
                                <template v-if="locale === 'pt'">O seu próximo capítulo <span
                                        class="text-amber-400">começa aqui.</span></template>
                                <template v-else-if="locale === 'en'">Your next chapter <span
                                        class="text-amber-400">starts here.</span></template>
                                <template v-else>Tu próximo capítulo <span class="text-amber-400">empieza
                                        aquí.</span></template>
                            </h2>

                            <p class="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-normal">
                                {{ copy.finalCta.description }}
                            </p>

                            <form @submit.prevent="handleSubmitUsername" class="max-w-xl mx-auto mb-6">
                                <div class="flex flex-col sm:flex-row gap-2">
                                    <div class="relative flex-1">
                                        <span
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono pointer-events-none">
                                            quacklinks.com.br/
                                        </span>
                                        <input v-model="checkUsernameInput" type="text"
                                            :placeholder="copy.finalCta.usernamePlaceholder"
                                            class="w-full pl-[150px] pr-12 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                                            :class="{
                                                'border-emerald-500': usernameStatus === 'available',
                                                'border-red-500': usernameStatus === 'taken' || usernameStatus === 'invalid'
                                            }" :disabled="isCheckingUsername" @input="handleUsernameInput" />
                                        <div v-if="isCheckingUsername"
                                            class="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div
                                                class="w-4 h-4 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                        class="px-6 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-400/10"
                                        :disabled="isCheckingUsername || !checkUsernameInput.trim()">
                                        {{ copy.finalCta.button }}
                                    </button>
                                </div>
                                <p v-if="usernameCheckMessage" class="mt-3 text-sm text-left"
                                    :class="usernameCheckMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'">
                                    {{ usernameCheckMessage.text }}
                                </p>
                            </form>

                            <p class="text-sm text-slate-500">
                                <template v-if="locale === 'pt'">Já tem uma conta? <a href="/login"
                                        class="text-amber-400 hover:underline">Fazer login</a></template>
                                <template v-else-if="locale === 'en'">Already have an account? <a href="/login"
                                        class="text-amber-400 hover:underline">Sign in</a></template>
                                <template v-else>¿Ya tienes cuenta? <a href="/login"
                                        class="text-amber-400 hover:underline">Iniciar sesión</a></template>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <FooterSection />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LanguageMenuButton from '@/components/LanguageMenuButton.vue'
import { useAppLanguage } from '@/composables/useAppLanguage'
import { useSeo } from '@/composables/useSeo'
import { landingFaqItems } from '@/constants/faq'
import {
    getFaqSchema,
    getOrganizationSchema,
    getSoftwareApplicationSchema,
    getWebSiteSchema,
} from '@/config/seo'
import { planFeatures } from '@/constants/plans'
import {
    ArrowRight,
    Link, Palette, BarChart3, Music,
    Zap, Shield, Crown, Terminal, Gamepad2, Brush
} from 'lucide-vue-next'
import FooterSection from '@/components/landingpage/FooterSection.vue'
import { isPublicHandleAvailable, normalizePublicHandle, reservedPublicHandles } from '@/utils/publicHandle'
import FaqSection from '@/components/landingpage/FaqSection.vue'
import ExploreStickySection from '@/components/landingpage/ExploreStickySection.vue'
import FeaturesCarousel from '@/components/landingpage/FeaturesCarousel.vue'
import PricingSection from '@/components/landingpage/PricingSection.vue'
import HeroSection from '@/components/landingpage/HeroSection.vue'

useSeo({
    path: '/',
    jsonLd: [
        getOrganizationSchema(),
        getWebSiteSchema(),
        getSoftwareApplicationSchema(),
        getFaqSchema(landingFaqItems),
    ],
})

const isScrolled = ref(false)
const isExploreActive = ref(false)
const finalCtaSection = ref(null)
const router = useRouter()

// Username check state
const checkUsernameInput = ref('')
const isCheckingUsername = ref(false)
const usernameStatus = ref('idle')
const usernameCheckMessage = ref(null)
let usernameCheckTimer = null

// ScrollExpand state (Natural & Organic interpolation)
const smoothProgress = ref(0)
const targetProgress = ref(0)
let rafId = null
let ticking = false

const containerStyle = computed(() => ({
    position: 'relative',
    width: '100%',
    height: '140vh', // Altura reduzida para transição mais rápida e menos cansativa
}))

// Curva de interpolação personalizada (Evita solavancos e dá suavidade de app nativo)
const eased = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const frameStyle = computed(() => {
    const t = eased(smoothProgress.value)
    // Começa num tamanho elegante (70vw / 70vh) e expande até cobrir a tela (100%)
    const widthPct = 75 + (100 - 75) * t
    const heightPct = 75 + (100 - 75) * t
    const radius = 32 - 32 * t // Arredondamento some suavemente

    return {
        width: `${widthPct}%`,
        height: `${heightPct}vh`,
        borderRadius: `${radius}px`,
        background: 'linear-gradient(180deg, #111113 0%, #070708 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: `${Math.max(0, 1 - t * 2)}px solid rgba(255, 255, 255, 0.08)`
    }
})

function updateProgress() {
    if (!finalCtaSection.value) return
    const rect = finalCtaSection.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const totalScrollable = Math.max(rect.height - windowHeight, 1)
    const distanceScrolled = Math.max(0, -rect.top)
    targetProgress.value = Math.min(distanceScrolled / totalScrollable, 1)
}

function handleScrollProgress() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateProgress()
            ticking = false
        })
        ticking = true
    }
}

function animate() {
    const diff = targetProgress.value - smoothProgress.value
    // Fator de inércia ajustado para deixar o movimento denso e natural
    if (Math.abs(diff) > 0.0001) {
        smoothProgress.value += diff * 0.08
    } else {
        smoothProgress.value = targetProgress.value
    }
    rafId = requestAnimationFrame(animate)
}

const handleScrollNav = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    handleScrollNav()
    animate()
    window.addEventListener('scroll', handleScrollNav, { passive: true })
    window.addEventListener('scroll', handleScrollProgress, { passive: true })
    window.addEventListener('resize', handleScrollProgress, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollNav)
    window.removeEventListener('scroll', handleScrollProgress)
    window.removeEventListener('resize', handleScrollProgress)
    if (rafId) cancelAnimationFrame(rafId)
    if (usernameCheckTimer) clearTimeout(usernameCheckTimer)
})

const { locale } = useAppLanguage()

const translations = {
    pt: {
        auth: { login: 'Entrar', createBio: 'Criar Bio' },
        hero: {
            badge: 'Tudo o que você cria, num só link',
            titleStart: 'Sua audiência merece',
            titleHighlight: 'link na bio.',
            description: 'Centralize seu conteúdo, produtos e redes sociais em uma página com a sua identidade. Sem código, sem frescura.',
            primaryCta: 'Criar minha página grátis',
            secondaryCta: 'Ver exemplos',
        },
        mockups: {
            subscribe: 'Inscreva-se',
            discordServer: 'Servidor Discord',
            spotifyPlaylist: 'Playlist Spotify',
        },
        explore: {
            titleStart: 'Dá uma',
            titleHighlight: 'olhada',
            description: 'Escolhe entre vários estilos. Gamer, elegante, minimalista ou cria o teu.',
        },
        features: {
            titleStart: '',
            titleHighlight: 'Recursos',
            description: 'Só o essencial pra montar sua página.',
        },
        pricing: {
            title: 'Planos',
            description: 'Grátis pra começar. Upgrade quando quiser.',
            recommended: 'Recomendado',
            perMonth: '/mês',
            compareLabel: 'Planos',
            helper: 'Recursos que você realmente usa.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar e imagem de fundo',
                'Gradientes e estilos visuais': 'Gradientes e estilos',
                'Vídeo no background': 'Vídeo de fundo',
                'Cursor personalizado': 'Cursor personalizado',
                'Playlist e player de áudio': 'Player de música',
                'Agendamento de links': 'Agendar links',
                'Domínio personalizado': 'Domínio próprio',
                'Efeito Máquina de Escrever': 'Efeito máquina de escrever',
                'Templates e assets premium': 'Templates premium',
            },
            free: {
                name: 'Free',
                pill: 'Grátis',
                price: 'R$ 0',
                priceSuffix: 'para sempre',
                note: 'Comece sem pagar nada.',
                description: 'Publique seus links e monte a página do jeito que quiser.',
                cta: 'Criar conta grátis',
                extraFeature: 'Links essenciais',
            },
            premium: {
                name: 'Premium',
                pill: 'Avançado',
                price: 'Upgrade',
                priceSuffix: '',
                note: 'Recursos extras de verdade.',
                description: 'Mais opções visuais, domínio próprio e muito mais.',
                cta: 'Ver Premium',
                includesFree: 'Tudo do Free, mais',
            },
        },
        finalCta: {
            description: 'Garanta o seu endereço personalizado agora mesmo. É rápido e gratuito.',
            button: 'Criar conta',
            usernamePlaceholder: 'seu-nome',
            usernameChecking: 'Verificando...',
            usernameAvailable: 'Nome disponível',
            usernameTaken: 'Nome já está em uso',
            usernameInvalid: 'Use só letras, números, _ ou -',
            usernameTooShort: 'Mínimo de 3 caracteres',
            usernameReserved: 'Esse nome não está disponível',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Estilo gamer, cores neon.', bio: 'FPS Pro Player | Live todos os dias às 18h' },
            artist: { label: 'Artista', desc: 'Gradientes suaves, elegante.', bio: 'Designer e artista 3D. Encomendas abertas.' },
            dev: { label: 'Dev', desc: 'Minimalista, foco no conteúdo.', bio: 'Dev full stack criando coisas legais.' },
        },
        featuresList: [
            { title: 'Rápido', description: 'Página carrega num piscar.' },
            { title: 'Personalizável', description: 'Muda cores, fontes e mais.' },
            { title: 'Análises', description: 'Veja quem clica nos seus links.' },
            { title: 'Música', description: 'Spotify direto na sua página.' },
            { title: 'Domínio', description: 'Usa seu próprio domínio.' },
            { title: 'Mobile', description: 'Funciona bem no celular.' },
        ],
    },
    en: {
        auth: { login: 'Login', createBio: 'Create Bio' },
        hero: {
            badge: 'Everything you create, in one link',
            titleStart: 'Your audience deserves',
            titleHighlight: 'more than a basic link.',
            description: 'Centralize your content, products, and socials into a gorgeous custom page. No code, no fuss.',
            primaryCta: 'Create my free page',
            secondaryCta: 'See examples',
        },
        mockups: {
            subscribe: 'Subscribe',
            discordServer: 'Discord Server',
            spotifyPlaylist: 'Spotify Playlist',
        },
        explore: {
            titleStart: 'Take a',
            titleHighlight: 'look',
            description: 'Choose from different styles. Gamer, elegant, minimalist or create your own.',
        },
        features: {
            titleStart: '',
            titleHighlight: 'Features',
            description: 'Just the essentials to build your page.',
        },
        pricing: {
            title: 'Pricing',
            description: 'Free to start. Upgrade when you want.',
            recommended: 'Recommended',
            perMonth: '/month',
            compareLabel: 'Plans',
            helper: 'Features you actually use.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar and background image',
                'Gradientes e estilos visuais': 'Gradients and styles',
                'Vídeo no background': 'Background video',
                'Cursor personalizado': 'Custom cursor',
                'Playlist e player de áudio': 'Music player',
                'Agendamento de links': 'Schedule links',
                'Domínio personalizado': 'Custom domain',
                'Efeito Máquina de Escrever': 'Typewriter effect',
                'Templates e assets premium': 'Premium templates',
            },
            free: {
                name: 'Free',
                pill: 'Free',
                price: '$0',
                priceSuffix: 'forever',
                note: 'Start without paying anything.',
                description: 'Publish your links and build your page your way.',
                cta: 'Create free account',
                extraFeature: 'Essential links',
            },
            premium: {
                name: 'Premium',
                pill: 'Advanced',
                price: 'Upgrade',
                priceSuffix: '',
                note: 'Real extra features.',
                description: 'More visual options, custom domain and more.',
                cta: 'View Premium',
                includesFree: 'Everything in Free, plus',
            },
        },
        finalCta: {
            description: "Claim your custom link right now. It's fast and free.",
            button: 'Create account',
            usernamePlaceholder: 'your-name',
            usernameChecking: 'Checking...',
            usernameAvailable: 'Name available',
            usernameTaken: 'Name already taken',
            usernameInvalid: 'Use only letters, numbers, _ or -',
            usernameTooShort: 'Minimum of 3 characters',
            usernameReserved: 'This name is not available',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Gamer style, neon colors.', bio: 'FPS Pro Player | Live every day at 6 PM' },
            artist: { label: 'Artist', desc: 'Soft gradients, elegant.', bio: 'Visual Designer & 3D Artist. Commissions Open.' },
            dev: { label: 'Dev', desc: 'Minimalist, content first.', bio: 'Fullstack Dev building cool stuff.' },
        },
        featuresList: [
            { title: 'Fast', description: 'Page loads in a blink.' },
            { title: 'Customizable', description: 'Change colors, fonts and more.' },
            { title: 'Analytics', description: 'See who clicks your links.' },
            { title: 'Music', description: 'Spotify right on your page.' },
            { title: 'Domain', description: 'Use your own domain.' },
            { title: 'Mobile', description: 'Works great on phones.' },
        ],
    },
    es: {
        auth: { login: 'Entrar', createBio: 'Crear Bio' },
        hero: {
            badge: 'Todo lo que creas, en un solo link',
            titleStart: 'Tu audiencia merece',
            titleHighlight: 'más que un enlace común.',
            description: 'Centraliza tu contenido, productos y redes sociales en una página con tu propia identidad. Sin código.',
            primaryCta: 'Crear mi página gratis',
            secondaryCta: 'Ver ejemplos',
        },
        mockups: {
            subscribe: 'Suscríbete',
            discordServer: 'Servidor Discord',
            spotifyPlaylist: 'Playlist Spotify',
        },
        explore: {
            titleStart: 'Echa un',
            titleHighlight: 'vistazo',
            description: 'Elige entre diferentes estilos. Gamer, elegante, minimalista o crea el tuyo.',
        },
        features: {
            titleStart: '',
            titleHighlight: 'Funciones',
            description: 'Solo lo esencial para montar tu página.',
        },
        pricing: {
            title: 'Planes',
            description: 'Gratis para empezar. Upgrade cuando quieras.',
            recommended: 'Recomendado',
            perMonth: '/mes',
            compareLabel: 'Planes',
            helper: 'Funciones que realmente usas.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar e imagen de fondo',
                'Gradientes e estilos visuais': 'Gradientes y estilos',
                'Vídeo no background': 'Video de fondo',
                'Cursor personalizado': 'Cursor personalizado',
                'Playlist e player de áudio': 'Reproductor de música',
                'Agendamento de links': 'Programar links',
                'Domínio personalizado': 'Dominio propio',
                'Efeito Máquina de Escrever': 'Efecto máquina de escribir',
                'Templates e assets premium': 'Plantillas premium',
            },
            free: {
                name: 'Free',
                pill: 'Gratis',
                price: 'R$ 0',
                priceSuffix: 'para siempre',
                note: 'Empieza sin pagar nada.',
                description: 'Publica tus links y arma la página como quieras.',
                cta: 'Crear cuenta gratis',
                extraFeature: 'Links esenciales',
            },
            premium: {
                name: 'Premium',
                pill: 'Avanzado',
                price: 'Upgrade',
                priceSuffix: '',
                note: 'Funciones extra de verdad.',
                description: 'Más opciones visuales, dominio propio y mucho más.',
                cta: 'Ver Premium',
                includesFree: 'Todo lo de Free, más',
            },
        },
        finalCta: {
            description: 'Reclama tu dirección personalizada ahora mismo. Es rápido y gratis.',
            button: 'Crear cuenta',
            usernamePlaceholder: 'tu-nombre',
            usernameChecking: 'Verificando...',
            usernameAvailable: 'Nombre disponible',
            usernameTaken: 'El nombre ya está en uso',
            usernameInvalid: 'Usa solo letras, números, _ o -',
            usernameTooShort: 'Mínimo de 3 caracteres',
            usernameReserved: 'Ese nombre no está disponible',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Estilo gamer, colores neon.', bio: 'FPS Pro Player | Live todos los días a las 18h' },
            artist: { label: 'Artista', desc: 'Gradientes suaves, elegante.', bio: 'Diseñadora visual y artista 3D. Encargos abiertos.' },
            dev: { label: 'Dev', desc: 'Minimalista, foco en contenido.', bio: 'Dev full stack creando cosas geniales.' },
        },
        featuresList: [
            { title: 'Rápido', description: 'Página carga en un abrir de ojos.' },
            { title: 'Personalizable', description: 'Cambia colores, fuentes y más.' },
            { title: 'Analíticas', description: 'Mira quién hace clic en tus links.' },
            { title: 'Música', description: 'Spotify directo en tu página.' },
            { title: 'Dominio', description: 'Usa tu propio dominio.' },
            { title: 'Móvil', description: 'Funciona bien en el celular.' },
        ],
    },
}

const copy = computed(() => translations[locale.value])

const activeProfileKey = ref('gamer')
let intervalId = null

const demoProfiles = computed(() => ({
    gamer: {
        label: copy.value.demoProfiles.gamer.label,
        desc: copy.value.demoProfiles.gamer.desc,
        icon: Gamepad2,
        username: 'K3VIN_PLAYS',
        bio: copy.value.demoProfiles.gamer.bio,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        background: 'linear-gradient(to bottom, #2e0202, #0f0f0f)',
        overlay: 'scanlines',
        textColor: '#ff0055',
        titleEffect: 'glitch',
        buttonStyle: 'brutalist',
        showSpotify: true,
        links: [
            { icon: Crown, text: locale.value === 'pt' ? 'Inscricao Twitch' : locale.value === 'es' ? 'Suscripcion Twitch' : 'Twitch SUB' },
            { icon: Gamepad2, text: locale.value === 'pt' ? 'Comunidade Discord' : locale.value === 'es' ? 'Comunidad Discord' : 'Discord Community' },
            { icon: Link, text: locale.value === 'pt' ? 'Equipamentos' : locale.value === 'es' ? 'Equipo' : 'Setup Gear' }
        ]
    },
    artist: {
        label: copy.value.demoProfiles.artist.label,
        desc: copy.value.demoProfiles.artist.desc,
        icon: Brush,
        username: 'Aria.Design',
        bio: copy.value.demoProfiles.artist.bio,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
        background: 'linear-gradient(to bottom, #4c1d95, #1e1b4b)',
        overlay: 'noise',
        textColor: '#e9d5ff',
        titleEffect: 'typewriter',
        buttonStyle: 'glass',
        showSpotify: true,
        links: [
            { icon: Palette, text: 'Portfolio 2026' },
            { icon: Link, text: 'Behance' },
            { icon: Link, text: 'Instagram' }
        ]
    },
    dev: {
        label: copy.value.demoProfiles.dev.label,
        desc: copy.value.demoProfiles.dev.desc,
        icon: Terminal,
        username: '<Dev.Source />',
        bio: copy.value.demoProfiles.dev.bio,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        background: '#0a0a0a',
        overlay: 'none',
        textColor: '#00ff9d',
        titleEffect: 'neon',
        buttonStyle: 'minimal',
        showSpotify: false,
        links: [
            { icon: Terminal, text: locale.value === 'pt' ? 'Repositorio GitHub' : locale.value === 'es' ? 'Repositorio GitHub' : 'GitHub Repo' },
            { icon: Link, text: locale.value === 'pt' ? 'Documentacao' : locale.value === 'es' ? 'Documentacion' : 'Documentation' },
            { icon: Link, text: locale.value === 'pt' ? 'Artigos do Blog' : locale.value === 'es' ? 'Articulos del Blog' : 'Blog Posts' },
            { icon: Link, text: locale.value === 'pt' ? 'Fale Comigo' : locale.value === 'es' ? 'Contactame' : 'Contact Me' }
        ]
    }
}))

const navItems = computed(() => [
    { name: locale.value === 'pt' ? 'Vitrine' : locale.value === 'es' ? 'Vitrina' : 'Showcase', href: '#explore' },
    { name: copy.value.pricing.title, href: '#pricing' }
])

const features = computed(() => [
    { icon: Zap, ...copy.value.featuresList[0] },
    { icon: Palette, ...copy.value.featuresList[1] },
    { icon: BarChart3, ...copy.value.featuresList[2] },
    { icon: Music, ...copy.value.featuresList[3] },
    { icon: Shield, ...copy.value.featuresList[4] },
    { icon: Crown, ...copy.value.featuresList[5] },
])

const localizePricingFeature = (label) => copy.value.pricing.featureLabels[label] ?? label

const pricingCards = computed(() => {
    const freeFeatures = planFeatures
        .filter((feature) => feature.free === true)
        .map((feature) => localizePricingFeature(feature.label))

    const premiumFeatures = planFeatures
        .filter((feature) => feature.premium === true)
        .map((feature) => localizePricingFeature(feature.label))

    return [
        {
            name: copy.value.pricing.free.name,
            pill: copy.value.pricing.free.pill,
            price: copy.value.pricing.free.price,
            priceSuffix: copy.value.pricing.free.priceSuffix,
            note: copy.value.pricing.free.note,
            description: copy.value.pricing.free.description,
            cta: copy.value.pricing.free.cta,
            popular: false,
            features: [
                copy.value.pricing.free.extraFeature,
                ...freeFeatures
            ]
        },
        {
            name: copy.value.pricing.premium.name,
            pill: copy.value.pricing.premium.pill,
            price: copy.value.pricing.premium.price,
            priceSuffix: copy.value.pricing.premium.priceSuffix,
            note: copy.value.pricing.premium.note,
            description: copy.value.pricing.premium.description,
            cta: copy.value.pricing.premium.cta,
            popular: true,
            features: [
                copy.value.pricing.premium.includesFree,
                ...premiumFeatures
            ]
        }
    ]
})

// Username validation
function validateUsername(value) {
    if (!value || value.length === 0) {
        return { valid: false, reason: 'empty' }
    }
    if (value.length < 3) {
        return { valid: false, reason: 'tooShort' }
    }
    if (reservedPublicHandles.has(value)) {
        return { valid: false, reason: 'reserved' }
    }
    if (!/^[a-z0-9_-]+$/.test(value)) {
        return { valid: false, reason: 'invalid' }
    }
    return { valid: true }
}

function getValidationMessage(reason) {
    const map = {
        empty: null,
        tooShort: copy.value.finalCta.usernameTooShort,
        reserved: copy.value.finalCta.usernameReserved,
        invalid: copy.value.finalCta.usernameInvalid
    }
    return map[reason] ?? null
}

const handleUsernameInput = () => {
    usernameCheckMessage.value = null
    usernameStatus.value = 'idle'
    if (usernameCheckTimer) clearTimeout(usernameCheckTimer)

    const normalized = normalizePublicHandle(checkUsernameInput.value)
    if (!normalized) return

    const validation = validateUsername(normalized)
    if (!validation.valid) {
        const msg = getValidationMessage(validation.reason)
        if (msg) {
            usernameStatus.value = 'invalid'
            usernameCheckMessage.value = { type: 'error', text: msg }
        }
        return
    }

    usernameCheckTimer = setTimeout(() => {
        checkAvailability(normalized)
    }, 600)
}

async function checkAvailability(normalized) {
    isCheckingUsername.value = true
    usernameStatus.value = 'checking'
    usernameCheckMessage.value = { type: 'info', text: copy.value.finalCta.usernameChecking }

    try {
        const available = await isPublicHandleAvailable(normalized)
        if (available) {
            usernameStatus.value = 'available'
            usernameCheckMessage.value = { type: 'success', text: copy.value.finalCta.usernameAvailable }
        } else {
            usernameStatus.value = 'taken'
            usernameCheckMessage.value = { type: 'error', text: copy.value.finalCta.usernameTaken }
        }
    } catch {
        usernameStatus.value = 'taken'
        usernameCheckMessage.value = { type: 'error', text: copy.value.finalCta.usernameTaken }
    } finally {
        isCheckingUsername.value = false
    }
}

const handleSubmitUsername = async () => {
    const raw = checkUsernameInput.value
    const normalized = normalizePublicHandle(raw)
    checkUsernameInput.value = normalized

    if (!normalized) return

    const validation = validateUsername(normalized)
    if (!validation.valid) {
        const msg = getValidationMessage(validation.reason)
        if (msg) {
            usernameStatus.value = 'invalid'
            usernameCheckMessage.value = { type: 'error', text: msg }
        }
        return
    }

    if (usernameStatus.value !== 'available') {
        await checkAvailability(normalized)
        if (usernameStatus.value !== 'available') return
    }

    router.push({ path: '/register', query: { username: normalized } })
}

onMounted(() => {
    const keys = Object.keys(demoProfiles.value)
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
.landing-page {
    overflow-x: clip;
}

/* ScrollExpand Refinado: Fluidez natural estilo Apple */
.scroll-expand-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow: hidden;
}

.scroll-expand-frame {
    overflow: hidden;
    will-change: width, height, border-radius;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0);
    /* Aceleração de hardware pra evitar stuttering */
}

.scroll-expand-content-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
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

.animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 0.8s linear infinite;
}
</style>