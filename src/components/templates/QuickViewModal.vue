<template>
  <BaseModal :is-open="isOpen" max-width="4xl" @close="$emit('close')">
    <template #title>
      <div v-if="displayTemplate" class="flex items-start gap-3 min-w-0">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-amber-300 ring-1 ring-slate-700"
        >
          {{ creatorInitial }}
        </div>
        <div class="min-w-0">
          <h2 class="ui-modal-title truncate">{{ displayTemplate.name }}</h2>
          <p class="ui-modal-copy">
            {{ copy.createdBy }}
            <span class="font-semibold text-white">{{ displayTemplate.creator.name }}</span>
            <span class="text-slate-500"> · @{{ displayTemplate.creator.displayHandle }}</span>
          </p>
        </div>
      </div>
      <div v-else class="animate-pulse space-y-2">
        <div class="h-7 bg-slate-700 rounded w-2/3" />
        <div class="h-4 bg-slate-700 rounded w-1/2" />
      </div>
    </template>

    <div class="space-y-5">
      <div
        class="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
        :class="previewPage ? 'max-h-[60vh]' : 'aspect-video'"
      >
        <div v-if="isLoading" class="flex h-64 items-center justify-center">
          <div
            class="h-10 w-10 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400"
          />
        </div>
        <div
          v-else-if="previewPage"
          class="custom-scrollbar h-full max-h-[60vh] overflow-y-auto"
        >
          <PageRenderer :page="previewPage" />
        </div>
        <img
          v-else-if="displayTemplate?.previewImageUrl"
          :src="displayTemplate.previewImageUrl"
          :alt="displayTemplate.name"
          class="h-full w-full object-cover"
        />
      </div>

      <div v-if="displayTemplate" class="flex flex-wrap items-center gap-4 text-sm text-slate-400">
        <span class="inline-flex items-center gap-1.5">
          <ClockIcon class="h-4 w-4" />
          {{ copy.uses(formattedApplyCount) }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <StarIcon class="h-4 w-4 text-amber-400" />
          {{ formattedFavoriteCount }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Squares2X2Icon class="h-4 w-4" />
          {{ copy.blocks(blockCount) }}
        </span>
        <span class="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs uppercase tracking-wide text-slate-300">
          {{ displayTemplate.visibility }}
        </span>
      </div>

      <div v-if="displayTemplate?.tags.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in displayTemplate.tags"
          :key="tag.name"
          class="ui-template-tag"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>

    <template #footer>
      <template v-if="displayTemplate">
        <button
          type="button"
          class="ui-btn-icon"
          :aria-label="displayTemplate.isFavorited ? copy.unfavorite : copy.favorite"
          @click.stop="$emit('favorite', displayTemplate)"
        >
          <StarIcon
            class="h-5 w-5"
            :class="displayTemplate.isFavorited ? 'text-amber-400 fill-amber-400' : 'text-slate-400'"
          />
        </button>
        <button
          type="button"
          class="ui-btn-icon"
          :aria-label="copy.copyLink"
          @click.stop="handleCopyLink"
        >
          <LinkIcon class="h-5 w-5" />
        </button>
        <div class="flex-grow" />
        <button type="button" class="ui-btn-secondary" @click="$emit('close')">
          {{ copy.cancel }}
        </button>
        <button type="button" class="ui-btn-primary" @click="handleApply">
          <BoltIcon class="h-5 w-5" />
          {{ copy.applyTemplate }}
        </button>
      </template>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  BoltIcon,
  ClockIcon,
  LinkIcon,
  Squares2X2Icon,
  StarIcon,
} from "@heroicons/vue/24/outline";
import { toast } from "vue-sonner";
import type { Template, TemplateListItem } from "@/store/templates";
import BaseModal from "../modals/BaseModal.vue";
import PageRenderer from "@/components/appearance/PageRenderer.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";
import {
  copyTemplateShareLink,
  formatTemplateStat,
  resolveTemplateBlockCount,
} from "@/utils/templateShare";
import {
  mapTemplateToPreviewPage,
} from "@/utils/templatePreview";

const props = defineProps<{
  isOpen: boolean;
  template: TemplateListItem | Template | null;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  apply: [templateId: string];
  favorite: [template: TemplateListItem | Template];
}>();

const { locale } = useAppLanguage();

const displayTemplate = computed(() => props.template);

const previewPage = computed(() => {
  if (!displayTemplate.value) return null;
  const full = displayTemplate.value as Template;
  if (!full.pageSnapshot) return null;
  return mapTemplateToPreviewPage(full);
});

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        createdBy: "Created by",
        cancel: "Cancel",
        applyTemplate: "Use Template",
        favorite: "Favorite",
        unfavorite: "Remove favorite",
        copyLink: "Copy link",
        linkCopied: "Template link copied!",
        uses: (count: string) => `${count} uses`,
        blocks: (count: number) => `${count} blocks`,
      };
    case "es":
      return {
        createdBy: "Creado por",
        cancel: "Cancelar",
        applyTemplate: "Usar plantilla",
        favorite: "Favorito",
        unfavorite: "Quitar favorito",
        copyLink: "Copiar enlace",
        linkCopied: "¡Enlace de la plantilla copiado!",
        uses: (count: string) => `${count} usos`,
        blocks: (count: number) => `${count} bloques`,
      };
    default:
      return {
        createdBy: "Criado por",
        cancel: "Cancelar",
        applyTemplate: "Usar modelo",
        favorite: "Favoritar",
        unfavorite: "Remover favorito",
        copyLink: "Copiar link",
        linkCopied: "Link do modelo copiado!",
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

const formattedFavoriteCount = computed(() =>
  displayTemplate.value
    ? formatTemplateStat(displayTemplate.value._count.favoritedBy, localeTag.value)
    : "0",
);

const formattedApplyCount = computed(() =>
  displayTemplate.value
    ? formatTemplateStat(displayTemplate.value.applyCount ?? 0, localeTag.value)
    : "0",
);

const blockCount = computed(() => resolveTemplateBlockCount(displayTemplate.value));

const creatorInitial = computed(() =>
  displayTemplate.value?.creator.name.trim().charAt(0).toUpperCase() || "?",
);

function handleApply() {
  if (displayTemplate.value) {
    emit("apply", displayTemplate.value.id);
    emit("close");
  }
}

async function handleCopyLink() {
  if (!displayTemplate.value) return;
  try {
    await copyTemplateShareLink(displayTemplate.value.id);
    toast.success(copy.value.linkCopied);
  } catch {
    toast.error("Could not copy link.");
  }
}
</script>
