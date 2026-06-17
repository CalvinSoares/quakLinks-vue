<template>
  <main class="flex-1 relative bg-[#0B0F19] flex flex-col overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none"
      style="background-image: radial-gradient(#4b5563 1px, transparent 1px); background-size: 24px 24px;"></div>

    <div v-if="isEditingPage" class="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
      <div
        class="absolute top-6 z-30 flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
        <button @click="$emit('update:previewMode', 'mobile')"
          :class="previewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
          class="p-2 rounded-full transition-all">
          <DevicePhoneMobileIcon class="w-5 h-5" />
        </button>
        <div class="w-px h-4 bg-slate-700"></div>
        <button @click="$emit('update:previewMode', 'desktop')"
          :class="previewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
          class="p-2 rounded-full transition-all">
          <ComputerDesktopIcon class="w-5 h-5" />
        </button>
      </div>

      <transition name="scale" mode="out-in">
        <div v-if="previewMode === 'mobile'" key="mobile"
          class="relative transition-all h-full duration-500 ease-out origin-center scale-[0.85] lg:scale-[0.9] xl:scale-100">
          <div
            class="relative w-[360px] h-full bg-black rounded-[3rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] border-[8px] border-slate-900 ring-1 ring-slate-800/50 overflow-hidden">
            <div class="w-full h-full bg-slate-950 overflow-y-auto custom-scrollbar">
              <LivePreview :preview-data="previewData" />
            </div>
          </div>
        </div>

        <div v-else key="desktop"
          class="w-full max-w-5xl h-[80vh] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div class="flex-1 overflow-y-auto custom-scrollbar bg-black">
            <LivePreview :preview-data="previewData" class="min-h-full" />
          </div>
        </div>
      </transition>
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

defineProps<{
  isEditingPage: boolean;
  previewData: any;
  previewMode: string;
}>();

defineEmits(["update:previewMode"]);

const { locale } = useAppLanguage();

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
