<template>
  <div v-if="pageStore.isLoading" class="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p>Carregando perfil...</p>
    </div>
  </div>

  <div v-else-if="pageStore.error" class="flex items-center justify-center min-h-screen bg-slate-950 p-4">
    <div class="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 max-w-md w-full">
      <h1 class="text-2xl font-bold text-red-400 mb-2">Página não encontrada</h1>
      <p class="text-slate-400 mb-6">{{ pageStore.error }}</p>
      <router-link to="/"
        class="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
        Ir para a Home
      </router-link>
    </div>
  </div>

  <div v-else-if="page"
    class="min-h-screen w-full relative overflow-y-auto overflow-x-hidden text-white transition-all duration-500"
    :style="pageContainerStyle">


    <div class="absolute left-0 top-0 w-full transition-all duration-500 ease-in-out overflow-hidden z-0"
      :class="getBackgroundDimensions">

      <video v-if="page.backgroundType === 'video' && page.backgroundVideoUrl" :key="page.backgroundVideoUrl"
        class="w-full h-full object-cover" :style="{ filter: `blur(${page.backgroundBlur || 0}px)` }"
        :poster="page.backgroundUrl || ''" autoplay loop muted playsinline>
        <source :src="page.backgroundVideoUrl" type="video/mp4">
      </video>

      <div v-else class="w-full h-full bg-cover bg-center transition-all duration-700" :style="mediaBackgroundStyle">
      </div>

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

          <div
            class="absolute -inset-0.5 opacity-30 blur-xl transition-opacity duration-500 group-hover/player:opacity-50 rounded-2xl"
            :class="audio.type === 'SPOTIFY' ? 'bg-[#1DB954]' : 'bg-[#ff5500]'">
          </div>
          <div
            class="relative rounded-xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm border border-white/5">
            <iframe v-if="audio.type === 'SPOTIFY'" style="border-radius: 12px" :src="getSpotifyEmbedUrl(audio.url)"
              width="100%" height="152" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
              class="block w-full bg-transparent">
            </iframe>
            <iframe v-else-if="audio.type === 'SOUNDCLOUD'" width="100%" height="166" scrolling="no" frameborder="no"
              allow="autoplay" :src="getSoundCloudEmbedUrl(audio.url)" class="block w-full bg-transparent">
            </iframe>
          </div>
        </div>
      </div>
    </div>

    <AudioPlayer v-if="page.audios && page.audios.length > 0" :audios="page.audios" :shuffle="page.shuffleAudios"
      :show-widget="page.showAudioPlayer" top="top-5" />

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/store/page';
import { useUiStore } from '@/store/uiStore';
import AudioPlayer from '@/components/appearance/AudioPlayer.vue';
import ProfileHeader from '@/components/appearance/ProfileHeader.vue';
import UniversalBlock from '@/components/appearance/UniversalBlock.vue';

const route = useRoute();
const uiStore = useUiStore();
const pageStore = usePageStore();

const page = computed(() => pageStore.currentPage);
const slug = computed(() => route.params.slug as string);

interface Snowflake {
  id: number;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
    opacity: number;
    animationName: string;
    animationDuration: string;
    animationDelay: string;
  };
}

const snowflakes = ref<Snowflake[]>([]);

const generateSnow = () => {
  const count = 50;
  const newFlakes: Snowflake[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 5 + 5;

    newFlakes.push({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `-10px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: Math.random() * 0.5 + 0.3,
        animationName: 'snowfall',
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * 5}s`
      }
    });
  }
  snowflakes.value = newFlakes;
};


const sortedBlocks = computed(() => {
  if (page.value?.blocks) {
    return [...page.value.blocks].sort((a: any, b: any) => a.order - b.order);
  }
  return [];
});

const getBackgroundDimensions = computed(() => {
  const layout = page.value?.pageLayout || 'standard';
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
  const layout = page.value?.pageLayout || 'standard';
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
  const layout = page.value?.layoutLinkStyle || 'list';
  switch (layout) {
    case 'icons_only': return 'flex flex-wrap justify-center items-center gap-4 px-2';
    case 'grid': return 'grid grid-cols-2 gap-3';
    case 'stacked':
    case 'list':
    default: return 'flex flex-col gap-3 w-full';
  }
});

const pageContainerStyle = computed(() => {
  if (!page.value) return {};
  const style: Record<string, any> = {
    fontFamily: page.value.fontFamily || 'Inter',
    backgroundColor: page.value.backgroundColor || '#111827',
    cursor: page.value.cursorUrl ? `url(${page.value.cursorUrl}), auto` : 'auto'
  };

  if (page.value.pageLayout !== 'standard') {
    const showGradient = (page.value as any).isBodyGradient !== undefined
      ? (page.value as any).isBodyGradient
      : true;

    if (showGradient) {
      style.backgroundImage = `linear-gradient(${page.value.gradientDirection || 'to bottom'}, ${page.value.gradientColorA || '#1E3A8A'}, ${page.value.gradientColorB || '#4C1D95'})`;
    } else {
      style.backgroundImage = 'none';
      style.backgroundColor = page.value.backgroundColor || '#111827';
    }
  }
  return style;
});

const mediaBackgroundStyle = computed(() => {
  if (!page.value) return {};
  const style: Record<string, any> = {
    filter: `blur(${page.value.backgroundBlur || 0}px)`,
    transform: `scale(${1 + (page.value.backgroundBlur || 0) / 100})`
  };

  const hasImage = page.value.backgroundUrl && page.value.backgroundUrl.length > 0;

  if (page.value.backgroundType === 'image' && hasImage) {
    style.backgroundImage = `url(${page.value.backgroundUrl})`;
  } else if (page.value.backgroundType === 'video') {
    style.backgroundColor = 'transparent';
  } else {
    style.backgroundImage = `linear-gradient(${page.value.gradientDirection || 'to bottom'}, ${page.value.gradientColorA || '#1E3A8A'}, ${page.value.gradientColorB || '#4C1D95'})`;
  }

  if (!style.backgroundImage && page.value.pageLayout === 'standard') {
    style.backgroundColor = page.value.backgroundColor || '#111827';
  }

  return style;
});

const profileCardStyle = computed(() => {
  if (!page.value || !page.value.showProfileCard) return { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' };
  const baseColorRgb = '107, 114, 128';
  const opacity = page.value.profileCardOpacity ?? 0.2;

  return {
    backgroundColor: page.value.profileCardColor || `rgba(${baseColorRgb}, ${opacity})`,
    backdropFilter: `blur(16px)`,
    '-webkit-backdrop-filter': `blur(16px)`,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
  };
});

const embeddableAudios = computed(() => {
  if (!page.value || !page.value.audios) return [];
  return page.value.audios.filter((audio: any) => audio.type === 'SPOTIFY' || audio.type === 'SOUNDCLOUD');
});

function getSpotifyEmbedUrl(url: string): string {
  if (!url.includes('spotify.com')) return '';
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    if (path.endsWith('/')) path = path.slice(0, -1);
    return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
  } catch (e) { return ''; }
}

function getSoundCloudEmbedUrl(url: string): string {
  if (!url.includes('soundcloud.com')) return '';
  const encodedUrl = encodeURIComponent(url);
  return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}


const loadPage = (slugToFetch: string) => {
  if (slugToFetch) pageStore.fetchPageBySlug(slugToFetch);
};

onMounted(() => {
  loadPage(slug.value);
  generateSnow();
});

watch(slug, (newSlug) => {
  loadPage(newSlug);
});

watch(
  () => page.value?.cursorUrl,
  (newCursorUrl) => {
    uiStore.setCursorOverride(newCursorUrl || null);
  },
  { immediate: true }
);

onUnmounted(() => {
  uiStore.clearCursorOverride();
});
</script>

<style scoped>
@keyframes snowfall {
  0% {
    transform: translateY(-10px) translateX(0);
  }

  25% {
    transform: translateY(25vh) translateX(15px);
  }

  50% {
    transform: translateY(50vh) translateX(-15px);
  }

  75% {
    transform: translateY(75vh) translateX(15px);
  }

  100% {
    transform: translateY(105vh) translateX(0);
  }
}

.fixed div {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.bg-radial-vignette {
  background: radial-gradient(circle, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>