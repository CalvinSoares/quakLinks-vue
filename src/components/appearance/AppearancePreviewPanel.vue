<template>
  <main class="flex-1 relative bg-[#0B0F19] flex flex-col overflow-hidden min-w-0 min-h-0">
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none"
      style="background-image: radial-gradient(#4b5563 1px, transparent 1px); background-size: 24px 24px;"></div>

    <div v-if="isEditingPage" class="relative z-10 flex flex-col w-full h-full min-h-0 p-4 lg:p-6">
      <div class="shrink-0 flex justify-center pb-4">
        <div
          class="flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
          <button type="button" @click="setPreviewMode('mobile')"
            :class="previewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
            class="p-2 rounded-full transition-colors">
            <DevicePhoneMobileIcon class="w-5 h-5" />
          </button>
          <div class="w-px h-4 bg-slate-700"></div>
          <button type="button" @click="setPreviewMode('desktop')"
            :class="previewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
            class="p-2 rounded-full transition-colors">
            <ComputerDesktopIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="relative flex-1 min-h-0 w-full flex items-center justify-center">
        <div v-if="previewMode === 'mobile'"
          class="absolute inset-0 flex items-center justify-center">
          <div
            class="relative w-[390px] h-full max-h-[780px] min-h-[520px] bg-black rounded-[3rem] shadow-[0_0_60px_-12px_rgba(0,0,0,0.85)] border-[10px] border-slate-900 ring-1 ring-slate-800/50 overflow-hidden">
            <div class="w-full h-full bg-slate-950 overflow-y-auto custom-scrollbar">
              <LivePreview :preview-data="previewData" :allow-slug-fallback="false" />
            </div>
          </div>
        </div>

        <div v-else
          class="absolute inset-0 flex items-center justify-center px-2">
          <div
            class="w-full max-w-6xl h-full max-h-[820px] min-h-[520px] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div class="h-9 shrink-0 bg-slate-800/80 border-b border-slate-700/80 flex items-center px-4 gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span class="ml-3 text-[11px] text-slate-400 font-mono truncate">
                quacklinks.com.br/{{ previewData?.slug || 'preview' }}
              </span>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-black relative">
              <LivePreview :preview-data="previewData" :allow-slug-fallback="false" fill-viewport />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else
      class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
      <div class="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <CursorArrowRaysIcon class="w-12 h-12 text-slate-500" />
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">{{ copy.emptyTitle }}</h2>
      <p class="text-slate-400 max-w-md">{{ copy.emptyDescription }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LivePreview from "@/components/appearance/LivePreview.vue";
import {
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/vue/24/solid";
import { useAppLanguage } from "@/composables/useAppLanguage";

const props = defineProps<{
  isEditingPage: boolean;
  previewData: any;
  previewMode: string;
}>();

const emit = defineEmits<{
  "update:previewMode": [mode: "mobile" | "desktop"];
}>();

const { locale } = useAppLanguage();

function setPreviewMode(mode: "mobile" | "desktop") {
  if (props.previewMode !== mode) {
    emit("update:previewMode", mode);
  }
}

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        emptyTitle: "No Page Selected",
        emptyDescription: "Select a page in the left menu to start editing your biolink.",
      };
    case "es":
      return {
        emptyTitle: "Ninguna Página Seleccionada",
        emptyDescription: "Selecciona una página en el menú izquierdo para comenzar a editar tu biolink.",
      };
    default:
      return {
        emptyTitle: "Nenhuma Página Selecionada",
        emptyDescription: "Selecione uma página no menu à esquerda para começar a editar seu biolink.",
      };
  }
});
</script>

<style scoped>
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
