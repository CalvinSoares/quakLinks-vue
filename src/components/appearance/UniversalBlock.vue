<template>
    <div class="transition-all duration-300 h-full" :class="rootWidthClass">

        <a v-if="block.type === 'LINK'" :href="block.content.url" target="_blank" rel="noopener noreferrer"
            class="group relative transition-all duration-300 transform link-item overflow-hidden"
            :class="linkComputedClasses" :style="linkDynamicStyles"> <!-- Style binding dinâmico -->

            <div v-if="page.linkStyle === 'spotlight'"
                class="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none">
            </div>

            <div class="relative z-10 w-full h-full flex" :class="{
                'items-center px-4 gap-3': !isStacked && !isGrid && !isIconsOnly,
                'flex-col items-center justify-center text-center gap-2 p-3': isStacked,
                'flex-col justify-center items-center p-3 text-center': isGrid,
                'items-center justify-center ': isIconsOnly
            }">

                <component :is="iconComponent" class="z-10 shrink-0 transition-transform group-hover:scale-110" :class="[
                    isGrid ? 'w-8 h-8 mb-1' : (isIconsOnly ? 'w-6 h-6' : 'w-5 h-5'),
                    { 'icon-glow': page.glowEffect === 'icons' || page.glowEffect === 'both' }
                ]" :style="iconStyle" />

                <span v-if="!isIconsOnly" class="z-10 truncate w-full" :class="{
                    'text-xs font-semibold': isGrid,
                    'font-semibold text-sm': isStacked,
                    'flex-1 text-center text-sm font-semibold tracking-wide': !isGrid && !isStacked,
                    'font-pixel': page.linkStyle === 'pixel' // Fonte Pixelada
                }" :style="{ color: page.textColor || '#FFFFFF' }">
                    {{ block.content.title }}
                </span>
            </div>
        </a>

        <div v-else-if="block.type === 'HEADER'" class="text-center w-full px-2 py-2 ">
            <h2 class="text-xl font-bold  break-words" :style="{ color: page.textColor || '#FFFFFF' }">
                {{ block.content.text }}
            </h2>
        </div>

        <div v-else-if="block.type === 'TEXT'" class="text-center w-full px-2">
            <p class="text-sm opacity-90 whitespace-pre-wrap leading-relaxed break-words"
                :style="{ color: page.textColor || '#FFFFFF' }">
                {{ block.content.text }}
            </p>
        </div>

        <div v-else-if="block.type === 'DIVIDER'" class="w-full flex justify-center py-4 opacity-50">
            <div class="w-2/3 h-px rounded-full" :style="{ backgroundColor: page.textColor || '#FFFFFF' }"></div>
        </div>

        <div v-else-if="block.type === 'VIDEO'"
            class="w-full rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black">
            <iframe v-if="isYoutube(block.content.url)" class="w-full aspect-video"
                :src="getYoutubeEmbed(block.content.url)" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
            <video v-else :src="block.content.url" controls class="w-full aspect-video bg-black"></video>
        </div>

        <div v-else-if="block.type === 'YOUTUBE_SUBSCRIBE'" class="w-full flex justify-center py-2">
            <div class="bg-white/5 p-3 rounded-xl border border-white/10 overflow-hidden">
                <iframe v-if="block.content.channelId"
                    :src="`https://www.youtube.com/subscribe_embed?channelid=${block.content.channelId}&layout=full&theme=dark`"
                    width="200" height="50" frameborder="0" scrolling="no" style="border:none; overflow:hidden;">
                </iframe>
                <div v-else class="text-xs text-red-400">ID do canal ausente</div>
            </div>
        </div>

        <div v-else-if="block.type === 'PINTEREST'" class="w-full flex justify-center">
            <iframe v-if="getPinterestId(block.content.url)"
                :src="`https://assets.pinterest.com/ext/embed.html?id=${getPinterestId(block.content.url)}`"
                height="400" width="236" frameborder="0" scrolling="no"
                class="rounded-xl shadow-lg border border-white/10"></iframe>
            <div v-else class="text-xs text-red-400 py-2">URL inválida</div>
        </div>

        <div v-else-if="block.type === 'COUNTDOWN'" class="w-full">
            <div
                class="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 text-center shadow-xl relative overflow-hidden group">

                <div
                    class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 blur-sm">
                </div>

                <h3 class="text-lg font-bold text-white mb-4 tracking-tight break-words">{{ block.content.title }}</h3>

                <div v-if="isExpired && block.content.endBehavior === 'message'" class="py-6 animate-fade-in">
                    <p class="text-xl font-bold text-red-400 break-words">{{ block.content.endMessage || 'Evento' +
                        'Encerrado' }}</p>
                </div>

                <div v-else class="grid grid-cols-4 gap-2 mb-5">
                    <div v-for="(val, label) in timeLeft" :key="label"
                        class="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center border border-slate-700">
                        <span class="text-xl sm:text-2xl font-mono font-bold text-indigo-400">{{ pad(val) }}</span>
                        <span class="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{{ label }}</span>
                    </div>
                </div>

                <p v-if="block.content.description"
                    class="text-sm text-slate-400 mb-5 leading-relaxed px-2 break-words">
                    {{ block.content.description }}
                </p>

                <div class="flex flex-col w-full gap-3 justify-center items-center">

                    <a v-if="block.content.buttonText && block.content.url" :href="block.content.url" target="_blank"
                        class="w-full  px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                        {{ block.content.buttonText }}
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <a v-if="block.content.reminders && !isExpired" :href="googleCalendarLink" target="_blank"
                        class="w-full  px-4 py-2.5 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                        <svg class="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Lembrar-me
                    </a>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
    BrandGithubIcon, BrandTwitterIcon, BrandInstagramIcon, BrandLinkedinIcon,
    BrandYoutubeIcon, LinkIcon, BrandDiscordIcon, BrandTwitchIcon, BrandSpotifyIcon,
    BrandSoundcloudIcon, BrandPinterestIcon
} from 'vue-tabler-icons';

const props = defineProps<{
    block: any;
    page: any;
}>();

const layout = computed(() => props.page.layoutLinkStyle || 'list');
const isGrid = computed(() => layout.value === 'grid');
const isStacked = computed(() => layout.value === 'stacked');
const isIconsOnly = computed(() => layout.value === 'icons_only');
const timeLeft = ref({ Dias: 0, Hrs: 0, Min: 0, Seg: 0 });
const isExpired = ref(false);
let timerInterval: any = null;

function pad(n: number) {
    return n < 10 ? `0${n}` : n;
}

function updateTimer() {
    if (props.block.type !== 'COUNTDOWN' || !props.block.content.date) return;

    const now = new Date().getTime();
    const target = new Date(props.block.content.date).getTime();
    const distance = target - now;

    if (distance < 0) {
        isExpired.value = true;
        timeLeft.value = { Dias: 0, Hrs: 0, Min: 0, Seg: 0 };
        clearInterval(timerInterval);
        return;
    }

    isExpired.value = false;
    timeLeft.value = {
        Dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        Hrs: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        Min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        Seg: Math.floor((distance % (1000 * 60)) / 1000)
    };
}

const googleCalendarLink = computed(() => {
    if (props.block.type !== 'COUNTDOWN') return '#';
    const c = props.block.content;
    const start = new Date(c.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(c.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const details = encodeURIComponent(c.description || '');
    const title = encodeURIComponent(c.title || 'Evento');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&sf=true&output=xml`;
});

watch(() => props.block.content.date, () => {
    updateTimer();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
});

onMounted(() => {
    if (props.block.type === 'COUNTDOWN') {
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});


const iconComponent = computed(() => getIconForUrl(props.block.content.url));

const linkComputedClasses = computed(() => {
    const style = props.page.linkStyle || 'classic';
    const fill = props.page.buttonStyle || 'solid';
    const roundness = props.page.buttonRoundness || 'rounded-lg';
    const shadow = props.page.buttonShadow || false;

    let layoutClasses = '';
    switch (layout.value) {
        case 'icons_only': layoutClasses = 'w-14 h-14 flex items-center justify-center'; break;
        case 'stacked': layoutClasses = 'flex flex-col items-center justify-center w-full'; break;
        case 'grid': layoutClasses = 'flex flex-col items-center justify-center w-full aspect-square'; break;
        default: layoutClasses = 'flex items-center w-full min-h-[50px]'; break;
    }

    let specificClasses = '';

    switch (style) {
        case 'minimal':
            // Minimal ignora cor de fundo e usa bordas
            specificClasses = `bg-transparent hover:bg-white/5 border-b border-white/20 hover:border-white/50`;
            break;

        case 'brutalist':
            // Removemos bg-gray-300 para usar a cor dinâmica. Adicionamos borda grossa e sombra dura.
            specificClasses = `border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`;
            break;

        case 'spotlight':
            // Spotlight: Fundo suave, brilho ao passar o mouse (via elemento interno e overflow-hidden)
            specificClasses = `border border-white/10 hover:border-white/30 backdrop-blur-sm relative overflow-hidden`;
            break;

        case 'pixel':
            // Pixel: Sem arredondamento, borda dupla simulada ou borda grossa, fonte pixel
            specificClasses = `font-pixel border-2 border-white/20 hover:border-white/60 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none rounded-none`;
            break;

        case 'torn':
            // Torn: Papel rasgado. Usamos clip-path (definido no style dinâmico ou classe auxiliar se tiver CSS global)
            // Adicionamos um filtro de papel se possível, aqui focamos na estrutura
            specificClasses = `hover:-translate-y-1 shadow-lg torn-edge`;
            break;

        default: // classic
            let fillClasses = '';
            // Se for outline, o background dinâmico é ignorado ou aplicado com opacidade baixa
            if (fill === 'outline') {
                fillClasses = 'border border-current hover:bg-white/10 bg-transparent';
            } else if (fill === 'glass') {
                fillClasses = 'border border-white/10 backdrop-blur-md hover:bg-white/20';
            } else {
                // Solid e Soft usam a cor dinâmica
                fillClasses = 'hover:brightness-110 border border-transparent';
            }
            specificClasses = `${fillClasses} ${shadow ? 'shadow-md' : ''} group-hover:-translate-y-0.5`;
            break;
    }

    // Se o estilo for pixel ou torn, ignoramos o roundness do usuário
    const appliedRoundness = (style === 'pixel' || style === 'torn') ? 'rounded-none' : roundness;

    return `${layoutClasses} ${appliedRoundness} ${specificClasses}`;
});

const linkDynamicStyles = computed(() => {
    const style = props.page.linkStyle || 'classic';
    const userColor = props.page.buttonColor;
    const defaultColor = style === 'brutalist' ? '#d1d5db' : '#1e293b99';

    const bgColor = userColor || defaultColor;

    const styles: any = {};

    if (style === 'minimal') {

        styles.color = props.page.textColor || '#fff';
    }
    else if (style === 'torn') {
        styles.backgroundColor = bgColor;

        styles.clipPath = 'polygon(0% 0%, 100% 0%, 100% 90%, 95% 100%, 90% 90%, 85% 100%, 80% 90%, 75% 100%, 70% 90%, 65% 100%, 60% 90%, 55% 100%, 50% 90%, 45% 100%, 40% 90%, 35% 100%, 30% 90%, 25% 100%, 20% 90%, 15% 100%, 10% 90%, 5% 100%, 0% 90%)';
    }
    else {

        if (props.page.buttonStyle !== 'outline') {
            styles.backgroundColor = bgColor;
        } else {
            styles.borderColor = bgColor;
            styles.color = bgColor;
        }
    }

    return styles;
});

function isYoutube(url: string) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getYoutubeEmbed(url: string) {
    if (!url) return '';
    let videoId = '';

    if (url.includes('youtu.be')) {
        videoId = url.split('/').pop() || '';
    } else if (url.includes('v=')) {
        const parts = url.split('v=');
        const partAfterV = parts[1];

        if (partAfterV) {
            videoId = partAfterV.split('&')[0] || '';
        }
    }

    return `https://www.youtube.com/embed/${videoId}`;
}

function getPinterestId(url: string) {
    if (!url) return null;

    const cleanUrl = (url.split('?')[0] || '').replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const id = parts.pop() || '';

    if (id && /^\d+$/.test(id)) {
        return id;
    }

    return null;
}
const iconStyle = computed(() => {
    const pageData = props.page;
    if (!pageData) return {};

    const url = props.block.content.url || '';
    const style: { color: string; '--glow-color'?: string } = {
        color: pageData.iconColor || '#CCCCCC'
    };

    let brandColor = '';
    if (pageData.useStandardIconColors) {
        if (url.includes('github')) brandColor = '#E5E7EB';
        if (url.includes('twitter') || url.includes('x.com')) brandColor = '#1DA1F2';
        if (url.includes('instagram')) brandColor = '#E4405F';
        if (url.includes('linkedin')) brandColor = '#0A66C2';
        if (url.includes('youtube')) brandColor = '#FF0000';
        if (url.includes('discord')) brandColor = '#5865F2';
        if (url.includes('twitch')) brandColor = '#9146FF';
        if (url.includes('pinterest')) brandColor = '#E82B43';
        if (url.includes('spotify')) brandColor = '#1DB954';
        if (url.includes('soundcloud')) brandColor = '#FF5500';
    }

    if (brandColor) style.color = brandColor;
    if (pageData.glowEffect === 'icons' || pageData.glowEffect === 'both') {
        style['--glow-color'] = style.color;
    }
    return style;
});

const rootWidthClass = computed(() => {
    if (props.block.type === 'LINK' && isIconsOnly.value) {
        return 'w-auto';
    }
    return 'w-full';
});

function getIconForUrl(url: string | null | undefined) {
    if (!url) return LinkIcon;
    const u = url.toLowerCase();
    if (u.includes('github')) return BrandGithubIcon;
    if (u.includes('twitter') || u.includes('x.com')) return BrandTwitterIcon;
    if (u.includes('instagram')) return BrandInstagramIcon;
    if (u.includes('linkedin')) return BrandLinkedinIcon;
    if (u.includes('youtube')) return BrandYoutubeIcon;
    if (u.includes('discord')) return BrandDiscordIcon;
    if (u.includes('pinterest')) return BrandPinterestIcon;
    if (u.includes('twitch')) return BrandTwitchIcon;
    if (u.includes('spotify')) return BrandSpotifyIcon;
    if (u.includes('soundcloud')) return BrandSoundcloudIcon;
    return LinkIcon;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-pixel {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    /* Ajuste para caber */
    line-height: 1.2;
}

/* Animação Shine para Spotlight */
@keyframes shine {
    100% {
        transform: translateX(100%);
    }
}

.group-hover\:animate-shine:hover {
    animation: shine 1s;
}
</style>