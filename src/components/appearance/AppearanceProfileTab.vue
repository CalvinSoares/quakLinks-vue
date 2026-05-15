<template>
  <div class="space-y-6">
    <section class="group-section">
      <h3 class="section-title">Identidade</h3>
      <div class="space-y-4">
        <div class="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 text-sm text-slate-400">
          A API atual nao expõe fotos sociais do Google ou Discord. Use um avatar local para a página.
        </div>

        <AssetUploader
          title="Upload Avatar Personalizado"
          :current-url="form.avatarUrl"
          upload-type="avatar"
          accepted-files="image/*"
          @upload="$emit('upload', $event)"
          @remove="$emit('remove', 'avatarUrl')"
        />
      </div>
    </section>

    <section class="group-section">
      <h3 class="section-title">Informações</h3>
      <div class="space-y-4">
        <div>
          <label class="input-label">Nome de Exibição</label>
          <div class="relative">
            <input v-model="form.title" type="text" class="input-modern" placeholder="Ex: @seunome" />
            <button
              @click="$emit('open-effects')"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-yellow-400 transition-colors"
              title="Efeitos do Texto"
            >
              <SparklesIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label class="input-label">Bio</label>
          <textarea
            v-model="form.bio"
            rows="3"
            class="input-modern resize-none"
            placeholder="Conte um pouco sobre você..."
            maxlength="200"
          ></textarea>
          <div class="text-right mt-1 text-[10px] text-slate-500 font-mono">{{ form.bio.length }}/200</div>
        </div>

        <div>
          <label class="input-label">Localização</label>
          <div class="relative">
            <input
              v-model="form.location"
              type="text"
              class="input-modern pl-9"
              placeholder="Cidade, País"
              maxlength="10"
            />
            <div class="text-right mt-1 text-[10px] text-slate-500 font-mono">{{ form.location.length }}/10</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AssetUploader from "@/components/assetUploader.vue";
import { SparklesIcon } from "@heroicons/vue/24/outline";

defineProps<{
  form: any;
}>();

defineEmits(["upload", "remove", "open-effects"]);
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
</style>
