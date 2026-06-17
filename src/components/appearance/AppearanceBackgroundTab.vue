<template>
  <div class="space-y-6">
    <section class="group-section">
      <h3 class="section-title">{{ copy.pageLayout }}</h3>
      <div class="grid grid-cols-3 gap-3">
        <button @click="$emit('change-layout', 'standard')" class="group relative flex flex-col gap-2 cursor-pointer">
          <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-800" :class="form.pageLayout === 'standard'
            ? 'border-yellow-500 ring-2 ring-yellow-500/20'
            : 'border-slate-700 hover:border-slate-500'
            ">
            <div class="w-full h-full flex flex-col items-center justify-center gap-2 pt-4">
              <div class="w-8 h-8 rounded-full bg-slate-600"></div>
              <div class="w-12 h-2 rounded bg-slate-700"></div>
              <div class="w-10 h-1.5 rounded bg-slate-700/50 mt-1"></div>
            </div>
          </div>
          <span class="text-xs font-medium text-center"
            :class="form.pageLayout === 'standard' ? 'text-yellow-500' : 'text-slate-400'">
            {{ copy.layouts.standard }}
          </span>
        </button>

        <button @click="$emit('change-layout', 'banner')" class="group relative flex flex-col gap-2 cursor-pointer">
          <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-900" :class="form.pageLayout === 'banner'
            ? 'border-yellow-500 ring-2 ring-yellow-500/20'
            : 'border-slate-700 hover:border-slate-500'
            ">
            <div class="h-[35%] bg-slate-700 w-full border-b border-white/5"></div>
            <div class="flex-1 bg-slate-800/50 flex justify-center">
              <div class="w-8 h-8 -mt-4 rounded-full bg-slate-600 border-2 border-slate-800"></div>
            </div>
          </div>
          <span class="text-xs font-medium text-center"
            :class="form.pageLayout === 'banner' ? 'text-yellow-500' : 'text-slate-400'">
            {{ copy.layouts.banner }}
          </span>
        </button>

        <button @click="$emit('change-layout', 'portrait')" class="group relative flex flex-col gap-2 cursor-pointer">
          <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-900" :class="form.pageLayout === 'portrait'
            ? 'border-yellow-500 ring-2 ring-yellow-500/20'
            : 'border-slate-700 hover:border-slate-500'
            ">
            <div class="h-[55%] bg-slate-700 w-full border-b border-white/5"></div>
            <div class="flex-1 bg-slate-800/50 relative">
              <div
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800">
              </div>
            </div>
          </div>
          <span class="text-xs font-medium text-center"
            :class="form.pageLayout === 'portrait' ? 'text-yellow-500' : 'text-slate-400'">
            {{ copy.layouts.portrait }}
          </span>
        </button>
      </div>
    </section>

    <div class="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
      <button v-for="type in availableBackgroundTabs" :key="type" @click="selectBackgroundType(type)"
        class="flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all" :class="isPremiumLocked(type)
          ? 'cursor-not-allowed text-amber-300/80'
          : form.backgroundType === type
            ? 'bg-slate-700 text-white shadow'
            : 'text-slate-500 hover:text-slate-300'
          ">
        <span class="inline-flex items-center gap-1">
          {{ backgroundTabLabel(type) }}
          <span v-if="isPremiumLocked(type)"
            class="rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
            PREMIUM
          </span>
        </span>
      </button>
    </div>

    <div class="group-section min-h-[240px]">
      <transition name="fade" mode="out-in">
        <div v-if="form.pageLayout === 'standard'" key="standard-content" class="space-y-5">
          <div v-if="form.backgroundType === 'solid'">
            <ColorPicker id="bgColor" :label="copy.backgroundColor" v-model="form.backgroundColor" />
          </div>

          <div v-else-if="form.backgroundType === 'gradient'" class="space-y-4">
            <div>
              <label class="input-label">{{ copy.direction }}</label>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="dir in ['to bottom', 'to right', 'to top right', 'to bottom right']" :key="dir"
                  @click="form.gradientDirection = dir"
                  class="h-9 rounded-lg border flex items-center justify-center bg-slate-950 hover:border-yellow-500 transition-all"
                  :class="form.gradientDirection === dir ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-slate-800'
                    ">
                  <div class="w-5 h-5 rounded bg-gradient-to-br from-white/30 to-transparent"
                    :style="{ background: `linear-gradient(${dir}, rgba(255,255,255,0.4), transparent)` }"></div>
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <ColorPicker id="gradA_std" :label="copy.start" v-model="form.gradientColorA" />
              <ColorPicker id="gradB_std" :label="copy.end" v-model="form.gradientColorB" />
            </div>
          </div>

          <div v-else-if="form.backgroundType === 'image'" class="space-y-4">
            <AssetUploader :title="copy.uploadImage" :current-url="form.backgroundUrl" upload-type="background"
              accepted-files="image/*" @upload="$emit('upload', $event)" @remove="$emit('remove', 'backgroundUrl')" />
            <div class="space-y-2">
              <label class="input-label flex justify-between">
                <span>{{ copy.blur }}</span>
                <span class="text-yellow-500">{{ form.backgroundBlur }}px</span>
              </label>
              <input type="range" v-model.number="form.backgroundBlur" min="0" max="20"
                class="w-full accent-yellow-500" />
            </div>
            <div>
              <label class="input-label">{{ copy.filter }}</label>
              <CustomDropdown
                :model-value="form.backgroundOverlay"
                :options="standardOverlayOptions"
                @update:model-value="(value) => (form.backgroundOverlay = String(value))"
              />
            </div>
          </div>

          <div v-else-if="form.backgroundType === 'video'">
            <AssetUploader :title="copy.uploadVideo" :current-url="form.backgroundVideoUrl" upload-type="video"
              field-name="backgroundVideoUrl" accepted-files="video/mp4, video/webm" :is-locked="!isPremiumUser"
              required-plan="PREMIUM" :lock-message="copy.backgroundVideoLocked" @upload="$emit('upload', $event)"
              @remove="$emit('remove', 'backgroundVideoUrl')" />
          </div>

          <section class="group-section">
            <div class="flex items-center justify-between mb-4">
              <h3 class="section-title mb-0">{{ copy.profileCard }}</h3>
              <SwitchToggle v-model="form.showProfileCard" />
            </div>
            <transition name="fade">
              <div v-if="form.showProfileCard" class="space-y-4">
                <ColorPicker id="cardColor" :label="copy.cardColor" v-model="form.profileCardColor" show-alpha />
                <div class="space-y-2">
                  <label class="input-label flex justify-between">
                    <span>{{ copy.opacity }}</span>
                    <span>{{ Math.round(form.profileCardOpacity * 100) }}%</span>
                  </label>
                  <input type="range" v-model.number="form.profileCardOpacity" min="0" max="1" step="0.05"
                    class="w-full accent-yellow-500" />
                </div>
              </div>
            </transition>
          </section>
        </div>

        <div v-else key="banner-content" class="space-y-8">
          <div class="relative pl-3 border-l-2 border-yellow-500/50">
            <h4 class="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-4">{{ copy.headerTop }}</h4>

            <div v-if="form.backgroundType === 'image'" class="space-y-4">
              <AssetUploader :title="copy.coverImage" :current-url="form.backgroundUrl" upload-type="background"
                accepted-files="image/*" @upload="$emit('upload', $event)" @remove="$emit('remove', 'backgroundUrl')" />

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="input-label">{{ copy.blur }}</label>
                  <input type="range" v-model.number="form.backgroundBlur" min="0" max="20"
                    class="w-full accent-yellow-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <label class="input-label">{{ copy.filter }}</label>
                  <CustomDropdown
                    :model-value="form.backgroundOverlay"
                    :options="bannerOverlayOptions"
                    trigger-class="py-1.5"
                    @update:model-value="(value) => (form.backgroundOverlay = String(value))"
                  />
                </div>
              </div>
            </div>

            <div v-else>
              <AssetUploader :title="copy.coverVideo" :current-url="form.backgroundVideoUrl" upload-type="video"
                field-name="backgroundVideoUrl" accepted-files="video/mp4, video/webm" :is-locked="!isPremiumUser"
                required-plan="PREMIUM" :lock-message="copy.coverVideoLocked" @upload="$emit('upload', $event)"
                @remove="$emit('remove', 'backgroundVideoUrl')" />
            </div>
          </div>

          <div class="relative pl-3 border-l-2 border-indigo-500/50">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xs text-indigo-400 font-bold uppercase tracking-wider">{{ copy.pageBackground }}</h4>

              <div class="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                <button @click="$emit('update:isBodyGradient', false)"
                  class="px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all"
                  :class="!isBodyGradient ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'">
                  {{ copy.solid }}
                </button>
                <button @click="$emit('update:isBodyGradient', true)"
                  class="px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all"
                  :class="isBodyGradient ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'">
                  {{ copy.gradient }}
                </button>
              </div>
            </div>

            <transition name="fade" mode="out-in">
              <div v-if="!isBodyGradient" key="body-solid">
                <ColorPicker id="bodyColor" :label="copy.primaryColor" v-model="form.backgroundColor" />
              </div>

              <div v-else key="body-gradient" class="space-y-4">
                <div>
                  <label class="input-label">{{ copy.direction }}</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button v-for="dir in ['to bottom', 'to right', 'to top right', 'to bottom right']" :key="dir"
                      @click="form.gradientDirection = dir"
                      class="h-9 rounded-lg border flex items-center justify-center bg-slate-950 hover:border-indigo-500 transition-all"
                      :class="form.gradientDirection === dir ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-800'
                        ">
                      <div class="w-5 h-5 rounded bg-gradient-to-br from-white/30 to-transparent"
                        :style="{ background: `linear-gradient(${dir}, rgba(255,255,255,0.4), transparent)` }"></div>
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <ColorPicker id="gradA_bnr" :label="copy.start" v-model="form.gradientColorA" />
                  <ColorPicker id="gradB_bnr" :label="copy.end" v-model="form.gradientColorB" />
                </div>
              </div>
            </transition>
          </div>

          <section class="group-section">
            <div class="flex items-center justify-between mb-4">
              <h3 class="section-title mb-0">{{ copy.profileCard }}</h3>
              <SwitchToggle v-model="form.showProfileCard" />
            </div>
            <transition name="fade">
              <div v-if="form.showProfileCard" class="space-y-4">
                <ColorPicker id="cardColor" :label="copy.cardColor" v-model="form.profileCardColor" show-alpha />
                <div class="space-y-2">
                  <label class="input-label flex justify-between">
                    <span>{{ copy.opacity }}</span>
                    <span>{{ Math.round(form.profileCardOpacity * 100) }}%</span>
                  </label>
                  <input type="range" v-model.number="form.profileCardOpacity" min="0" max="1" step="0.05"
                    class="w-full accent-yellow-500" />
                </div>
              </div>
            </transition>
          </section>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AssetUploader from "@/components/assetUploader.vue";
import ColorPicker from "@/components/appearance/ColorPicker.vue";
import SwitchToggle from "@/components/SwitchToggle.vue";
import CustomDropdown from "@/components/ui/CustomDropdown.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const props = defineProps<{
  form: any;
  isBodyGradient: boolean;
  availableBackgroundTabs: string[];
  isPremiumUser: boolean;
}>();

const emit = defineEmits(["upload", "remove", "change-layout", "update:isBodyGradient", "open-plans"]);
const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        pageLayout: "Page Layout",
        layouts: { standard: "Standard", banner: "Banner", portrait: "Portrait" },
        tabs: { solid: "Color", gradient: "Gradient", image: "Image", video: "Video" },
        backgroundColor: "Background Color",
        direction: "Direction",
        start: "Start",
        end: "End",
        uploadImage: "Upload Image",
        blur: "Blur",
        filter: "Filter",
        filters: { none: "None", normal: "Normal", noise: "Noise", vignette: "Vignette" },
        uploadVideo: "Upload Video (MP4)",
        backgroundVideoLocked: "Background video is available on the PREMIUM plan.",
        profileCard: "Profile Background Card",
        cardColor: "Card Color",
        opacity: "Opacity",
        headerTop: "1. Header (Top)",
        coverImage: "Cover Image",
        coverVideo: "Cover Video",
        coverVideoLocked: "Cover video is available on the PREMIUM plan.",
        pageBackground: "2. Page Background",
        solid: "Solid",
        gradient: "Gradient",
        primaryColor: "Primary Color",
      };
    case "es":
      return {
        pageLayout: "Layout de la Página",
        layouts: { standard: "Estándar", banner: "Banner", portrait: "Retrato" },
        tabs: { solid: "Color", gradient: "Gradiente", image: "Imagen", video: "Video" },
        backgroundColor: "Color de Fondo",
        direction: "Dirección",
        start: "Inicio",
        end: "Fin",
        uploadImage: "Subir Imagen",
        blur: "Blur",
        filter: "Filtro",
        filters: { none: "Ninguno", normal: "Normal", noise: "Ruido", vignette: "Viñeta" },
        uploadVideo: "Subir Video (MP4)",
        backgroundVideoLocked: "El video de fondo está disponible en el plan PREMIUM.",
        profileCard: "Card de Fondo del Perfil",
        cardColor: "Color del Card",
        opacity: "Opacidad",
        headerTop: "1. Encabezado (Superior)",
        coverImage: "Imagen de Portada",
        coverVideo: "Video de Portada",
        coverVideoLocked: "El video de portada está disponible en el plan PREMIUM.",
        pageBackground: "2. Fondo de la Página",
        solid: "Sólido",
        gradient: "Gradiente",
        primaryColor: "Color Principal",
      };
    default:
      return {
        pageLayout: "Layout da Página",
        layouts: { standard: "Padrão", banner: "Banner", portrait: "Retrato" },
        tabs: { solid: "Cor", gradient: "Gradiente", image: "Imagem", video: "Vídeo" },
        backgroundColor: "Cor de Fundo",
        direction: "Direção",
        start: "Início",
        end: "Fim",
        uploadImage: "Upload Imagem",
        blur: "Blur",
        filter: "Filtro",
        filters: { none: "Nenhum", normal: "Normal", noise: "Ruído", vignette: "Vinheta" },
        uploadVideo: "Upload Vídeo (MP4)",
        backgroundVideoLocked: "Vídeo de fundo está disponível no plano PREMIUM.",
        profileCard: "Card de Fundo do Perfil",
        cardColor: "Cor do Card",
        opacity: "Opacidade",
        headerTop: "1. Cabeçalho (Topo)",
        coverImage: "Imagem de Capa",
        coverVideo: "Vídeo de Capa",
        coverVideoLocked: "Vídeo de capa está disponível no plano PREMIUM.",
        pageBackground: "2. Fundo da Página",
        solid: "Sólido",
        gradient: "Gradiente",
        primaryColor: "Cor Principal",
      };
  }
});

const standardOverlayOptions = computed(() => [
  { label: copy.value.filters.none, value: "none" },
  { label: "Noise", value: "noise" },
  { label: "Scanlines", value: "scanlines" },
  { label: copy.value.filters.vignette, value: "vignette" },
]);

const bannerOverlayOptions = computed(() => [
  { label: copy.value.filters.normal, value: "none" },
  { label: copy.value.filters.noise, value: "noise" },
  { label: copy.value.filters.vignette, value: "vignette" },
]);

function isPremiumLocked(type: string) {
  return type === "video" && !props.isPremiumUser;
}

function selectBackgroundType(type: string) {
  if (isPremiumLocked(type)) {
    emit("open-plans", copy.value.backgroundVideoLocked);
    return;
  }
  props.form.backgroundType = type;
}

function backgroundTabLabel(type: string) {
  return copy.value.tabs[type as keyof typeof copy.value.tabs] ?? type;
}
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
