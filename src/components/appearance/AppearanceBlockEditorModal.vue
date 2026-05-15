<template>
  <div v-if="block" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4">
      <h3 class="text-lg font-bold text-white">Editar Bloco</h3>

      <div v-if="block.type === 'HEADER' || block.type === 'TEXT'" class="space-y-3">
        <label class="input-label">
          Texto <span class="text-xs text-gray-500 ml-1">(Máx. 20 caracteres)</span>
        </label>
        <input v-model="content.text" class="input-modern" maxlength="20" />
        <div class="text-right text-xs text-gray-500 mt-1">{{ content.text?.length || 0 }}/20</div>
      </div>

      <div v-if="block.type === 'LINK'" class="space-y-3">
        <label class="input-label">Título</label>
        <input v-model="content.title" class="input-modern" />
        <label class="input-label">URL</label>
        <input v-model="content.url" class="input-modern" />
      </div>

      <div v-if="block.type === 'YOUTUBE_SUBSCRIBE'" class="space-y-3">
        <label class="input-label">ID do Canal (Channel ID)</label>
        <input v-model="content.channelId" class="input-modern" placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw" />
        <p class="text-[10px] text-gray-500">Encontre em: YouTube Studio > Personalização > Info Básica.</p>
      </div>

      <div v-if="block.type === 'PINTEREST'" class="space-y-3">
        <label class="input-label">URL do Pin</label>
        <input v-model="content.url" class="input-modern" placeholder="Ex: https://br.pinterest.com/pin/123456/" />
      </div>

      <div v-if="block.type === 'VIDEO'" class="space-y-3">
        <label class="input-label">URL do Vídeo</label>
        <input v-model="content.url" class="input-modern" placeholder="YouTube URL ou Link Direto (.mp4)" />
      </div>

      <div v-if="block.type === 'COUNTDOWN'" class="space-y-4">
        <div>
          <label class="input-label">Título</label>
          <input v-model="content.title" class="input-modern" />
        </div>
        <div>
          <label class="input-label">Data e Hora</label>
          <input type="datetime-local" v-model="content.date" class="input-modern" style="color-scheme: dark;" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="input-label">
              Texto do Botão
              <span class="text-[10px] text-slate-500">{{ content.buttonText?.length || 0 }}/25</span>
            </label>
            <input v-model="content.buttonText" class="input-modern" maxlength="25" />
          </div>
          <div>
            <label class="input-label">URL</label>
            <input v-model="content.url" class="input-modern" />
          </div>
        </div>
        <div>
          <label class="input-label">Descrição</label>
          <textarea v-model="content.description" class="input-modern" rows="2"></textarea>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-700">
          <label class="input-label">Ao encerrar:</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="none" v-model="content.endBehavior" class="accent-indigo-500" />
              Nada
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="message" v-model="content.endBehavior" class="accent-indigo-500" />
              Mensagem
            </label>
          </div>
        </div>
        <div v-if="content.endBehavior === 'message'">
          <label class="input-label">Mensagem Final</label>
          <input v-model="content.endMessage" class="input-modern" />
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm font-medium text-white">Lembretes</span>
          <SwitchToggle v-model="content.reminders" />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" class="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
        <button
          @click="$emit('save')"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SwitchToggle from "@/components/SwitchToggle.vue";

defineProps<{
  block: any;
  content: any;
}>();

defineEmits(["close", "save"]);
</script>

<style scoped>
.input-label {
  @apply block text-xs font-semibold text-slate-400 mb-1.5 ml-1;
}

.input-modern {
  @apply w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all;
}
</style>
