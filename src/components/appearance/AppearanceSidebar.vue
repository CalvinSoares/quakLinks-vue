<template>
  <aside class="w-full lg:w-[480px] flex flex-col border-r border-slate-800/60 bg-[#0F172A] relative z-20 shadow-2xl">
    <div class="px-6 py-5 border-b border-slate-800/60 bg-[#0F172A] z-10">
      <div v-if="!isEditingPage" class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="w-2 h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full"></span>
          {{ copy.selectPageTitle }}
        </h1>
      </div>

      <div v-if="isEditingPage" class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')"
            class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            :title="copy.backToSelection">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full"></span>
            {{ copy.editorTitle }}
          </h1>
        </div>

        <button @click="$emit('save')" :disabled="isSaving || !isDirty"
          class="ui-btn-primary text-sm">
          <span v-if="isSaving"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSaving ? copy.saving : copy.publish }}
        </button>
      </div>

      <div v-if="isEditingPage" class="p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 flex">
        <button v-for="tab in tabs" :key="tab.id" @click="$emit('select-tab', tab.id)"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
          :class="activeTab === tab.id
              ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            ">
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
        <button @click="$emit('select-tab', 'blocks')"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
          :class="activeTab === 'blocks' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'">
          <BrandRedhatIcon class="w-4 h-4" />
          <span>{{ copy.blocks }}</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
      <transition name="fade" mode="out-in">
        <div v-if="!isEditingPage" key="selection-mode" class="space-y-4">
          <p class="text-sm text-slate-400 mb-4">{{ copy.selectPageDescription }}</p>

          <div v-if="isLoading" class="text-center py-8">
            <span class="loading-spinner"></span> {{ copy.loadingPages }}
          </div>

          <div v-else class="space-y-3">
            <button v-for="page in userPages" :key="page.id" @click="$emit('select-page', page.slug)"
              class="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800 transition-all group text-left">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  {{ page.title?.charAt(0).toUpperCase() || "P" }}
                </div>
                <div>
                  <h4 class="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {{ page.title || copy.untitled }}
                  </h4>
                  <p class="text-xs text-slate-500">/{{ page.slug }}</p>
                </div>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-slate-600 group-hover:text-white" />
            </button>

            <router-link to="/dashboard/pages"
              class="w-full flex items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-all gap-2 mt-4">
              <PlusIcon class="w-5 h-5" /> {{ copy.managePages }}
            </router-link>
          </div>
        </div>

        <div v-else key="edit-mode">
          <slot />
        </div>
      </transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BrandRedhatIcon } from "vue-tabler-icons";
import { ArrowLeftIcon, ChevronRightIcon, PlusIcon } from "vue-tabler-icons";
import {
  PaintBrushIcon as IconPaintBrush,
  PhotoIcon as IconPhoto,
  SparklesIcon as IconSparkles,
  UserCircleIcon as IconUserCircle,
} from "@heroicons/vue/24/outline";
import { useAppLanguage } from "@/composables/useAppLanguage";

defineProps<{
  activeTab: string;
  isDirty: boolean;
  isEditingPage: boolean;
  isLoading: boolean;
  isSaving: boolean;
  userPages: Array<{ id: string; title?: string | null; slug: string }>;
}>();

defineEmits(["back", "save", "select-page", "select-tab"]);

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        selectPageTitle: "Select Page",
        backToSelection: "Back to selection",
        editorTitle: "Editor",
        saving: "Saving...",
        publish: "Publish",
        blocks: "Blocks",
        selectPageDescription: "Choose which page you want to edit:",
        loadingPages: "Loading pages...",
        untitled: "Untitled",
        managePages: "Manage Pages",
        tabs: {
          profile: "Profile",
          style: "Style",
          background: "Background",
          extras: "Extras",
        },
      };
    case "es":
      return {
        selectPageTitle: "Seleccionar página",
        backToSelection: "Volver a la selección",
        editorTitle: "Editor",
        saving: "Guardando...",
        publish: "Publicar",
        blocks: "Bloques",
        selectPageDescription: "Elige qué página deseas editar:",
        loadingPages: "Cargando páginas...",
        untitled: "Sin título",
        managePages: "Administrar páginas",
        tabs: {
          profile: "Perfil",
          style: "Estilo",
          background: "Fondo",
          extras: "Extras",
        },
      };
    default:
      return {
        selectPageTitle: "Selecionar Página",
        backToSelection: "Voltar para seleção",
        editorTitle: "Editor",
        saving: "Salvando...",
        publish: "Publicar",
        blocks: "Blocos",
        selectPageDescription: "Escolha qual página você deseja editar:",
        loadingPages: "Carregando páginas...",
        untitled: "Sem Título",
        managePages: "Gerenciar Páginas",
        tabs: {
          profile: "Perfil",
          style: "Estilo",
          background: "Fundo",
          extras: "Extras",
        },
      };
  }
});

const tabs = computed(() => [
  { id: "profile", label: copy.value.tabs.profile, icon: IconUserCircle },
  { id: "style", label: copy.value.tabs.style, icon: IconPaintBrush },
  { id: "background", label: copy.value.tabs.background, icon: IconPhoto },
  { id: "extras", label: copy.value.tabs.extras, icon: IconSparkles },
]);
</script>
