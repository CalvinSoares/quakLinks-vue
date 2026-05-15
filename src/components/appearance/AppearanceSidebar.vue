<template>
  <aside class="w-full lg:w-[480px] flex flex-col border-r border-slate-800/60 bg-[#0F172A] relative z-20 shadow-2xl">
    <div class="px-6 py-5 border-b border-slate-800/60 bg-[#0F172A] z-10">
      <div v-if="!isEditingPage" class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="w-2 h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full"></span>
          Selecionar Página
        </h1>
      </div>

      <div v-if="isEditingPage" class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button
            @click="$emit('back')"
            class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Voltar para seleção"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-2 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full"></span>
            Editor
          </h1>
        </div>

        <button
          @click="$emit('save')"
          :disabled="isSaving || !isDirty"
          class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span
            v-if="isSaving"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></span>
          {{ isSaving ? "Salvando..." : "Publicar" }}
        </button>
      </div>

      <div v-if="isEditingPage" class="p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('select-tab', tab.id)"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
          :class="
            activeTab === tab.id
              ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          "
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
        <button
          @click="$emit('select-tab', 'blocks')"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
          :class="activeTab === 'blocks' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'"
        >
          <BrandRedhatIcon class="w-4 h-4" />
          <span>Blocos</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
      <transition name="fade" mode="out-in">
        <div v-if="!isEditingPage" key="selection-mode" class="space-y-4">
          <p class="text-sm text-slate-400 mb-4">Escolha qual página você deseja editar:</p>

          <div v-if="isLoading" class="text-center py-8">
            <span class="loading-spinner"></span> Carregando páginas...
          </div>

          <div v-else class="space-y-3">
            <button
              v-for="page in userPages"
              :key="page.id"
              @click="$emit('select-page', page.slug)"
              class="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800 transition-all group text-left"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold"
                >
                  {{ page.title?.charAt(0).toUpperCase() || "P" }}
                </div>
                <div>
                  <h4 class="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {{ page.title || "Sem Título" }}
                  </h4>
                  <p class="text-xs text-slate-500">/{{ page.slug }}</p>
                </div>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-slate-600 group-hover:text-white" />
            </button>

            <router-link
              to="/dashboard/pages"
              class="w-full flex items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-all gap-2 mt-4"
            >
              <PlusIcon class="w-5 h-5" /> Gerenciar Páginas
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
import { BrandRedhatIcon } from "vue-tabler-icons";
import { ArrowLeftIcon, ChevronRightIcon, PlusIcon } from "vue-tabler-icons";
import {
  PaintBrushIcon as IconPaintBrush,
  PhotoIcon as IconPhoto,
  SparklesIcon as IconSparkles,
  UserCircleIcon as IconUserCircle,
} from "@heroicons/vue/24/outline";

defineProps<{
  activeTab: string;
  isDirty: boolean;
  isEditingPage: boolean;
  isLoading: boolean;
  isSaving: boolean;
  userPages: Array<{ id: string; title?: string | null; slug: string }>;
}>();

defineEmits(["back", "save", "select-page", "select-tab"]);

const tabs = [
  { id: "profile", label: "Perfil", icon: IconUserCircle },
  { id: "style", label: "Estilo", icon: IconPaintBrush },
  { id: "background", label: "Fundo", icon: IconPhoto },
  { id: "extras", label: "Extras", icon: IconSparkles },
];
</script>
