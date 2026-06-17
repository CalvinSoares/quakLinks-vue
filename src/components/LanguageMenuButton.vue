<template>
  <div ref="rootRef" class="relative inline-flex" :class="containerClass">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-200 backdrop-blur-md transition-all hover:border-white/20 hover:bg-slate-800/90 hover:text-white"
      :class="buttonClass"
      :aria-label="copy.buttonLabel"
      :aria-expanded="isOpen"
      @click.stop="toggleMenu"
    >
      <LanguageIcon class="h-5 w-5" />
      <ChevronDownIcon
        v-if="showChevron"
        class="ml-2 h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-[90] rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl animate-fade-in-up"
      :class="[panelClass, panelWidthClass]"
    >
      <div v-if="showTitle" class="mb-3">
        <p class="text-sm font-semibold text-white">{{ copy.title }}</p>
        <p class="text-xs text-slate-400">{{ copy.subtitle }}</p>
      </div>
      <LanguageSwitcher @changed="handleChanged" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ChevronDownIcon, LanguageIcon } from "@heroicons/vue/24/outline";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

withDefaults(
  defineProps<{
    buttonClass?: string;
    containerClass?: string;
    panelClass?: string;
    panelWidthClass?: string;
    showChevron?: boolean;
    showTitle?: boolean;
  }>(),
  {
    buttonClass: "h-11 w-11",
    containerClass: "",
    panelClass: "right-0 top-[calc(100%+0.75rem)]",
    panelWidthClass: "w-72",
    showChevron: false,
    showTitle: true,
  },
);

const { locale } = useAppLanguage();
const isOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const translations = {
  pt: {
    buttonLabel: "Selecionar idioma",
    title: "Idioma",
    subtitle: "Escolha como a interface deve aparecer.",
  },
  en: {
    buttonLabel: "Select language",
    title: "Language",
    subtitle: "Choose how the interface should appear.",
  },
  es: {
    buttonLabel: "Seleccionar idioma",
    title: "Idioma",
    subtitle: "Elige cómo debe mostrarse la interfaz.",
  },
} as const;

const copy = computed(() => translations[locale.value]);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}

function handleChanged() {
  closeMenu();
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null;
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
