<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] overflow-hidden bg-black"
        role="dialog"
        aria-modal="true"
        :aria-label="copy.ariaLabel"
      >
        <!-- Immersive: preview da página em tela cheia (igual UserPageView) -->
        <div v-if="stage === 'immersive'" class="absolute inset-0 z-0">
          <div
            v-if="isLoading"
            class="flex h-full min-h-screen items-center justify-center bg-slate-950"
          >
            <div
              class="h-10 w-10 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400"
            />
          </div>
          <PageRenderer
            v-else-if="previewPage"
            :page="previewPage"
            fill-viewport
          />
          <img
            v-else-if="template?.previewImageUrl"
            :src="template.previewImageUrl"
            :alt="template.name"
            class="h-full min-h-screen w-full object-cover object-top"
          />
        </div>

        <!-- Gate: opacidade + clique para entrar -->
        <template v-if="stage === 'gate'">
          <div
            v-if="template?.previewImageUrl"
            class="absolute inset-0 scale-105 bg-cover bg-center blur-md"
            :style="{ backgroundImage: `url(${template.previewImageUrl})` }"
          />
          <div class="absolute inset-0 bg-black/80" />

          <button
            type="button"
            class="absolute inset-0 z-[1] flex items-center justify-center cursor-pointer"
            :aria-label="copy.clickToEnter"
            @click="enterImmersive"
          >
            <span class="text-lg font-medium tracking-wide text-white/90 sm:text-xl">
              {{ copy.clickToEnter }}
            </span>
          </button>
        </template>

        <!-- Banner superior (sempre visível) -->
        <div
          class="absolute left-1/2 top-5 z-20 w-[min(100%,42rem)] -translate-x-1/2 px-4"
          @click.stop
        >
          <div
            class="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 p-2 pl-3 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div
              v-if="isLoading"
              class="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-slate-800"
            />
            <img
              v-else-if="template?.previewImageUrl"
              :src="template.previewImageUrl"
              :alt="template.name"
              class="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
            />

            <div class="min-w-0 flex-1 py-1">
              <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {{ copy.badge }}
              </p>
              <p v-if="template" class="truncate text-base font-semibold text-white">
                {{ template.name }}
              </p>
              <p v-else class="h-5 w-40 animate-pulse rounded bg-slate-800" />
              <p v-if="template" class="truncate text-sm text-slate-400">
                {{ copy.by }} {{ template.creator.name }}
              </p>
            </div>

            <button
              v-if="stage === 'immersive'"
              type="button"
              class="shrink-0 rounded-full border border-amber-400/30 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              :disabled="isLoading || !template"
              @click="$emit('show-modal')"
            >
              {{ copy.showTemplate }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 backdrop-blur-md transition hover:bg-slate-800 hover:text-white"
          :aria-label="copy.close"
          @click="handleClose"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import type { Template, TemplateListItem } from "@/store/templates";
import PageRenderer from "@/components/appearance/PageRenderer.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";
import { mapTemplateToPreviewPage } from "@/utils/templatePreview";

const props = defineProps<{
  isOpen: boolean;
  template: TemplateListItem | Template | null;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "show-modal": [];
}>();

const stage = ref<"gate" | "immersive">("gate");

const previewPage = computed(() => {
  if (!props.template) return null;
  const full = props.template as Template;
  if (!full.pageSnapshot) return null;
  return mapTemplateToPreviewPage(full);
});

function enterImmersive() {
  stage.value = "immersive";
}

function handleClose() {
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    handleClose();
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      stage.value = "gate";
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleKeydown);
});

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        ariaLabel: "Template preview",
        badge: "Template preview",
        by: "by",
        showTemplate: "Show Template",
        clickToEnter: "click to enter...",
        close: "Close preview",
      };
    case "es":
      return {
        ariaLabel: "Vista previa del template",
        badge: "Vista previa",
        by: "por",
        showTemplate: "Ver template",
        clickToEnter: "clic para entrar...",
        close: "Cerrar vista previa",
      };
    default:
      return {
        ariaLabel: "Preview do template",
        badge: "Preview do template",
        by: "por",
        showTemplate: "Ver template",
        clickToEnter: "clique para entrar...",
        close: "Fechar preview",
      };
  }
});
</script>
