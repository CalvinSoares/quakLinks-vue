<template>
  <div class="space-y-6">
    <section class="group-section">
      <h3 class="section-title">Interatividade</h3>
      <AssetUploader
        title="Cursor Personalizado"
        :current-url="form.cursorUrl"
        upload-type="cursor"
        accepted-files="image/png, image/gif, .cur"
        @upload="$emit('upload', $event)"
        @remove="$emit('remove', 'cursorUrl')"
      />
    </section>

    <section class="group-section">
      <h3 class="section-title">Áudio & Música</h3>
      <button
        @click="$emit('open-audio-manager')"
        class="w-full py-4 px-4 bg-slate-900 border border-dashed border-slate-700 rounded-xl hover:border-yellow-500 hover:bg-slate-800 transition flex items-center justify-center gap-3 group"
      >
        <div class="p-2 bg-yellow-500/10 rounded-full text-yellow-500 group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <span class="font-medium text-slate-300 group-hover:text-white">
          Gerenciar Playlist ({{ audioCount }})
        </span>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import AssetUploader from "@/components/assetUploader.vue";

defineProps<{
  form: any;
  audioCount: number;
}>();

defineEmits(["upload", "remove", "open-audio-manager"]);
</script>

<style scoped>
.group-section {
  @apply bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4;
}

.section-title {
  @apply text-sm font-bold text-slate-300 uppercase tracking-wider mb-2;
}
</style>
