<template>
  <div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
      <template v-for="(template, index) in templates" :key="template.id">
        <div
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <TemplateCard
            :template="template"
            :variant="variant"
            :show-trending="isTrending(template, index)"
            @view="$emit('view', $event)"
            @apply="$emit('apply', $event)"
            @favorite="$emit('favorite', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @copy-link="$emit('copy-link', $event)"
          />
        </div>
      </template>
    </div>

    <div v-if="isLoading" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden animate-pulse"
      >
        <div class="aspect-video bg-slate-800" />
        <div class="space-y-3 p-4">
          <div class="h-4 bg-slate-800 rounded w-2/3" />
          <div class="h-3 bg-slate-800 rounded w-1/2" />
          <div class="h-10 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>

    <div v-if="hasMore && !isLoading" class="mt-10 text-center pb-8">
      <button @click="$emit('load-more')" class="ui-btn-secondary px-8 py-3.5">
        {{ copy.loadMore }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TemplateCard from "./TemplateCard.vue";
import type { TemplateListItem } from "@/store/templates";
import { useAppLanguage } from "@/composables/useAppLanguage";

export type TemplateCardVariant = "explore" | "favorites" | "recent" | "mine";

const props = defineProps<{
  templates: TemplateListItem[];
  variant: TemplateCardVariant;
  hasMore: boolean;
  isLoading: boolean;
  sortBy?: "popular" | "newest" | "oldest";
}>();

defineEmits<{
  view: [id: string];
  apply: [id: string];
  favorite: [template: TemplateListItem];
  edit: [template: TemplateListItem];
  delete: [id: string];
  "copy-link": [id: string];
  "load-more": [];
}>();

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return { loadMore: "Load more templates" };
    case "es":
      return { loadMore: "Cargar más templates" };
    default:
      return { loadMore: "Carregar mais templates" };
  }
});

function isTrending(template: TemplateListItem, index: number) {
  if (props.variant !== "explore" || props.sortBy !== "popular") {
    return template._count.favoritedBy >= 10 || template.applyCount >= 50;
  }
  return index < 3 || template._count.favoritedBy >= 10;
}
</script>
