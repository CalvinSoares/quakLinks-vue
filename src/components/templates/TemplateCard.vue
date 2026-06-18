<template>
  <article class="ui-template-card group flex flex-col overflow-hidden">
    <div class="relative aspect-video overflow-hidden bg-slate-950">
      <img
        :src="template.previewImageUrl"
        :alt="template.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <button
        type="button"
        class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-slate-800"
        :aria-label="template.isFavorited ? copy.unfavorite : copy.favorite"
        @click.stop="$emit('favorite', template)"
      >
        <StarIcon
          class="h-5 w-5 transition-colors"
          :class="template.isFavorited ? 'text-amber-400 fill-amber-400' : 'text-slate-300'"
        />
      </button>
      <span
        v-if="template.isNew"
        class="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950"
      >
        {{ copy.new }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-start gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-amber-300 ring-1 ring-slate-700"
        >
          {{ creatorInitial }}
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-semibold text-white">{{ template.name }}</h3>
          <p class="truncate text-sm text-slate-400">@{{ template.creator.displayHandle }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span class="ui-template-stat inline-flex items-center gap-1.5">
          <ClockIcon class="h-3.5 w-3.5" />
          {{ copy.uses(formattedApplyCount) }}
        </span>
        <span
          v-if="showTrending"
          class="inline-flex items-center gap-1.5 text-amber-300"
        >
          <ArrowTrendingUpIcon class="h-3.5 w-3.5" />
          {{ copy.trending }}
        </span>
        <span class="ui-template-stat inline-flex items-center gap-1.5">
          <StarIcon class="h-3.5 w-3.5 text-amber-400" />
          {{ formattedFavoriteCount }}
        </span>
        <span class="ui-template-stat inline-flex items-center gap-1.5">
          <Squares2X2Icon class="h-3.5 w-3.5" />
          {{ copy.blocks(blockCount) }}
        </span>
      </div>

      <div v-if="template.tags.length > 0" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in visibleTags"
          :key="tag.name"
          class="ui-template-tag"
        >
          {{ tag.name }}
        </span>
        <span v-if="hiddenTagCount > 0" class="ui-template-tag text-slate-500">
          +{{ hiddenTagCount }}
        </span>
      </div>

      <div v-if="variant !== 'explore'" class="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
        {{ template.visibility }}
      </div>

      <div class="mt-auto flex items-center gap-2 pt-1">
        <button
          type="button"
          class="ui-btn-primary flex-1 py-2.5 text-sm"
          @click.stop="$emit('apply', template.id)"
        >
          {{ variant === 'explore' ? copy.applyNow : copy.useTemplate }}
        </button>
        <button
          type="button"
          class="ui-btn-icon shrink-0"
          :aria-label="copy.copyLink"
          @click.stop="$emit('copy-link', template.id)"
        >
          <LinkIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="ui-btn-icon shrink-0"
          :aria-label="copy.preview"
          @click.stop="$emit('view', template.id)"
        >
          <EyeIcon class="h-4 w-4" />
        </button>
        <button
          v-if="variant === 'mine'"
          type="button"
          class="ui-btn-icon shrink-0"
          :aria-label="copy.edit"
          @click.stop="$emit('edit', template)"
        >
          <PencilSquareIcon class="h-4 w-4" />
        </button>
        <button
          v-if="variant === 'mine'"
          type="button"
          class="ui-btn-icon shrink-0 border-red-500/20 text-red-300 hover:bg-red-500/10"
          :aria-label="copy.delete"
          @click.stop="$emit('delete', template.id)"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  EyeIcon,
  LinkIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  StarIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { TemplateListItem } from "@/store/templates";
import type { TemplateCardVariant } from "./TemplatesGrid.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";
import { formatTemplateStat, resolveTemplateBlockCount } from "@/utils/templateShare";

const props = defineProps<{
  template: TemplateListItem;
  variant: TemplateCardVariant;
  showTrending?: boolean;
}>();

defineEmits(["view", "apply", "favorite", "edit", "delete", "copy-link"]);

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        by: "by",
        applyNow: "Use Template",
        favorite: "Favorite",
        unfavorite: "Remove favorite",
        viewDetails: "View Details",
        useTemplate: "Use Template",
        edit: "Edit",
        delete: "Delete",
        new: "New",
        trending: "Trending",
        copyLink: "Copy link",
        preview: "Preview",
        uses: (count: string) => `${count} uses`,
        blocks: (count: number) => `${count} blocks`,
      };
    case "es":
      return {
        by: "por",
        applyNow: "Usar plantilla",
        favorite: "Favorito",
        unfavorite: "Quitar favorito",
        viewDetails: "Ver detalles",
        useTemplate: "Usar plantilla",
        edit: "Editar",
        delete: "Eliminar",
        new: "Nuevo",
        trending: "Tendencia",
        copyLink: "Copiar enlace",
        preview: "Vista previa",
        uses: (count: string) => `${count} usos`,
        blocks: (count: number) => `${count} bloques`,
      };
    default:
      return {
        by: "por",
        applyNow: "Usar modelo",
        favorite: "Favoritar",
        unfavorite: "Remover favorito",
        viewDetails: "Ver detalhes",
        useTemplate: "Usar modelo",
        edit: "Editar",
        delete: "Excluir",
        new: "Novo",
        trending: "Em alta",
        copyLink: "Copiar link",
        preview: "Previa",
        uses: (count: string) => `${count} usos`,
        blocks: (count: number) => `${count} blocos`,
      };
  }
});

const localeTag = computed(() => {
  switch (locale.value) {
    case "en":
      return "en-US";
    case "es":
      return "es-ES";
    default:
      return "pt-BR";
  }
});

const blockCount = computed(() => resolveTemplateBlockCount(props.template));

const formattedFavoriteCount = computed(() =>
  formatTemplateStat(props.template._count.favoritedBy, localeTag.value),
);

const formattedApplyCount = computed(() =>
  formatTemplateStat(props.template.applyCount, localeTag.value),
);

const creatorInitial = computed(() =>
  props.template.creator.name.trim().charAt(0).toUpperCase() || "?",
);

const visibleTags = computed(() => props.template.tags.slice(0, 3));

const hiddenTagCount = computed(() =>
  Math.max(0, props.template.tags.length - visibleTags.value.length),
);

const showTrending = computed(() => {
  const trendingByStats =
    props.template._count.favoritedBy >= 10 || props.template.applyCount >= 50;
  return props.showTrending ?? trendingByStats;
});
</script>
