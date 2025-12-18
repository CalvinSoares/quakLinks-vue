<template>
    <div class="min-h-[80vh] w-full relative overflow-y-auto text-white transition-all duration-500"
        :style="pageContainerStyle">

        <div class="absolute left-0 top-0 w-full transition-all duration-500 ease-in-out overflow-hidden z-0"
            :class="getBackgroundDimensions">
            <video v-if="page.backgroundType === 'video' && page.backgroundVideoUrl" :key="page.backgroundVideoUrl"
                class="w-full h-full object-cover" :style="{ filter: `blur(${page.backgroundBlur || 0}px)` }"
                :poster="page.backgroundUrl || ''" autoplay loop muted playsinline>
                <source :src="page.backgroundVideoUrl" type="video/mp4">
            </video>
            <div v-else class="w-full h-full bg-cover bg-center transition-all duration-700"
                :style="mediaBackgroundStyle"></div>
            <div v-if="page.backgroundOverlay === 'noise'"
                class="absolute inset-0 z-[1] opacity-10 pointer-events-none bg-[url('/noise.png')] animate-pulse">
            </div>
            <div v-if="page.backgroundOverlay === 'scanlines'"
                class="absolute inset-0 z-[1] pointer-events-none bg-[url('/scanlines.png')] bg-cover opacity-20"></div>
            <div v-if="page.backgroundOverlay === 'vignette'"
                class="absolute inset-0 z-[1] pointer-events-none bg-radial-vignette"></div>
        </div>


        <div class="relative z-10 flex flex-col items-center min-h-full px-4 transition-all duration-500"
            :class="getContentAlignment">

            <div class="relative w-full max-w-md mx-auto transition-all duration-300 rounded-2xl p-6 sm:p-8"
                :class="{ 'mt-0': page.pageLayout === 'standard' }" :style="profileCardStyle">

                <ProfileHeader :page="page" />

                <div v-if="sortedBlocks.length > 0" :class="containerClasses">
                    <UniversalBlock v-for="block in sortedBlocks" :key="block.id" :block="block" :page="page"
                        :class="{ 'col-span-2 w-full': page.layoutLinkStyle === 'grid' && block.type !== 'LINK' }" />
                </div>
                <div v-else-if="page.links && page.links.length > 0" class="w-full flex flex-col gap-3">
                    <UniversalBlock v-for="link in page.links" :key="link.id"
                        :block="{ type: 'LINK', content: { title: link.title, url: link.url } }" :page="page" />
                </div>

            </div>

            <div v-if="embeddableAudios.length > 0 && page.showEmbeds !== false"
                class="w-full max-w-md mx-auto mb-12 mt-6 space-y-4">
                <div v-for="audio in embeddableAudios" :key="audio.id"
                    class="relative w-full transition-transform duration-300 hover:scale-[1.02] animate-slide-up group/player">
                    <div class="absolute -inset-0.5 opacity-30 blur-xl transition-opacity duration-500 group-hover/player:opacity-50 rounded-2xl"
                        :class="audio.type === 'SPOTIFY' ? 'bg-[#1DB954]' : 'bg-[#ff5500]'">
                    </div>
                    <div
                        class="relative rounded-xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm border border-white/5">
                        <iframe v-if="audio.type === 'SPOTIFY'" style="border-radius: 12px"
                            :src="getSpotifyEmbedUrl(audio.url)" width="100%" height="152" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy" class="block w-full bg-transparent">
                        </iframe>
                        <iframe v-else-if="audio.type === 'SOUNDCLOUD'" width="100%" height="166" scrolling="no"
                            frameborder="no" allow="autoplay" :src="getSoundCloudEmbedUrl(audio.url)"
                            class="block w-full bg-transparent">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ProfileHeader from './ProfileHeader.vue';
import UniversalBlock from './UniversalBlock.vue';

const props = defineProps<{
    page: any;
}>();


const sortedBlocks = computed(() => {
    if (props.page?.blocks) {
        return [...props.page.blocks].sort((a: any, b: any) => a.order - b.order);
    }
    return [];
});



const getBackgroundDimensions = computed(() => {
    const layout = props.page.pageLayout || 'standard';

    switch (layout) {
        case 'banner':
            return 'h-[25vh] min-h-[220px]';
        case 'portrait':
            return 'h-[45vh] min-h-[300px]';
        case 'standard':
        default:
            return 'h-full inset-0';
    }
});

const getContentAlignment = computed(() => {
    const layout = props.page.pageLayout || 'standard';

    switch (layout) {
        case 'banner':
            return 'justify-start pt-[26vh]';
        case 'portrait':
            return 'justify-end pb-10 pt-[42vh]';
        case 'standard':
        default:
            return 'justify-center py-10';
    }
});

const containerClasses = computed(() => {
    const layout = props.page.layoutLinkStyle || 'list';

    switch (layout) {
        case 'icons_only':
            return 'flex flex-wrap justify-center items-center gap-4 px-2';
        case 'grid':
            return 'grid grid-cols-2 gap-3';
        case 'stacked':
        case 'list':
        default:
            return 'flex flex-col gap-3 w-full';
    }
});

const pageContainerStyle = computed(() => {
    const style: Record<string, any> = {
        fontFamily: props.page.fontFamily || 'Inter',
        backgroundColor: props.page.backgroundColor || '#111827',
        cursor: props.page.cursorUrl ? `url(${props.page.cursorUrl}), auto` : 'auto'
    };

    if (props.page.pageLayout !== 'standard') {
        const showGradient = props.page.isBodyGradient !== undefined
            ? props.page.isBodyGradient
            : true;

        if (showGradient) {
            style.backgroundImage = `linear-gradient(${props.page.gradientDirection || 'to bottom'}, ${props.page.gradientColorA || '#1E3A8A'}, ${props.page.gradientColorB || '#4C1D95'})`;
        } else {
            style.backgroundImage = 'none';
            style.backgroundColor = props.page.backgroundColor || '#111827';
        }
    }
    return style;
});

const mediaBackgroundStyle = computed(() => {
    const style: Record<string, any> = {
        filter: `blur(${props.page.backgroundBlur || 0}px)`,
        transform: `scale(${1 + (props.page.backgroundBlur || 0) / 100})`
    };

    const hasImage = props.page.backgroundUrl && props.page.backgroundUrl.length > 0;

    if (props.page.backgroundType === 'image' && hasImage) {
        style.backgroundImage = `url(${props.page.backgroundUrl})`;
    } else if (props.page.backgroundType === 'video') {
        style.backgroundColor = 'transparent';
    } else {
        style.backgroundImage = `linear-gradient(${props.page.gradientDirection || 'to bottom'}, ${props.page.gradientColorA || '#1E3A8A'}, ${props.page.gradientColorB || '#4C1D95'})`;
    }

    if (!style.backgroundImage && props.page.pageLayout === 'standard') {
        style.backgroundColor = props.page.backgroundColor || '#111827';
    }
    return style;
});


const embeddableAudios = computed(() => {
    if (!props.page || !props.page.audios) return [];
    return props.page.audios.filter((audio: any) => audio.type === 'SPOTIFY' || audio.type === 'SOUNDCLOUD');
});


const profileCardStyle = computed(() => {
    const pageData = props.page;
    if (!pageData.showProfileCard) return { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' };

    const baseColorRgb = '107, 114, 128';
    const opacity = pageData.profileCardOpacity ?? 0.2;

    return {
        backgroundColor: `rgba(${baseColorRgb}, ${opacity})`,
        backdropFilter: `blur(16px)`,
        '-webkit-backdrop-filter': `blur(16px)`,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
    };
});

function getSpotifyEmbedUrl(url: string): string {
    if (!url.includes('spotify.com')) return '';
    try {
        const urlObj = new URL(url);
        let path = urlObj.pathname;
        if (path.endsWith('/')) path = path.slice(0, -1);
        return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
    } catch (e) {
        return '';
    }
}

function getSoundCloudEmbedUrl(url: string): string {
    if (!url.includes('soundcloud.com')) return '';
    const encodedUrl = encodeURIComponent(url);
    return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}
</script>

<style scoped>
@keyframes music-bar {

    0%,
    100% {
        height: 10%;
    }

    50% {
        height: 100%;
    }
}

.bg-radial-vignette {
    background: radial-gradient(circle, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
}

.typewriter {
    display: inline-block;
    border-right: .15em solid #a78bfa;
    white-space: nowrap;
    overflow: hidden;
    max-width: 0;
    animation: typing 3.5s steps(var(--char-count, 40)) forwards, blink-caret .75s step-end infinite;
}

@keyframes typing {
    from {
        max-width: 0
    }

    to {
        max-width: 100%
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
    text-shadow: 0 0 5px var(--glow-color, #fff), 0 0 10px var(--glow-color, #fff), 0 0 15px var(--glow-color, #fff), 0 0 20px rgba(255, 255, 255, 0.5);
    transition: text-shadow 0.3s ease-in-out;
}

.icon-glow {
    filter: drop-shadow(0 0 3px var(--glow-color, #fff)) drop-shadow(0 0 6px var(--glow-color, #fff));
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
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px v-bind('props.page.textColor || "#ff00de"'), 0 0 30px v-bind('props.page.textColor || "#ff00de"'), 0 0 40px v-bind('props.page.textColor || "#ff00de"');
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
    -webkit-text-stroke: 1.5px v-bind('props.page.textColor || "#FFFFFF"');
    text-shadow: none !important;
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