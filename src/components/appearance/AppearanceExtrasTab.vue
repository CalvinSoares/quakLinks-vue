<template>
  <div class="space-y-6">
    <section class="group-section">
      <div class="flex items-center gap-2">
        <h3 class="section-title mb-0">{{ copy.interactivity }}</h3>
        <span v-if="!isPremiumUser"
          class="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
          PREMIUM
        </span>
      </div>
      <AssetUploader :title="copy.customCursor" :current-url="form.cursorUrl" upload-type="cursor"
        accepted-files="image/png, image/gif, .cur" :is-locked="!isPremiumUser" required-plan="PREMIUM"
        :lock-message="copy.cursorLocked" @upload="$emit('upload', $event)" @remove="$emit('remove', 'cursorUrl')" />
    </section>

    <section class="group-section">
      <div class="mb-4 flex items-center gap-2">
        <h3 class="section-title mb-0">{{ copy.audioMusic }}</h3>
        <span v-if="!isPremiumUser"
          class="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
          PREMIUM
        </span>
      </div>
      <button @click="handleAudioManagerOpen"
        class="w-full rounded-xl border border-dashed px-4 py-4 transition flex items-center justify-center gap-3 group"
        :class="!isPremiumUser
          ? 'cursor-not-allowed border-amber-500/40 bg-slate-900/80 text-amber-200'
          : 'border-slate-700 bg-slate-900 hover:border-yellow-500 hover:bg-slate-800'">
        <div class="rounded-full p-2 transition-transform"
          :class="!isPremiumUser ? 'bg-amber-500/10 text-amber-300' : 'bg-yellow-500/10 text-yellow-500 group-hover:scale-110'">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div class="text-left">
          <span class="font-medium"
            :class="!isPremiumUser ? 'text-amber-100' : 'text-slate-300 group-hover:text-white'">
            {{ copy.managePlaylist(audioCount) }}
          </span>
          <p v-if="!isPremiumUser" class="text-xs text-amber-200/80">
            {{ copy.audioLocked }}
          </p>
          <p v-if="!isPremiumUser" class="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            {{ copy.clickToSeePlans }}
          </p>
        </div>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AssetUploader from "@/components/assetUploader.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const props = defineProps<{
  form: any;
  audioCount: number;
  isPremiumUser: boolean;
}>();

const emit = defineEmits(["upload", "remove", "open-audio-manager", "open-plans"]);

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        interactivity: "Interactivity",
        customCursor: "Custom Cursor",
        cursorLocked: "Custom cursor is available on the PREMIUM plan.",
        audioMusic: "Audio & Music",
        managePlaylist: (count: number) => `Manage Playlist (${count})`,
        audioLocked: "Audio uploads and players are available on the PREMIUM plan.",
        clickToSeePlans: "Click to view plans",
      };
    case "es":
      return {
        interactivity: "Interactividad",
        customCursor: "Cursor Personalizado",
        cursorLocked: "El cursor personalizado está disponible en el plan PREMIUM.",
        audioMusic: "Audio y Música",
        managePlaylist: (count: number) => `Gestionar Playlist (${count})`,
        audioLocked: "Las subidas de audio y reproductores están disponibles en el plan PREMIUM.",
        clickToSeePlans: "Haz clic para ver los planes",
      };
    default:
      return {
        interactivity: "Interatividade",
        customCursor: "Cursor Personalizado",
        cursorLocked: "Cursor personalizado está disponível no plano PREMIUM.",
        audioMusic: "Áudio & Música",
        managePlaylist: (count: number) => `Gerenciar Playlist (${count})`,
        audioLocked: "Uploads de áudio e players estão disponíveis no plano PREMIUM.",
        clickToSeePlans: "Clique para ver os planos",
      };
  }
});

function handleAudioManagerOpen() {
  if (!props.isPremiumUser) {
    emit("open-plans", copy.value.audioLocked);
    return;
  }
  emit("open-audio-manager");
}
</script>

<style scoped>
.group-section {
  @apply bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4;
}

.section-title {
  @apply text-sm font-bold text-slate-300 uppercase tracking-wider mb-2;
}
</style>
