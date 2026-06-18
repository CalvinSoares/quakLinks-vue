<template>
  <div class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
    <div class="relative flex-grow w-full">
      <input
        :value="search"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        type="search"
        :placeholder="copy.searchPlaceholder"
        class="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
      />
      <MagnifyingGlassIcon
        class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
      />
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <CustomDropdown
        :model-value="sortBy"
        :options="sortOptions"
        container-class="w-full sm:w-44"
        trigger-class="bg-slate-800/60 border-slate-700/50 py-3"
        :aria-label="copy.sortPopular"
        @update:model-value="(value) => $emit('update:sortBy', value as SortType)"
      />
      <CustomMultiDropdown
        :model-value="selectedTags"
        :options="tagOptions"
        :placeholder="copy.filterTags"
        :selected-label="copy.selectedTags"
        :aria-label="copy.filterTags"
        container-class="w-full sm:w-48"
        trigger-class="bg-slate-800/60 border-slate-700/50 py-3"
        @toggle="(tagName) => $emit('toggleTag', tagName)"
      />
      <div class="relative w-full sm:w-44">
        <input
          :value="creator"
          @input="$emit('update:creator', ($event.target as HTMLInputElement).value)"
          type="search"
          :placeholder="copy.creatorPlaceholder"
          class="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <UserIcon
          class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/vue/24/solid";
import { useAppLanguage } from "@/composables/useAppLanguage";
import CustomDropdown from "@/components/ui/CustomDropdown.vue";
import CustomMultiDropdown from "@/components/ui/CustomMultiDropdown.vue";

type SortType = "popular" | "newest" | "oldest";

const props = defineProps<{
  search: string;
  sortBy: SortType;
  creator: string;
  tags: { name: string }[];
  selectedTags: string[];
}>();

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        searchPlaceholder: "Explore community-created templates",
        sortPopular: "Trending",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        filterTags: "Filter by category",
        selectedTags: (count: number) => `${count} categories selected`,
        creatorPlaceholder: "Search by creator",
      };
    case "es":
      return {
        searchPlaceholder: "Explora plantillas creadas por la comunidad",
        sortPopular: "Tendencias",
        sortNewest: "Más nuevos",
        sortOldest: "Más antiguos",
        filterTags: "Filtrar por categoría",
        selectedTags: (count: number) => `${count} categorías seleccionadas`,
        creatorPlaceholder: "Buscar por creador",
      };
    default:
      return {
        searchPlaceholder: "Explore modelos criados pela comunidade",
        sortPopular: "Em alta",
        sortNewest: "Mais novos",
        sortOldest: "Mais antigos",
        filterTags: "Filtrar por categoria",
        selectedTags: (count: number) => `${count} categorias selecionadas`,
        creatorPlaceholder: "Buscar por criador",
      };
  }
});

const sortOptions = computed(() => [
  { label: copy.value.sortPopular, value: "popular" },
  { label: copy.value.sortNewest, value: "newest" },
  { label: copy.value.sortOldest, value: "oldest" },
]);

const tagOptions = computed(() =>
  props.tags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  })),
);

defineEmits<{
  "update:search": [value: string];
  "update:sortBy": [value: SortType];
  "update:creator": [value: string];
  toggleTag: [tagName: string];
}>();
</script>
