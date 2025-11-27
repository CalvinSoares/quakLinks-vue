<template>
  <!-- O container agora tem padding-top para evitar o "notch" e é relativo para o player de áudio -->
  <div v-if="previewData" class="w-full h-full relative  bg-slate-950">

    <!-- ADICIONADO: O AudioPlayer agora faz parte do preview -->
    <AudioPlayer v-if="previewData.audios && previewData.audios.length > 0" :audios="previewData.audios"
      :shuffle="previewData.shuffleAudios" :show-widget="previewData.showAudioPlayer" />

    <!-- O PageRenderer continua sendo o coração da UI -->
    <PageRenderer :page="pageWithLinks" />

  </div>
  <div v-else class="flex items-center justify-center h-full text-slate-500">
    Carregando preview...
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageRenderer from './PageRenderer.vue';
import AudioPlayer from './AudioPlayer.vue';
import { usePageStore, type Page } from '@/store/page';


const props = defineProps<{
  previewData: any;
}>();


const pageStore = usePageStore();

const pageWithLinks = computed(() => {
  return {
    ...props.previewData,
    links: pageStore.currentPage?.links || [],
    user: pageStore.currentPage?.user || null,
    audios: pageStore.currentPage?.audios || [],
  };
});

</script>