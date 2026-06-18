<template>
  <header class="mb-6 flex-shrink-0 space-y-4">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50 p-1 w-full lg:w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('tab-change', tab.id)"
          :class="[
            'px-4 py-2.5 font-semibold text-sm transition-all duration-300 rounded-lg flex items-center gap-2 whitespace-nowrap',
            activeTab === tab.id
              ? 'text-slate-900 bg-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 shrink-0" />
          {{ tab.label }}
        </button>
      </div>

      <button @click="$emit('create')" class="ui-btn-primary flex-shrink-0 self-end lg:self-auto">
        <PlusIcon class="h-5 w-5" />
        {{ copy.createButton }}
      </button>
    </div>

    <p class="text-sm text-slate-400 max-w-2xl">{{ copy.subtitle }}</p>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  MagnifyingGlassIcon,
  RectangleStackIcon,
  HeartIcon,
  ClockIcon,
  PlusIcon,
} from "@heroicons/vue/24/solid";
import { useAppLanguage } from "@/composables/useAppLanguage";

type TabId = "explore" | "favorites" | "recent" | "mine";

defineProps<{ activeTab: TabId }>();
defineEmits<{ "tab-change": [tab: TabId]; create: [] }>();

const { locale } = useAppLanguage();

const translations = {
  pt: {
    subtitle: "Encontre um visual incrivel ou gerencie seus modelos.",
    createButton: "Criar modelo",
    tabs: {
      explore: "Biblioteca de modelos",
      favorites: "Favoritos",
      recent: "Recentes",
      mine: "Meus modelos",
    },
  },
  en: {
    subtitle: "Find an amazing look or manage your creations.",
    createButton: "Create Template",
    tabs: {
      explore: "Template Library",
      favorites: "Favorite Templates",
      recent: "Last Used Templates",
      mine: "My Uploads",
    },
  },
  es: {
    subtitle: "Encuentra un visual increible o administra tus plantillas.",
    createButton: "Crear plantilla",
    tabs: {
      explore: "Biblioteca de plantillas",
      favorites: "Plantillas favoritas",
      recent: "Usados recientemente",
      mine: "Mis plantillas",
    },
  },
} as const;

const copy = computed(() => translations[locale.value]);

const tabs = computed(
  () =>
    [
      { id: "explore", label: copy.value.tabs.explore, icon: MagnifyingGlassIcon },
      { id: "favorites", label: copy.value.tabs.favorites, icon: HeartIcon },
      { id: "recent", label: copy.value.tabs.recent, icon: ClockIcon },
      { id: "mine", label: copy.value.tabs.mine, icon: RectangleStackIcon },
    ] as const,
);
</script>
