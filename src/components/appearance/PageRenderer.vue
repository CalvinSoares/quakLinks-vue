<template>
    <div class="min-h-[80vh] max-h-[90vh] w-full relative text-white transition-all duration-500 " :style="{
        fontFamily: page.fontFamily || 'Inter',
        cursor: page.cursorUrl ? `url(${page.cursorUrl}), auto` : 'auto'
    }">
        <!-- 1. Fundo (Imagem/Cor) com Efeito de Blur -->
        <video v-if="page.backgroundType === 'video' && page.backgroundVideoUrl" :key="page.backgroundVideoUrl"
            class="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
            :style="{ filter: `blur(${page.backgroundBlur || 0}px)` }" :poster="page.backgroundUrl || ''" autoplay loop
            muted playsinline>
            <source :src="page.backgroundVideoUrl" type="video/mp4">
            Seu navegador não suporta vídeos.
        </video>

        <div v-else class="absolute inset-0 bg-cover bg-center transition-all duration-700"
            :style="pageBackgroundStyle"></div>

        <!-- 2. Overlays VFX -->
        <div v-if="page.backgroundOverlay === 'noise'"
            class="absolute inset-0 z-[1] opacity-10 pointer-events-none bg-[url('/noise.png')] animate-pulse"></div>
        <div v-if="page.backgroundOverlay === 'scanlines'"
            class="absolute inset-0 z-[1] pointer-events-none bg-[url('/scanlines.png')] bg-cover opacity-20"></div>
        <div v-if="page.backgroundOverlay === 'vignette'"
            class="absolute inset-0 z-[1] pointer-events-none bg-radial-vignette"></div>

        <!-- 3. Container do Conteúdo -->
        <div class="relative z-10 flex flex-col items-center justify-center min-h-full p-6 text-center  ">

            <!-- MODIFICADO: Container dinâmico que vira o "card" ou um container simples -->
            <div class="relative w-full max-w-md max-h-[70vh] mx-auto transition-all duration-300 rounded-2xl p-6 sm:p-8 overflow-y-auto custom-scrollbar"
                :style="profileCardStyle">
                <div
                    class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent">
                </div>
                <!-- Avatar com Glow -->
                <div class="relative group mb-4 flex justify-center">
                    <div class="p-1 rounded-full transition-all duration-300" :style="profileRingStyle"
                        :class="{ 'ring-animated': page.profileRingType === 'animated' }">
                        <img :src="finalAvatarUrl" alt="Avatar"
                            class="relative w-28 h-28 object-cover rounded-full shadow-lg" />
                    </div>
                </div>


                <h1 :class="titleClasses"
                    :style="{ color: page.textColor || '#FFFFFF', '--glow-color': page.textColor || '#FFFFFF' }"
                    :data-text="user?.name || page.slug">
                    <span v-if="page.titleEffect === 'typewriter'" class="typewriter font-mono"
                        :style="{ '--char-count': (user?.name || page.slug).length }" :key="page.slug">
                        {{ user?.name || page.slug }}
                    </span>
                    <span v-else>
                        {{ user?.name || page.slug }}
                    </span>
                </h1>

                <p v-if="page.bio" class="mt-2 text-slate-300 max-w-sm opacity-90">
                    <span>{{ page.bio }}</span>
                </p>


                <!-- Contador de Views -->
                <div class="mt-4 w-full flex flex-row items-center justify-between gap-2 text-sm text-white">
                    <div v-if="page.showViewCount"
                        class="mt-2 flex items-center justify-start gap-2 text-sm text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 icon icon-tabler icon-tabler-eye"
                            width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                            fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path d="M21 12c-2.2 4 -5.6 6 -9 6s-6.8 -2 -9 -6c2.2 -4 5.6 -6 9 -6s6.8 2 9 6" />
                        </svg>
                        <span>{{ (page.viewCount || 0).toLocaleString() }}</span>
                    </div>

                    <div v-if="page.location" class="mt-2 flex items-center justify-start gap-2 text-sm text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                        </svg>
                        <span>{{ page.location }}</span>
                    </div>
                </div>

                <div v-if="embeddableAudios.length > 0" class="w-full max-w-sm mt-8 space-y-4">
                    <div v-for="audio in embeddableAudios" :key="audio.id"
                        class="transition-all duration-300 animate-slide-up">
                        <!-- Spotify Embed -->
                        <iframe v-if="audio.type === 'SPOTIFY'" style="border-radius:12px"
                            :src="getSpotifyEmbedUrl(audio.url)" width="100%" height="152" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy">
                        </iframe>

                        <!-- SoundCloud Embed -->
                        <iframe v-else-if="audio.type === 'SOUNDCLOUD'" width="100%" height="166" scrolling="no"
                            frameborder="no" allow="autoplay" :src="getSoundCloudEmbedUrl(audio.url)">
                        </iframe>
                    </div>
                </div>

                <div v-if="page.links && page.links.length > 0" class="w-full max-w-sm mt-8 h-full px-4">

                    <!-- MODIFICADO: Container agora é dinâmico com v-if -->
                    <div v-if="page.layoutLinkStyle === 'icons_only'"
                        class="flex justify-center items-center flex-wrap gap-4 ">
                        <!-- Renderização para Apenas Ícones -->
                        <a v-for="(link, index) in page.links" :key="link.id" :href="link.url" target="_blank"
                            rel="noopener noreferrer" :data-title="link.title"
                            class="group relative transition-all duration-300 transform link-item"
                            :class="getLinkClasses(page)" :style="{ animationDelay: `${index * 100}ms` }">
                            <!-- Efeitos... -->
                            <div class="relative z-10 w-full h-full flex items-center justify-center">
                                <component :is="getIconForUrl(link.url)" class="w-7 h-7 z-10"
                                    :class="{ 'icon-glow': page.glowEffect === 'icons' || page.glowEffect === 'both' }"
                                    :style="getIconStyle(link.url, page)" />
                            </div>
                        </a>
                    </div>

                    <div v-else
                        :class="page.layoutLinkStyle === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'space-y-4'">
                        <!-- Renderização para List, Grid, Stacked -->
                        <a v-for="(link, index) in page.links" :key="link.id" :href="link.url" target="_blank"
                            rel="noopener noreferrer"
                            class="group relative transition-all duration-300 transform link-item"
                            :class="getLinkClasses(page)" :style="{ animationDelay: `${index * 100}ms` }">

                            <!-- Container de conteúdo do link -->
                            <div class="relative z-10 w-full h-full flex" :class="{
                                'items-center': page.layoutLinkStyle !== 'stacked',
                                'flex-col items-center justify-center text-center gap-2': page.layoutLinkStyle === 'stacked',
                                'flex-col justify-center': page.layoutLinkStyle === 'grid'
                            }">
                                <component :is="getIconForUrl(link.url)" class="w-7 h-7 z-10"
                                    :class="{ 'icon-glow': page.glowEffect === 'icons' || page.glowEffect === 'both' }"
                                    :style="getIconStyle(link.url, page)" />
                                <span class="z-10" :class="{
                                    'text-center text-xs font-medium': page.layoutLinkStyle === 'grid',
                                    'text-center font-semibold': page.layoutLinkStyle === 'stacked',
                                    'flex-1 text-center font-semibold tracking-wide': page.layoutLinkStyle === 'list' || !page.layoutLinkStyle
                                }" :style="{ color: page.textColor || '#FFFFFF' }">
                                    {{ link.title }}
                                </span>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { computed } from 'vue';
import {
    BrandGithubIcon, BrandTwitterIcon, BrandInstagramIcon, BrandLinkedinIcon,
    BrandYoutubeIcon, LinkIcon, BrandDiscordIcon, BrandTwitchIcon
} from 'vue-tabler-icons';
import { BrandPinterestIcon } from 'vue-tabler-icons';

const props = defineProps<{
    page: any;
}>();

const titleClasses = computed(() => {
    const classes = ['text-3xl', 'font-bold', 'tracking-tight', 'drop-shadow-lg', 'min-h-[48px]', 'transition-all', 'duration-300'];
    if (props.page.glowEffect === 'title' || props.page.glowEffect === 'both') {
        classes.push('text-glow');
    }

    // Adiciona classes para os novos efeitos de título
    if (props.page.titleEffect && props.page.titleEffect !== 'none') {
        classes.push(`effect-${props.page.titleEffect}`);
    }

    return classes;
});

const { user } = useAuthStore()

const finalAvatarUrl = computed(() => {
    if (!props.page) return '';

    if (props.page.useDiscordAvatar && props.page.user?.discordAvatarUrl) {
        return props.page.user.discordAvatarUrl;
    }

    if (props.page.avatarUrl) {
        return props.page.avatarUrl;
    }

    return `https://ui-avatars.com/api/?name=${props.page.slug || 'User'}&background=1e293b&color=fff&size=128`;
});

const getIconStyle = (url: string, page: any) => {
    const style: { color: string; '--glow-color'?: string } = {
        color: page.iconColor || '#CCCCCC'
    };

    let brandColor = '';

    if (page.useStandardIconColors) {
        if (url.includes('github.com')) brandColor = '#E5E7EB'; // Cinza claro
        if (url.includes('twitter.com') || url.includes('x.com')) brandColor = '#1DA1F2'; // Azul Twitter
        if (url.includes('instagram.com')) brandColor = '#E4405F'; // Rosa Instagram
        if (url.includes('linkedin.com')) brandColor = '#0A66C2'; // Azul LinkedIn
        if (url.includes('youtube.com')) brandColor = '#FF0000'; // Vermelho YouTube
        if (url.includes('discord.gg') || url.includes('discord.com')) brandColor = '#5865F2'; // Azul Discord
        if (url.includes('twitch.tv')) brandColor = '#9146FF'; // Roxo Twitch
        if (url.includes('pinterest.com')) brandColor = '#E82B43';

    }

    if (brandColor) {
        style.color = brandColor;
    }

    if (page.glowEffect === 'icons' || page.glowEffect === 'both') {
        style['--glow-color'] = style.color;
    }
    return style;
};

const getLinkClasses = (page: any) => {
    const style = page.linkStyle || 'classic';
    const fill = page.buttonStyle || 'solid';
    const roundness = page.buttonRoundness || 'rounded-lg';
    const shadow = page.buttonShadow || false;
    const layout = page.layoutLinkStyle || 'list';

    // Layout base
    let layoutClasses = '';
    switch (layout) {
        case 'icons_only': layoutClasses = 'w-14 h-14 flex items-center justify-center'; break;
        case 'stacked': layoutClasses = 'flex flex-col items-center justify-center p-4 text-center'; break;
        case 'grid': layoutClasses = 'flex flex-col items-center justify-center p-3 aspect-square'; break;
        default: layoutClasses = 'flex items-center w-full px-5 py-3'; break; // list
    }


    switch (style) {
        case 'minimal':
            // Removido bg-transparent para evitar conflito com a animação de opacidade
            return `
                ${layoutClasses}
                ${roundness}
                text-slate-300 group-hover:text-white
                border-b-2  group-hover:border-slate-700
            `;

        case 'brutalist':
            return `
                ${layoutClasses}
                ${roundness}
                bg-white text-black border-2 border-black font-bold
                shadow-[4px_4px_0px_#000] group-hover:shadow-none
                group-hover:translate-x-[4px] group-hover:translate-y-[4px]
            `;

        case 'spotlight':
            // Removido opacity-70. Isso agora é controlado por um div interno.
            return `
                ${layoutClasses}
                ${roundness}
                bg-transparent group-hover:-translate-y-1
            `;

        default: // 'classic'
            let fillClasses = '';
            switch (fill) {
                case 'outline': fillClasses = 'border-2 border-white/30 hover:bg-white/10 bg-transparent'; break;
                case 'soft': fillClasses = 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'; break;
                case 'glass': fillClasses = 'bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10'; break;
                default: fillClasses = 'bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/50'; break;
            }
            return `
                ${layoutClasses}
                ${fillClasses}
                ${roundness}
                ${shadow ? 'shadow-lg' : ''}
                group-hover:-translate-y-1
            `;
    }
};


const getIconForUrl = (url: string | null | undefined) => {
    console.log("url", url)
    if (!url) return LinkIcon;
    if (url.includes('github.com')) return BrandGithubIcon;
    if (url.includes('twitter.com') || url.includes('x.com')) return BrandTwitterIcon;
    if (url.includes('instagram.com')) return BrandInstagramIcon;
    if (url.includes('linkedin.com')) return BrandLinkedinIcon;
    if (url.includes('youtube.com')) return BrandYoutubeIcon;
    if (url.includes('discord.gg') || url.includes('discord.com')) return BrandDiscordIcon;
    if (url.includes('pinterest.com')) return BrandPinterestIcon;
    if (url.includes('twitch.tv')) return BrandTwitchIcon;
    return LinkIcon;
};

const embeddableAudios = computed(() => {
    if (!props.page || !props.page.audios) {
        return [];
    }
    return props.page.audios.filter((audio: any) => audio.type === 'SPOTIFY' || audio.type === 'SOUNDCLOUD');
});

function getSpotifyEmbedUrl(url: string): string {
    if (!url.includes('open.spotify.com')) return '';
    try {
        const path = new URL(url).pathname;
        return `https://open.spotify.com/embed${path}`;
    } catch (e) {
        return '';
    }
}

function getSoundCloudEmbedUrl(url: string): string {
    if (!url.includes('soundcloud.com')) return '';
    const encodedUrl = encodeURIComponent(url);
    // Adicionamos `visual=true` para um player mais moderno, como o da imagem de exemplo
    return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}

const pageBackgroundStyle = computed(() => {
    const style: Record<string, any> = {
        filter: `blur(${props.page.backgroundBlur || 0}px)`,
        transform: `scale(${1 + (props.page.backgroundBlur || 0) / 100})`
    };

    switch (props.page.backgroundType) {
        case 'image':
            style.backgroundImage = `url(${props.page.backgroundUrl})`;
            style.backgroundColor = props.page.backgroundColor || '#111827'; // Fallback
            break;
        case 'gradient':
            style.backgroundImage = `linear-gradient(${props.page.gradientDirection || 'to bottom'}, ${props.page.gradientColorA || '#1E3A8A'}, ${props.page.gradientColorB || '#4C1D95'})`;
            break;
        case 'solid':
        default:
            style.backgroundColor = props.page.backgroundColor || '#111827';
            break;
    }
    return style;
});

const profileRingStyle = computed(() => {
    const type = props.page.profileRingType || 'none';
    const colors = props.page.profileRingColors || [];
    const padding = '3px';

    if (type === 'none' || colors.length === 0) {
        return { background: 'transparent', padding };
    }

    if (type === 'solid' || colors.length === 1) {
        return { background: colors[0], padding };
    }


    const gradientColors = [...colors, colors[0]].join(', ');

    if (type === 'gradient') {
        return {
            background: `linear-gradient(45deg, ${gradientColors})`,
            padding
        };
    }

    if (type === 'animated') {
        return {
            '--ring-gradient': `conic-gradient(from var(--angle, 0deg), ${gradientColors})`,
            padding
        };
    }

    return {};
});

const profileCardStyle = computed(() => {
    const pageData = props.page;

    if (!pageData.showProfileCard) {
        return { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' };
    }

    const baseColorRgb = '107, 114, 128';
    const opacity = pageData.profileCardOpacity ?? 0.2;

    return {
        backgroundColor: `rgba(${baseColorRgb}, ${opacity})`,
        backdropFilter: `blur(16px)`,
        '-webkit-backdrop-filter': `blur(16px)`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    };
});

</script>

<style scoped>
/* Adicione estas animações e helpers aqui para manter o componente auto-contido */
.bg-radial-vignette {
    background: radial-gradient(circle, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
}

.typewriter {
    display: inline-block;
    /* Mantém inline-block para que a animação de largura funcione */
    border-right: .15em solid #a78bfa;
    white-space: nowrap;
    overflow: hidden;
    /* Chave para a centralização: anima o max-width em vez do width */
    max-width: 0;
    animation:
        typing 3.5s steps(var(--char-count, 40)) forwards,
        blink-caret .75s step-end infinite;
}

@keyframes typing {
    from {
        max-width: 0
    }

    to {
        max-width: 100%
    }

    /* Anima para 100% do tamanho do texto */
}

/* A animação 'blink-caret' pode permanecer a mesma */
@keyframes blink-caret {

    from,
    to {
        border-color: transparent
    }

    50% {
        border-color: #a78bfa;
    }
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

@property --angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}

@keyframes smooth-spin {
    to {
        --angle: 360deg;
    }
}

.ring-animated {
    background: var(--ring-gradient);
    animation: smooth-spin 4s linear infinite;
}

/* Animação de entrada para os links */
a {
    opacity: 0;
    animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slide-up {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.text-glow {
    /* Múltiplas sombras para um brilho mais suave */
    text-shadow:
        0 0 5px var(--glow-color, #fff),
        0 0 10px var(--glow-color, #fff),
        0 0 15px var(--glow-color, #fff),
        0 0 20px rgba(255, 255, 255, 0.5);
    /* Sombra branca difusa */
    transition: text-shadow 0.3s ease-in-out;
}

.icon-glow {
    /* Usa filter: drop-shadow para aplicar brilho ao contorno do ícone SVG */
    filter:
        drop-shadow(0 0 3px var(--glow-color, #fff)) drop-shadow(0 0 6px var(--glow-color, #fff));
    transition: filter 0.3s ease-in-out;
}

.effect-rainbow {
    background-image: linear-gradient(45deg, #f3ec78, #af4261, #5433ff, #20bdff, #a5FECb);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbow-animation 5s ease-in-out infinite alternate;
}

@keyframes rainbow-animation {
    to {
        background-position: 200% center;
    }
}

.effect-neon {
    color: #fff;
    /* A cor base do neon */
    text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px v-bind('props.page.textColor || "#ff00de"'),
        0 0 30px v-bind('props.page.textColor || "#ff00de"'),
        0 0 40px v-bind('props.page.textColor || "#ff00de"');
    animation: neon-flicker 1.5s infinite alternate;
}

@keyframes neon-flicker {

    0%,
    18%,
    22%,
    25%,
    53%,
    57%,
    100% {
        text-shadow: inherit;
    }

    20%,
    24%,
    55% {
        text-shadow: none;
    }
}

.effect-outline {
    color: transparent !important;
    /* Força a transparência para o contorno aparecer */
    -webkit-text-stroke: 1.5px v-bind('props.page.textColor || "#FFFFFF"');
    text-shadow: none !important;
    /* Remove outros brilhos que possam interferir */
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
    /* Herda o fundo para não cobrir o que está atrás */
    overflow: hidden;
}

.effect-glitch::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
    clip-path: rect(44px, 450px, 56px, 0);
    animation: glitch-anim-1 3s infinite linear alternate-reverse;
}

.effect-glitch::after {
    left: -2px;
    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
    clip-path: rect(80px, 450px, 90px, 0);
    animation: glitch-anim-2 4s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
    0% {
        clip-path: inset(5% 0 90% 0);
    }

    100% {
        clip-path: inset(60% 0 15% 0);
    }
}

@keyframes glitch-anim-2 {
    0% {
        clip-path: inset(80% 0 5% 0);
    }

    100% {
        clip-path: inset(40% 0 33% 0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #334155;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #475569;
}
</style>