<template>
  <div v-if="previewData" class="w-full h-full relative bg-slate-950 custom-scrollbar h-full overflow-y-auto">

    <AudioPlayer v-if="directAudios.length > 0" :audios="directAudios" :shuffle="previewData.shuffleAudios"
      :show-widget="previewData.showAudioPlayer" top="top-10" />

    <PageRenderer :page="pageWithLinks" />

  </div>
  <div v-else class="flex items-center justify-center h-full text-slate-500">
    {{ copy.loadingPreview }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageRenderer from './PageRenderer.vue';
import AudioPlayer from './AudioPlayer.vue';
import { usePageStore, type Page } from '@/store/page';
import { useAppLanguage } from '@/composables/useAppLanguage';


const props = defineProps<{
  previewData: any;
}>();


const pageStore = usePageStore();
const { locale } = useAppLanguage();
const copy = computed(() => {
  switch (locale.value) {
    case 'en':
      return { loadingPreview: 'Loading preview...' };
    case 'es':
      return { loadingPreview: 'Cargando preview...' };
    default:
      return { loadingPreview: 'Carregando preview...' };
  }
});

const pageWithLinks = computed(() => {
  return {
    ...props.previewData,
    links: pageStore.currentPage?.links || [],
    user: pageStore.currentPage?.user || null,
    audios: pageStore.currentPage?.audios || [],
    blocks: pageStore.currentPage?.blocks || [],
  };
});

const directAudios = computed(() => {
  if (!props.previewData || !props.previewData.audios) {
    return [];
  }
  return props.previewData.audios.filter((audio: any) => audio.type === 'DIRECT' || !audio.type);
});

</script>
