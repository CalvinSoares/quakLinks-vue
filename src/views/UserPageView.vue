<template>
  <div v-if="pageStore.isLoading" class="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
    Carregando perfil...
  </div>

  <div v-else-if="pageStore.error" class="flex items-center justify-center min-h-screen bg-slate-950 p-4">
    <div class="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
      <h1 class="text-4xl font-bold text-red-400">Oops!</h1>
      <p class="mt-2 text-slate-400">{{ pageStore.error }}</p>
      <router-link to="/"
        class="inline-block px-6 py-2 mt-6 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700">
        Voltar para o início
      </router-link>
    </div>
  </div>

  <div v-else-if="page" class="min-h-full w-full relative text-white transition-all duration-500" :style="{
    fontFamily: page.fontFamily || 'Inter',
    cursor: page.cursorUrl ? `url(${page.cursorUrl}), auto` : 'auto'
  }">
    <!-- 1. Fundo (Imagem/Cor) com Efeito de Blur -->
    <video v-if="page.backgroundType === 'video' && page.backgroundVideoUrl" :key="page.backgroundVideoUrl"
      class="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
      :style="{ filter: `blur(${page.backgroundBlur || 0}px)` }" :poster="page.backgroundUrl || ''" autoplay loop muted
      playsinline>
      <source :src="page.backgroundVideoUrl" type="video/mp4">
      Seu navegador não suporta vídeos.
    </video>

    <div v-else class="absolute inset-0 bg-cover bg-center transition-all duration-700" :style="pageBackgroundStyle">
    </div>

    <!-- 2. Overlays VFX -->
    <div v-if="page.backgroundOverlay === 'noise'"
      class="absolute inset-0 z-[1] opacity-10 pointer-events-none bg-[url('/noise.png')] animate-pulse"></div>
    <div v-if="page.backgroundOverlay === 'scanlines'"
      class="absolute inset-0 z-[1] pointer-events-none bg-[url('/scanlines.png')] bg-cover opacity-20"></div>
    <div v-if="page.backgroundOverlay === 'vignette'"
      class="absolute inset-0 z-[1] pointer-events-none bg-radial-vignette"></div>

    <!-- 3. Container do Conteúdo -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">

      <!-- MODIFICADO: Container dinâmico que vira o "card" ou um container simples -->
      <div class="relative w-full max-w-md mx-auto transition-all duration-300 rounded-2xl p-6 sm:p-8"
        :style="profileCardStyle">
        <div
          class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent">
        </div>

        <!-- Avatar com Borda Dinâmica -->
        <div class="relative group mb-4 flex justify-center">
          <div class="p-1 rounded-full transition-all duration-300" :style="profileRingStyle"
            :class="{ 'ring-animated': page.profileRingType === 'animated' }">
            <img :src="finalAvatarUrl" alt="Avatar" class="relative w-28 h-28 object-cover rounded-full shadow-lg" />
          </div>
        </div>

        <h1 class="text-3xl font-bold tracking-tight drop-shadow-lg min-h-[48px]"
          :class="{ 'text-glow': page.glowEffect === 'title' || page.glowEffect === 'both' }"
          :style="{ color: page.textColor || '#FFFFFF', '--glow-color': page.textColor || '#FFFFFF' }">
          <span v-if="page.typewriterEffect" class="typewriter font-mono"
            :style="{ '--char-count': (user?.name || page.slug).length }" :key="user?.name || page.slug">
            {{ user?.name || page.slug }}
          </span>
          <span v-else>
            {{ user?.name || page.slug }}
          </span>
        </h1>

        <p v-if="page.bio" class="mt-2 text-slate-300 max-w-sm opacity-90">
          <span>{{ page.bio }}</span>
        </p>

        <!-- Contador de Views e Localização -->
        <div class="mt-4 w-full flex flex-row items-center justify-between gap-2 text-sm text-white">
          <div v-if="page.showViewCount" class="flex items-center justify-start gap-2">
            <EyeIcon class="w-5 h-5" />
            <span>{{ page.viewCount.toLocaleString() }}</span>
          </div>

          <div v-if="page.location" class="flex items-center justify-start gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
            <span>{{ page.location }}</span>
          </div>
        </div>

        <!-- Lista de Links Dinâmica -->
        <div v-if="sortedLinks.length > 0"
          class="w-full max-w-sm mt-8 max-h-[45vh] overflow-y-auto custom-scrollbar px-2">

          <div v-if="page.layoutLinkStyle === 'icons_only'" class="flex justify-center items-center flex-wrap gap-4">
            <a v-for="(link, index) in sortedLinks" :key="link.id" :href="getRedirectUrl(link.id)" target="_blank"
              rel="noopener noreferrer" :title="link.title"
              class="group relative transition-all duration-300 transform link-item" :class="getLinkClasses(page)"
              :style="{ animationDelay: `${index * 100}ms` }">
              <div class="relative z-10 w-full h-full flex items-center justify-center">
                <component :is="getIconForUrl(link.url)" class="w-7 h-7 z-10"
                  :class="{ 'icon-glow': page.glowEffect === 'icons' || page.glowEffect === 'both' }"
                  :style="getIconStyle(link.url)" />
              </div>
            </a>
          </div>

          <div v-else :class="page.layoutLinkStyle === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'space-y-4'">
            <a v-for="(link, index) in sortedLinks" :key="link.id" :href="getRedirectUrl(link.id)" target="_blank"
              rel="noopener noreferrer" class="group relative transition-all duration-300 transform link-item"
              :class="getLinkClasses(page)" :style="{ animationDelay: `${index * 100}ms` }">
              <div class="relative z-10 w-full h-full flex" :class="{
                'items-center': page.layoutLinkStyle !== 'stacked',
                'flex-col items-center justify-center text-center gap-2': page.layoutLinkStyle === 'stacked',
                'flex-col justify-center': page.layoutLinkStyle === 'grid'
              }">
                <component :is="getIconForUrl(link.url)" class="w-7 h-7 z-10"
                  :class="{ 'icon-glow': page.glowEffect === 'icons' || page.glowEffect === 'both' }"
                  :style="getIconStyle(link.url)" />
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

    <AudioPlayer v-if="page.audios && page.audios.length > 0" :audios="page.audios" :shuffle="page.shuffleAudios"
      :show-widget="page.showAudioPlayer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/store/page';
import { useUiStore } from '@/store/uiStore';
import { BrandGithubIcon, BrandTwitterIcon, BrandInstagramIcon, BrandLinkedinIcon, BrandYoutubeIcon, LinkIcon, BrandDiscordIcon, BrandTwitchIcon, EyeIcon, BrandPinterestIcon } from 'vue-tabler-icons';
import AudioPlayer from '@/components/appearance/AudioPlayer.vue';
import { useAuthStore } from '@/store/auth';

// Hooks e Stores
const route = useRoute();
const uiStore = useUiStore();
const pageStore = usePageStore();
const { user } = useAuthStore()


// State
const page = computed(() => pageStore.currentPage);
const slug = computed(() => route.params.slug as string);
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// --- LÓGICA COPIADA E ADAPTADA DO LIVEPREVIEW ---

const finalAvatarUrl = computed(() => {
  if (!page.value) return '';
  if (page.value.user?.useDiscordAvatar && page.value.user.discordAvatarUrl) {
    return page.value.user.discordAvatarUrl;
  }
  if (page.value.avatarUrl) {
    return page.value.avatarUrl;
  }
  return `https://ui-avatars.com/api/?name=${page.value.slug}&background=1e293b&color=fff&size=128`;
});

const pageBackgroundStyle = computed(() => {
  if (!page.value) return {};
  const style: Record<string, any> = {
    filter: `blur(${page.value.backgroundBlur || 0}px)`,
    transform: `scale(${1 + (page.value.backgroundBlur || 0) / 100})`
  };
  switch (page.value.backgroundType) {
    case 'image':
      style.backgroundImage = `url(${page.value.backgroundUrl})`;
      style.backgroundColor = page.value.backgroundColor || '#111827';
      break;
    case 'gradient':
      style.backgroundImage = `linear-gradient(${page.value.gradientDirection || 'to bottom'}, ${page.value.gradientColorA || '#1E3A8A'}, ${page.value.gradientColorB || '#4C1D95'})`;
      break;
    case 'solid':
    default:
      style.backgroundColor = page.value.backgroundColor || '#111827';
      break;
  }
  return style;
});

const profileCardStyle = computed(() => {
  if (!page.value || !page.value.showProfileCard) {
    return { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' };
  }

  const baseColorRgb = '107, 114, 128';
  const opacity = page.value.profileCardOpacity ?? 0.2;

  return {
    backgroundColor: `rgba(${baseColorRgb}, ${opacity})`,
    backdropFilter: `blur(16px)`, // Blur fixo de 16px
    '-webkit-backdrop-filter': `blur(16px)`,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  };
});


const profileRingStyle = computed(() => {
  if (!page.value) return {};
  const type = page.value.profileRingType || 'none';
  const colors = page.value.profileRingColors || [];
  const padding = '3px';

  if (type === 'none' || colors.length === 0) {
    return { background: 'transparent', padding };
  }
  if (type === 'solid' || colors.length === 1) {
    return { background: colors[0], padding };
  }
  const gradientColors = [...colors, colors[0]].join(', ');
  if (type === 'gradient') {
    return { background: `linear-gradient(45deg, ${gradientColors})`, padding };
  }
  if (type === 'animated') {
    return { '--ring-gradient': `conic-gradient(from var(--angle, 0deg), ${gradientColors})`, padding };
  }
  return {};
});

const getIconForUrl = (url: string | null | undefined) => {
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

const getIconStyle = (url: string) => {
  if (!page.value) return {};
  const style: { color: string; '--glow-color'?: string } = { color: page.value.iconColor || '#CCCCCC' };
  let brandColor = '';
  if (page.value.useStandardIconColors) {
    if (url.includes('github.com')) brandColor = '#E5E7EB';
    if (url.includes('twitter.com') || url.includes('x.com')) brandColor = '#1DA1F2';
    if (url.includes('instagram.com')) brandColor = '#E4405F';
    if (url.includes('linkedin.com')) brandColor = '#0A66C2';
    if (url.includes('youtube.com')) brandColor = '#FF0000';
    if (url.includes('discord.gg') || url.includes('discord.com')) brandColor = '#5865F2';
    if (url.includes('twitch.tv')) brandColor = '#9146FF';
    if (url.includes('pinterest.com')) brandColor = '#E82B43';
  }
  if (brandColor) style.color = brandColor;
  if (page.value.glowEffect === 'icons' || page.value.glowEffect === 'both') {
    style['--glow-color'] = style.color;
  }
  return style;
};

const getLinkClasses = (pageData: any) => {
  const style = pageData.linkStyle || 'classic';
  const fill = pageData.buttonStyle || 'solid';
  const roundness = pageData.buttonRoundness || 'rounded-lg';
  const shadow = pageData.buttonShadow || false;
  const layout = pageData.layoutLinkStyle || 'list';

  let layoutClasses = '';
  switch (layout) {
    case 'icons_only': layoutClasses = 'w-14 h-14 flex items-center justify-center'; break;
    case 'stacked': layoutClasses = 'flex flex-col items-center justify-center p-4 text-center'; break;
    case 'grid': layoutClasses = 'flex flex-col items-center justify-center p-3 aspect-square'; break;
    default: layoutClasses = 'flex items-center w-full px-5 py-3'; break;
  }

  switch (style) {
    case 'minimal': return `${layoutClasses} ${roundness} text-slate-300 group-hover:text-white border-b-2 group-hover:border-slate-700`;
    case 'brutalist': return `${layoutClasses} ${roundness} bg-white text-black border-2 border-black font-bold shadow-[4px_4px_0px_#000] group-hover:shadow-none group-hover:translate-x-[4px] group-hover:translate-y-[4px]`;
    case 'spotlight': return `${layoutClasses} ${roundness} bg-transparent group-hover:-translate-y-1`;
    default:
      let fillClasses = '';
      switch (fill) {
        case 'outline': fillClasses = 'border-2 border-white/30 hover:bg-white/10 bg-transparent'; break;
        case 'soft': fillClasses = 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'; break;
        case 'glass': fillClasses = 'bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10'; break;
        default: fillClasses = 'bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/50'; break;
      }
      return `${layoutClasses} ${fillClasses} ${roundness} ${shadow ? 'shadow-lg' : ''} group-hover:-translate-y-1`;
  }
};

// --- LÓGICA ORIGINAL DA PÁGINA ---

const sortedLinks = computed(() => {
  if (page.value?.links) {
    return [...page.value.links].sort((a, b) => a.order - b.order);
  }
  return [];
});

const getRedirectUrl = (linkId: string) => {
  return `${apiUrl}/redirect/${linkId}`;
};

const loadPage = (slugToFetch: string) => {
  if (slugToFetch) pageStore.fetchPageBySlug(slugToFetch);
};

// Lifecycle Hooks
onMounted(() => {
  loadPage(slug.value);
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
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 20px;
}

/* Animações e Estilos Visuais do LivePreview */
.bg-radial-vignette {
  background: radial-gradient(circle, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
}

.typewriter {
  display: inline-block;
  border-right: .15em solid #a78bfa;
  white-space: nowrap;
  overflow: hidden;
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

/* Animação de entrada para os links */
.link-item {
  opacity: 0;
  animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efeitos de Brilho (Glow) */
.text-glow {
  text-shadow: 0 0 5px var(--glow-color, #fff), 0 0 10px var(--glow-color, #fff), 0 0 15px var(--glow-color, #fff), 0 0 20px rgba(255, 255, 255, 0.5);
  transition: text-shadow 0.3s ease-in-out;
}

.icon-glow {
  filter: drop-shadow(0 0 3px var(--glow-color, #fff)) drop-shadow(0 0 6px var(--glow-color, #fff));
  transition: filter 0.3s ease-in-out;
}
</style>