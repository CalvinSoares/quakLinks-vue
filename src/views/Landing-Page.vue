<template>
    <div
        class="landing-page min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-400 selection:text-slate-900 font-sans">

        <header :class="[
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
            isScrolled ? 'pt-4 px-4' : 'pt-0 px-0'
        ]">
            <nav :class="[
                'mx-auto transition-all duration-500 ease-in-out w-full',
                isScrolled ? 'max-w-5xl' : 'max-w-full'
            ]">
                <div class="relative group">
                    <!-- Efeito de brilho externo (apenas quando scrollado para destacar a cápsula) -->
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
                        <!-- LOGO -->
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

                        <!-- NAV ITEMS (Centralizados ou condicionados) -->
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

                        <!-- ACTIONS -->
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

        <ExploreStickySection />

        <PricingSection :copy="copy" :pricing-cards="pricingCards" />

        <FaqSection />

        <section class="py-32 px-4 relative overflow-hidden bg-[#0a0a0a]">
            <div class="container mx-auto max-w-4xl relative z-10">
                <div v-observe
                    class="scroll-scale-hidden relative rounded-[3rem] p-12 overflow-hidden text-center border border-amber-500/30 bg-slate-900/80 backdrop-blur-xl">
                    <div
                        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50">
                    </div>

                    <h2 class="text-4xl md:text-6xl font-black mb-6">{{ copy.finalCta.titleStart }} <span
                            class="text-amber-400">{{ copy.finalCta.titleHighlight }}</span></h2>
                    <p class="text-xl text-slate-400 mb-10">{{ copy.finalCta.description }}</p>

                    <a href="/register"
                        class="inline-block px-10 py-5 bg-amber-400 text-slate-900 text-lg font-bold rounded-2xl hover:bg-amber-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300">
                        {{ copy.finalCta.button }}
                    </a>
                </div>
            </div>
        </section>



        <FooterSection />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LanguageMenuButton from '@/components/LanguageMenuButton.vue'
import { useAppLanguage } from '@/composables/useAppLanguage'
import { planFeatures } from '@/constants/plans'
import {
    Sparkles, ArrowRight, Play, Check,
    Link, Palette, BarChart3, Music,
    Zap, Shield, Crown, Terminal, Gamepad2, Brush
} from 'lucide-vue-next'
import FooterSection from '@/components/landingpage/FooterSection.vue'
import FaqSection from '@/components/landingpage/FaqSection.vue'
import ExploreStickySection from '@/components/landingpage/ExploreStickySection.vue'
import FeaturesCarousel from '@/components/landingpage/FeaturesCarousel.vue'
import PricingSection from '@/components/landingpage/PricingSection.vue'
import HeroSection from '@/components/landingpage/HeroSection.vue'

const isScrolled = ref(false)

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    handleScroll()
    document.documentElement.classList.add('landing-snap-scroll')
    document.body.classList.add('landing-snap-scroll')
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.documentElement.classList.remove('landing-snap-scroll')
    document.body.classList.remove('landing-snap-scroll')
})

const { locale } = useAppLanguage()

const translations = {
    pt: {
        auth: { login: 'Entrar', createBio: 'Criar Bio' },
        hero: {
            badge: 'Nova geração de biolinks',
            titleStart: 'Seu perfil,',
            titleHighlight: 'outra dimensão.',
            description: 'A plataforma definitiva para centralizar sua identidade digital. Estetica cyberpunk, analises em tempo real e liberdade total.',
            primaryCta: 'Começar agora',
            secondaryCta: 'Ver demo',
            joinPrefix: 'Junte-se a',
            joinSuffix: 'criadores',
        },
        mockups: {
            subscribe: 'Inscreva-se',
            discordServer: 'Servidor Discord',
            spotifyPlaylist: 'Playlist Spotify',
        },
        explore: {
            titleStart: 'Explore',
            titleHighlight: 'possibilidades',
            description: 'Nossa engine de renderização permite qualquer estilo. Do minimalismo corporativo ao caos do cybercore.',
        },
        features: {
            titleStart: '',
            titleHighlight: 'Recursos',
            description: 'Tudo o que você precisa para dominar sua presença digital.',
        },
        pricing: {
            title: 'Planos',
            description: 'Do Free ao Premium, com os recursos reais do sistema e upgrade sem fricção.',
            recommended: 'Recomendado',
            perMonth: '/mês',
            compareLabel: 'Planos reais',
            helper: 'Os recursos abaixo refletem o que o QuakLinks libera hoje para Free e Premium.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar e imagem de fundo',
                'Gradientes e estilos visuais': 'Gradientes e estilos visuais',
                'Vídeo no background': 'Vídeo no background',
                'Cursor personalizado': 'Cursor personalizado',
                'Playlist e player de áudio': 'Playlist e player de áudio',
                'Agendamento de links': 'Agendamento de links',
                'Domínio personalizado': 'Domínio personalizado',
                'Efeito Máquina de Escrever': 'Efeito Máquina de Escrever',
                'Templates e assets premium': 'Templates e assets premium',
            },
            free: {
                name: 'Free',
                pill: 'Base essencial',
                price: 'R$ 0',
                priceSuffix: '/sem custo',
                note: 'Tudo o que você precisa para começar.',
                description: 'Publique seus links essenciais, monte a base visual da página e comece a personalizar sem pagar nada.',
                cta: 'Criar conta grátis',
                extraFeature: 'Publicação dos links essenciais',
            },
            premium: {
                name: 'Premium',
                pill: 'Recursos avançados',
                price: 'Upgrade',
                priceSuffix: 'via checkout',
                note: 'Desbloqueie os recursos premium de verdade do sistema.',
                description: 'Libera mídia, cursor, agendamento, domínio personalizado e extras profissionais para uma página muito mais rica.',
                cta: 'Criar conta e ver Premium',
                includesFree: 'Tudo do Free, mais',
            },
        },
        finalCta: {
            titleStart: 'Pronto para o',
            titleHighlight: 'show?',
            description: 'Junte-se a 50,000+ criadores que usam QuackLinks.',
            button: 'Criar conta grátis',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Estilo agressivo, cores neon, efeitos glitch.', bio: 'FPS Pro Player | Live todos os dias às 18h' },
            artist: { label: 'Artista Digital', desc: 'Efeito de vidro, gradientes suaves, elegante.', bio: 'Designer visual e artista 3D. Encomendas abertas.' },
            dev: { label: 'Desenvolvedor', desc: 'Minimalista, fonte mono, foco em conteudo.', bio: 'Desenvolvedor full stack criando coisas legais.' },
        },
        featuresList: [
            { title: 'Instantâneo', description: 'Carregamento ultra-rápido para não perder nenhum clique.' },
            { title: 'Customizável', description: 'Controle total sobre cores, fontes e animações.' },
            { title: 'Analises', description: 'Saiba exatamente quem esta clicando e de onde vem.' },
            { title: 'Midia Incorporada', description: 'Spotify, YouTube e Twitch direto na sua pagina.' },
            { title: 'Seguro', description: 'Proteção DDoS e SSL gratuito para todos os links.' },
            { title: 'Domínio Próprio', description: 'Use seu próprio domínio .com ou .br.' },
        ],
        plans: [
            { name: 'Inicial', price: 'R$ 0', features: ['1 Pagina', 'Links Ilimitados', 'Temas Basicos'], cta: 'Criar Gratis', popular: false },
            { name: 'Pro', price: 'R$ 29', features: ['3 Paginas', 'Remover Marca', 'Analises Pro', 'Temas Premium'], cta: 'Assinar Pro', popular: true },
            { name: 'Agencia', price: 'R$ 99', features: ['10 Paginas', 'Acesso a API', 'Suporte Prioritario'], cta: 'Contatar', popular: false },
        ],
    },
    en: {
        auth: { login: 'Login', createBio: 'Create Bio' },
        hero: {
            badge: 'Next generation biolinks',
            titleStart: 'Your profile,',
            titleHighlight: 'another dimension.',
            description: 'The definitive platform to centralize your digital identity. Cyberpunk aesthetics, real-time analytics, and total freedom.',
            primaryCta: 'Start now',
            secondaryCta: 'View demo',
            joinPrefix: 'Join',
            joinSuffix: 'creators',
        },
        mockups: {
            subscribe: 'Subscribe',
            discordServer: 'Discord Server',
            spotifyPlaylist: 'Spotify Playlist',
        },
        explore: {
            titleStart: 'Explore',
            titleHighlight: 'possibilities',
            description: 'Our rendering engine supports any style. From corporate minimalism to cybercore chaos.',
        },
        features: {
            titleStart: 'Crazy',
            titleHighlight: 'features',
            description: 'Everything you need to dominate your digital presence.',
        },
        pricing: {
            title: 'Pricing',
            description: 'From Free to Premium, with the real system features and a clear upgrade path.',
            recommended: 'Recommended',
            perMonth: '/month',
            compareLabel: 'Real plans',
            helper: 'The features below reflect what QuakLinks actually unlocks today for Free and Premium.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar and background image',
                'Gradientes e estilos visuais': 'Gradients and visual styles',
                'Vídeo no background': 'Background video',
                'Cursor personalizado': 'Custom cursor',
                'Playlist e player de áudio': 'Playlist and audio player',
                'Agendamento de links': 'Link scheduling',
                'Domínio personalizado': 'Custom domain',
                'Efeito Máquina de Escrever': 'Typewriter effect',
                'Templates e assets premium': 'Premium templates and assets',
            },
            free: {
                name: 'Free',
                pill: 'Core essentials',
                price: '$0',
                priceSuffix: '/no cost',
                note: 'Everything you need to start.',
                description: 'Publish your essential links, build the visual foundation of your page, and start customizing without paying anything.',
                cta: 'Create free account',
                extraFeature: 'Publish essential links',
            },
            premium: {
                name: 'Premium',
                pill: 'Advanced features',
                price: 'Upgrade',
                priceSuffix: 'via checkout',
                note: 'Unlock the premium features that really exist in the product.',
                description: 'Get media, custom cursor, scheduling, custom domain, and professional extras for a much richer page.',
                cta: 'Create account and view Premium',
                includesFree: 'Everything in Free, plus',
            },
        },
        finalCta: {
            titleStart: 'Ready for the',
            titleHighlight: 'show?',
            description: 'Join 50,000+ creators using QuackLinks.',
            button: 'Create free account',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Aggressive style, neon colors, glitch effects.', bio: 'FPS Pro Player | Live every day at 6 PM' },
            artist: { label: 'Digital Artist', desc: 'Glassmorphism, soft gradients, elegant.', bio: 'Visual Designer & 3D Artist. Commissions Open.' },
            dev: { label: 'Developer', desc: 'Minimalist, mono font, content first.', bio: 'Fullstack Dev building cool stuff.' },
        },
        featuresList: [
            { title: 'Instant', description: 'Ultra-fast loading so you do not lose a single click.' },
            { title: 'Customizable', description: 'Full control over colors, fonts, and animations.' },
            { title: 'Analytics', description: 'See exactly who is clicking and where they come from.' },
            { title: 'Media Embed', description: 'Spotify, YouTube, Twitch directly on your page.' },
            { title: 'Secure', description: 'DDoS protection and free SSL for every link.' },
            { title: 'Custom Domain', description: 'Use your own .com or local domain.' },
        ],
        plans: [
            { name: 'Starter', price: '$0', features: ['1 Page', 'Unlimited Links', 'Basic Themes'], cta: 'Start Free', popular: false },
            { name: 'Pro', price: '$29', features: ['3 Pages', 'Remove Branding', 'Pro Analytics', 'Premium Themes'], cta: 'Subscribe Pro', popular: true },
            { name: 'Agency', price: '$99', features: ['10 Pages', 'API Access', 'Priority Support'], cta: 'Contact Sales', popular: false },
        ],
    },
    es: {
        auth: { login: 'Entrar', createBio: 'Crear Bio' },
        hero: {
            badge: 'Nueva generación de biolinks',
            titleStart: 'Tu perfil,',
            titleHighlight: 'otra dimensión.',
            description: 'La plataforma definitiva para centralizar tu identidad digital. Estetica cyberpunk, analiticas en tiempo real y libertad total.',
            primaryCta: 'Empezar ahora',
            secondaryCta: 'Ver demo',
            joinPrefix: 'Únete a',
            joinSuffix: 'creadores',
        },
        mockups: {
            subscribe: 'Suscríbete',
            discordServer: 'Servidor Discord',
            spotifyPlaylist: 'Playlist Spotify',
        },
        explore: {
            titleStart: 'Explora',
            titleHighlight: 'posibilidades',
            description: 'Nuestra engine de render permite cualquier estilo. Del minimalismo corporativo al caos cybercore.',
        },
        features: {
            titleStart: 'Funciones',
            titleHighlight: 'brutales',
            description: 'Todo lo que necesitas para dominar tu presencia digital.',
        },
        pricing: {
            title: 'Planes',
            description: 'De Free a Premium, con las funciones reales del sistema y un upgrade claro.',
            recommended: 'Recomendado',
            perMonth: '/mes',
            compareLabel: 'Planes reales',
            helper: 'Las funciones de abajo reflejan lo que QuakLinks desbloquea hoy en Free y Premium.',
            featureLabels: {
                'Avatar e imagem de fundo': 'Avatar e imagen de fondo',
                'Gradientes e estilos visuais': 'Gradientes y estilos visuales',
                'Vídeo no background': 'Video de fondo',
                'Cursor personalizado': 'Cursor personalizado',
                'Playlist e player de áudio': 'Playlist y reproductor de audio',
                'Agendamento de links': 'Programación de links',
                'Domínio personalizado': 'Dominio personalizado',
                'Efeito Máquina de Escrever': 'Efecto máquina de escribir',
                'Templates e assets premium': 'Plantillas y assets premium',
            },
            free: {
                name: 'Free',
                pill: 'Base esencial',
                price: 'R$ 0',
                priceSuffix: '/sin costo',
                note: 'Todo lo que necesitas para empezar.',
                description: 'Publica tus links esenciales, arma la base visual de tu página y empieza a personalizar sin pagar nada.',
                cta: 'Crear cuenta gratis',
                extraFeature: 'Publicación de links esenciales',
            },
            premium: {
                name: 'Premium',
                pill: 'Funciones avanzadas',
                price: 'Upgrade',
                priceSuffix: 'vía checkout',
                note: 'Desbloquea las funciones premium reales del sistema.',
                description: 'Libera media, cursor personalizado, programación, dominio propio y extras profesionales para una página mucho más completa.',
                cta: 'Crear cuenta y ver Premium',
                includesFree: 'Todo lo de Free, más',
            },
        },
        finalCta: {
            titleStart: '¿Listo para el',
            titleHighlight: 'show?',
            description: 'Unete a 50,000+ creadores que usan QuackLinks.',
            button: 'Crear cuenta gratis',
        },
        demoProfiles: {
            gamer: { label: 'Pro Gamer', desc: 'Estilo agresivo, colores neon, efectos glitch.', bio: 'FPS Pro Player | Live todos los días a las 18h' },
            artist: { label: 'Artista Digital', desc: 'Efecto de cristal, gradientes suaves, elegante.', bio: 'Disenadora visual y artista 3D. Encargos abiertos.' },
            dev: { label: 'Desarrollador', desc: 'Minimalista, fuente mono, foco en contenido.', bio: 'Desarrollador full stack creando cosas geniales.' },
        },
        featuresList: [
            { title: 'Instantáneo', description: 'Carga ultrarrápida para no perder ni un clic.' },
            { title: 'Personalizable', description: 'Control total sobre colores, fuentes y animaciones.' },
            { title: 'Analiticas', description: 'Sabe exactamente quien hace clic y de donde viene.' },
            { title: 'Media Integrada', description: 'Spotify, YouTube y Twitch directo en tu pagina.' },
            { title: 'Seguro', description: 'Protección DDoS y SSL gratis para todos los links.' },
            { title: 'Dominio Propio', description: 'Usa tu propio dominio .com o local.' },
        ],
        plans: [
            { name: 'Inicial', price: 'R$ 0', features: ['1 Pagina', 'Links ilimitados', 'Temas basicos'], cta: 'Crear Gratis', popular: false },
            { name: 'Pro', price: 'R$ 29', features: ['3 Paginas', 'Quitar marca', 'Analiticas Pro', 'Temas premium'], cta: 'Suscribirse Pro', popular: true },
            { name: 'Agencia', price: 'R$ 99', features: ['10 Paginas', 'Acceso API', 'Soporte prioritario'], cta: 'Contactar', popular: false },
        ],
    },
}

const copy = computed(() => translations[locale.value])

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

const currentDemo = computed(() => demoProfiles.value[activeProfileKey.value])

const getBackgroundStyle = (profile) => ({
    background: profile.background,
})

const getRingStyle = (profile) => {
    if (profile.buttonStyle === 'brutalist') return { border: '2px solid #ff0055', boxShadow: '0 0 15px #ff0055' }
    if (profile.buttonStyle === 'glass') return { background: 'linear-gradient(45deg, #a78bfa, #f472b6)' }
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

const navItems = computed(() => [
    { name: locale.value === 'pt' ? 'Vitrine' : locale.value === 'es' ? 'Vitrina' : 'Showcase', href: '#explore' },
    // { name: copy.value.features.titleStart, href: '#features' },
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
    const freeFeatures = [
        copy.value.pricing.free.extraFeature,
        ...planFeatures
            .filter((feature) => Boolean(feature.free))
            .map((feature) => localizePricingFeature(feature.label)),
    ]

    const premiumFeatures = [
        copy.value.pricing.premium.includesFree,
        ...planFeatures
            .filter((feature) => !feature.free && Boolean(feature.premium))
            .map((feature) => localizePricingFeature(feature.label)),
    ]

    return [
        {
            id: 'free',
            highlight: false,
            href: '/register',
            features: freeFeatures,
            ...copy.value.pricing.free,
        },
        {
            id: 'premium',
            highlight: true,
            href: '/register',
            features: premiumFeatures,
            ...copy.value.pricing.premium,
        },
    ]
})

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
:global(html.landing-snap-scroll),
:global(body.landing-snap-scroll) {
    scroll-snap-type: y proximity;
    scroll-behavior: smooth;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 0px;
}

.landing-page {
    overflow-x: clip;
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
