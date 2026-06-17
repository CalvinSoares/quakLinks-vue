<template>
  <div class="space-y-8">
    <section class="group-section">
      <h3 class="section-title">{{ copy.linksLayout }}</h3>
      <div class="grid grid-cols-2 gap-3">
        <button v-for="layout in layoutOptions" :key="layout.id" @click="form.layoutLinkStyle = layout.id"
          class="relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group hover:bg-slate-800/50"
          :class="form.layoutLinkStyle === layout.id
              ? 'border-yellow-500 bg-yellow-500/5'
              : 'border-slate-800 bg-slate-900/30 text-slate-400'
            ">
          <div class="w-full h-12 rounded bg-slate-800/50 flex items-center justify-center p-2">
            <div v-if="layout.id === 'list'" class="w-full space-y-1">
              <div class="h-2 bg-slate-600 rounded w-full"></div>
              <div class="h-2 bg-slate-600 rounded w-3/4"></div>
            </div>
            <div v-else-if="layout.id === 'grid'" class="grid grid-cols-2 gap-1 w-full">
              <div class="aspect-square bg-slate-600 rounded"></div>
              <div class="aspect-square bg-slate-600 rounded"></div>
            </div>
            <div v-else-if="layout.id === 'icons_only'" class="flex gap-1">
              <div class="w-4 h-4 rounded-full bg-slate-600"></div>
              <div class="w-4 h-4 rounded-full bg-slate-600"></div>
            </div>
            <div v-else class="flex flex-col items-center gap-1 w-full">
              <div class="w-4 h-4 rounded bg-slate-600"></div>
              <div class="h-1 w-1/2 bg-slate-600 rounded"></div>
            </div>
          </div>
          <span class="text-xs font-semibold">{{ layout.label }}</span>
        </button>
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">{{ copy.buttonTheme }}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button v-for="styleOption in buttonThemeOptions" :key="styleOption.id" @click="form.linkStyle = styleOption.id"
          class="px-2 py-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center text-center"
          :class="form.linkStyle === styleOption.id
              ? 'border-yellow-500 text-white bg-yellow-500/10'
              : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/30'
            ">
          {{ styleOption.label }}
        </button>
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">{{ copy.colorPalette }}</h3>
      <div class="space-y-4">
        <ColorPicker id="textColor" :label="copy.primaryText" v-model="form.textColor" />

        <ColorPicker id="btnColor" :label="copy.buttonBackground" :model-value="form.buttonColor ?? '#000000'"
          @update:model-value="(val: string) => form.buttonColor = val" :disabled="form.linkStyle === 'minimal'" />

        <div class="pt-4 border-t border-slate-800/50">
          <div class="flex items-center justify-between mb-3">
            <label class="text-xs text-slate-400 font-medium">{{ copy.brandIcons }}</label>
            <SwitchToggle v-model="form.useStandardIconColors" />
          </div>
          <transition name="fade">
            <ColorPicker v-if="!form.useStandardIconColors" id="iconColor" :label="copy.customIconColor"
              v-model="form.iconColor" />
          </transition>
        </div>
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">{{ copy.typographyShape }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="input-label">{{ copy.font }}</label>
          <CustomDropdown
            :model-value="form.fontFamily"
            :options="fontFamilyOptions"
            @update:model-value="(value) => (form.fontFamily = String(value))"
          />
        </div>
        <div>
          <label class="input-label">{{ copy.borders }}</label>
          <CustomDropdown
            :model-value="form.buttonRoundness"
            :options="buttonRoundnessOptions"
            @update:model-value="(value) => (form.buttonRoundness = String(value))"
          />
        </div>
        <div>
          <label class="input-label">{{ copy.shadow }}</label>
          <div class="h-[42px] flex items-center px-3 bg-slate-950 border border-slate-800 rounded-lg justify-between">
            <span class="text-xs text-slate-400">{{ copy.enable }}</span>
            <SwitchToggle v-model="form.buttonShadow" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ColorPicker from "@/components/appearance/ColorPicker.vue";
import SwitchToggle from "@/components/SwitchToggle.vue";
import CustomDropdown from "@/components/ui/CustomDropdown.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

defineProps<{
  form: any;
}>();

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        linksLayout: "Link Layout",
        buttonTheme: "Button Theme",
        colorPalette: "Color Palette",
        primaryText: "Primary Text",
        buttonBackground: "Button Background",
        brandIcons: "Colored Brand Icons",
        customIconColor: "Custom Icon Color",
        typographyShape: "Typography & Shape",
        font: "Font",
        borders: "Borders",
        shadow: "Shadow",
        enable: "Enable",
        layouts: { list: "List", grid: "Grid", icons_only: "Icons", stacked: "Stacked" },
        buttonThemes: { classic: "Classic", minimal: "Minimal", brutalist: "Brutalist", spotlight: "Spotlight", pixel: "Pixel", torn: "Torn" },
        fontOptions: {
          modern: "Modern (Inter)",
          tech: "Tech (Mono)",
          retro: "Retro (Pixel)",
          fantasy: "Fantasy (Cinzel)",
          elegant: "Elegant (Serif)",
        },
        borderOptions: { square: "Square", soft: "Soft", curved: "Curved", pill: "Pill" },
      };
    case "es":
      return {
        linksLayout: "Layout de Links",
        buttonTheme: "Tema de los Botones",
        colorPalette: "Paleta de Colores",
        primaryText: "Texto Principal",
        buttonBackground: "Fondo del Botón",
        brandIcons: "Íconos Coloridos (Marca)",
        customIconColor: "Color Personalizado de los Íconos",
        typographyShape: "Tipografía y Forma",
        font: "Fuente",
        borders: "Bordes",
        shadow: "Sombra",
        enable: "Activar",
        layouts: { list: "Lista", grid: "Grilla", icons_only: "Íconos", stacked: "Apilado" },
        buttonThemes: { classic: "Clásico", minimal: "Minimal", brutalist: "Brutalista", spotlight: "Spotlight", pixel: "Pixel", torn: "Rasgado" },
        fontOptions: {
          modern: "Modern (Inter)",
          tech: "Tech (Mono)",
          retro: "Retro (Pixel)",
          fantasy: "Fantasy (Cinzel)",
          elegant: "Elegant (Serif)",
        },
        borderOptions: { square: "Cuadrado", soft: "Suave", curved: "Curvo", pill: "Píldora" },
      };
    default:
      return {
        linksLayout: "Layout dos Links",
        buttonTheme: "Tema dos Botões",
        colorPalette: "Paleta de Cores",
        primaryText: "Texto Principal",
        buttonBackground: "Fundo do Botão",
        brandIcons: "Ícones Coloridos (Marca)",
        customIconColor: "Cor Personalizada dos Ícones",
        typographyShape: "Tipografia & Forma",
        font: "Fonte",
        borders: "Bordas",
        shadow: "Sombra",
        enable: "Ativar",
        layouts: { list: "Lista", grid: "Grade", icons_only: "Ícones", stacked: "Empilhado" },
        buttonThemes: { classic: "Clássico", minimal: "Minimal", brutalist: "Brutalista", spotlight: "Spotlight", pixel: "Pixel", torn: "Rasgado" },
        fontOptions: {
          modern: "Modern (Inter)",
          tech: "Tech (Mono)",
          retro: "Retro (Pixel)",
          fantasy: "Fantasy (Cinzel)",
          elegant: "Elegant (Serif)",
        },
        borderOptions: { square: "Quadrado", soft: "Suave", curved: "Curvo", pill: "Pílula" },
      };
  }
});

const layoutOptions = computed(() => [
  { id: "list", label: copy.value.layouts.list },
  { id: "grid", label: copy.value.layouts.grid },
  { id: "icons_only", label: copy.value.layouts.icons_only },
  { id: "stacked", label: copy.value.layouts.stacked },
]);

const buttonThemeOptions = computed(() => [
  { id: "classic", label: copy.value.buttonThemes.classic },
  { id: "minimal", label: copy.value.buttonThemes.minimal },
  { id: "brutalist", label: copy.value.buttonThemes.brutalist },
  { id: "spotlight", label: copy.value.buttonThemes.spotlight },
  { id: "pixel", label: copy.value.buttonThemes.pixel },
  { id: "torn", label: copy.value.buttonThemes.torn },
]);

const fontFamilyOptions = computed(() => [
  { label: copy.value.fontOptions.modern, value: "Inter" },
  { label: copy.value.fontOptions.tech, value: "Roboto Mono" },
  { label: copy.value.fontOptions.retro, value: "'Press Start 2P'" },
  { label: copy.value.fontOptions.fantasy, value: "Cinzel" },
  { label: copy.value.fontOptions.elegant, value: "Playfair Display" },
]);

const buttonRoundnessOptions = computed(() => [
  { label: copy.value.borderOptions.square, value: "rounded-none" },
  { label: copy.value.borderOptions.soft, value: "rounded-md" },
  { label: copy.value.borderOptions.curved, value: "rounded-xl" },
  { label: copy.value.borderOptions.pill, value: "rounded-full" },
]);
</script>

<style scoped>
.group-section {
  @apply bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4;
}

.section-title {
  @apply text-sm font-bold text-slate-300 uppercase tracking-wider mb-2;
}

.input-label {
  @apply block text-xs font-semibold text-slate-400 mb-1.5 ml-1;
}

.input-modern {
  @apply w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
