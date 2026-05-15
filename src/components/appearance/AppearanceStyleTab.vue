<template>
  <div class="space-y-8">
    <section class="group-section">
      <h3 class="section-title">Layout dos Links</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="layout in layoutOptions"
          :key="layout.id"
          @click="form.layoutLinkStyle = layout.id"
          class="relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group hover:bg-slate-800/50"
          :class="
            form.layoutLinkStyle === layout.id
              ? 'border-yellow-500 bg-yellow-500/5'
              : 'border-slate-800 bg-slate-900/30 text-slate-400'
          "
        >
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
      <h3 class="section-title">Tema dos Botões</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="styleOption in buttonThemeOptions"
          :key="styleOption.id"
          @click="form.linkStyle = styleOption.id"
          class="px-2 py-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center text-center"
          :class="
            form.linkStyle === styleOption.id
              ? 'border-yellow-500 text-white bg-yellow-500/10'
              : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/30'
          "
        >
          {{ styleOption.label }}
        </button>
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">Paleta de Cores</h3>
      <div class="space-y-4">
        <ColorPicker id="textColor" label="Texto Principal" v-model="form.textColor" />

        <ColorPicker
          id="btnColor"
          label="Fundo do Botão"
          :model-value="form.buttonColor ?? '#000000'"
          @update:model-value="(val: string) => form.buttonColor = val"
          :disabled="form.linkStyle === 'minimal'"
        />

        <div class="pt-4 border-t border-slate-800/50">
          <div class="flex items-center justify-between mb-3">
            <label class="text-xs text-slate-400 font-medium">Ícones Coloridos (Marca)</label>
            <SwitchToggle v-model="form.useStandardIconColors" />
          </div>
          <transition name="fade">
            <ColorPicker
              v-if="!form.useStandardIconColors"
              id="iconColor"
              label="Cor Personalizada dos Ícones"
              v-model="form.iconColor"
            />
          </transition>
        </div>
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">Tipografia & Forma</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="input-label">Fonte</label>
          <select v-model="form.fontFamily" class="input-modern">
            <option value="Inter">Modern (Inter)</option>
            <option value="Roboto Mono">Tech (Mono)</option>
            <option value="'Press Start 2P'">Retro (Pixel)</option>
            <option value="Cinzel">Fantasy (Cinzel)</option>
            <option value="Playfair Display">Elegant (Serif)</option>
          </select>
        </div>
        <div>
          <label class="input-label">Bordas</label>
          <select v-model="form.buttonRoundness" class="input-modern">
            <option value="rounded-none">Quadrado</option>
            <option value="rounded-md">Suave</option>
            <option value="rounded-xl">Curvo</option>
            <option value="rounded-full">Pílula</option>
          </select>
        </div>
        <div>
          <label class="input-label">Sombra</label>
          <div class="h-[42px] flex items-center px-3 bg-slate-950 border border-slate-800 rounded-lg justify-between">
            <span class="text-xs text-slate-400">Ativar</span>
            <SwitchToggle v-model="form.buttonShadow" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ColorPicker from "@/components/appearance/ColorPicker.vue";
import SwitchToggle from "@/components/SwitchToggle.vue";

defineProps<{
  form: any;
}>();

const layoutOptions = [
  { id: "list", label: "Lista" },
  { id: "grid", label: "Grade" },
  { id: "icons_only", label: "Ícones" },
  { id: "stacked", label: "Empilhado" },
];

const buttonThemeOptions = [
  { id: "classic", label: "Clássico" },
  { id: "minimal", label: "Minimal" },
  { id: "brutalist", label: "Brutalista" },
  { id: "spotlight", label: "Spotlight" },
  { id: "pixel", label: "Pixel" },
  { id: "torn", label: "Rasgado" },
];
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
