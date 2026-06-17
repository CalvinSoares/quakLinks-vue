<template>
  <div v-if="block" class="ui-modal-shell">
    <div class="ui-modal-backdrop"></div>
    <div class="ui-modal-panel max-w-md space-y-4 p-6">
      <h3 class="ui-modal-title">{{ copy.editBlock }}</h3>

      <div v-if="block.type === 'HEADER' || block.type === 'TEXT'" class="space-y-3">
        <label class="ui-label">
          {{ copy.text }} <span class="text-xs text-gray-500 ml-1">{{ copy.max20 }}</span>
        </label>
        <input v-model="headerOrTextContent" class="ui-input" maxlength="20" />
        <div class="text-right text-xs text-gray-500 mt-1">{{ headerOrTextContent?.length || 0 }}/20</div>
      </div>

      <div v-if="block.type === 'LINK'" class="space-y-3">
        <label class="ui-label">{{ copy.title }}</label>
        <input v-model="content.title" class="ui-input" />
        <label class="ui-label">URL</label>
        <input v-model="content.url" class="ui-input" />
      </div>

      <div v-if="block.type === 'YOUTUBE_SUBSCRIBE'" class="space-y-3">
        <label class="ui-label">{{ copy.channelId }}</label>
        <input v-model="content.channelId" class="ui-input" placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw" />
        <p class="text-[10px] text-gray-500">{{ copy.channelIdHint }}</p>
      </div>

      <div v-if="block.type === 'PINTEREST'" class="space-y-3">
        <label class="ui-label">{{ copy.pinUrl }}</label>
        <input v-model="content.url" class="ui-input" placeholder="Ex: https://br.pinterest.com/pin/123456/" />
      </div>

      <div v-if="block.type === 'VIDEO'" class="space-y-3">
        <label class="ui-label">{{ copy.videoUrl }}</label>
        <input v-model="content.url" class="ui-input" :placeholder="copy.videoPlaceholder" />
      </div>

      <div v-if="block.type === 'COUNTDOWN'" class="space-y-4">
        <div>
          <label class="ui-label">{{ copy.title }}</label>
          <input v-model="content.title" class="ui-input" />
        </div>
        <div>
          <label class="ui-label">{{ copy.dateTime }}</label>
          <input type="datetime-local" v-model="content.date" class="ui-input" style="color-scheme: dark;" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="ui-label">
              {{ copy.buttonText }}
              <span class="text-[10px] text-slate-500">{{ content.buttonText?.length || 0 }}/25</span>
            </label>
            <input v-model="content.buttonText" class="ui-input" maxlength="25" />
          </div>
          <div>
            <label class="ui-label">URL</label>
            <input v-model="content.url" class="ui-input" />
          </div>
        </div>
        <div>
          <label class="ui-label">{{ copy.description }}</label>
          <textarea v-model="content.description" class="ui-input" rows="2"></textarea>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-700">
          <label class="ui-label">{{ copy.onEnd }}</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="none" v-model="content.endBehavior" class="ui-radio" />
              {{ copy.none }}
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="message" v-model="content.endBehavior" class="ui-radio" />
              {{ copy.message }}
            </label>
          </div>
        </div>
        <div v-if="content.endBehavior === 'message'">
          <label class="ui-label">{{ copy.finalMessage }}</label>
          <input v-model="content.endMessage" class="ui-input" />
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm font-medium text-white">{{ copy.reminders }}</span>
          <SwitchToggle v-model="content.reminders" />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" class="ui-btn-secondary" type="button">{{ copy.cancel }}</button>
        <button @click="$emit('save')" class="ui-btn-primary" type="button">
          {{ copy.save }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SwitchToggle from "@/components/SwitchToggle.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const props = defineProps<{
  block: any;
  content: any;
}>();

defineEmits(["close", "save"]);

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        editBlock: "Edit Block",
        text: "Text",
        max20: "(Max. 20 characters)",
        title: "Title",
        channelId: "Channel ID",
        channelIdHint: "Find it in: YouTube Studio > Customisation > Basic info.",
        pinUrl: "Pin URL",
        videoUrl: "Video URL",
        videoPlaceholder: "YouTube URL or Direct Link (.mp4)",
        dateTime: "Date and Time",
        buttonText: "Button Text",
        description: "Description",
        onEnd: "On finish:",
        none: "None",
        message: "Message",
        finalMessage: "Final Message",
        reminders: "Reminders",
        cancel: "Cancel",
        save: "Save",
      };
    case "es":
      return {
        editBlock: "Editar Bloque",
        text: "Texto",
        max20: "(Máx. 20 caracteres)",
        title: "Título",
        channelId: "ID del Canal",
        channelIdHint: "Encuéntralo en: YouTube Studio > Personalización > Información básica.",
        pinUrl: "URL del Pin",
        videoUrl: "URL del Video",
        videoPlaceholder: "URL de YouTube o link directo (.mp4)",
        dateTime: "Fecha y Hora",
        buttonText: "Texto del Botón",
        description: "Descripción",
        onEnd: "Al finalizar:",
        none: "Nada",
        message: "Mensaje",
        finalMessage: "Mensaje Final",
        reminders: "Recordatorios",
        cancel: "Cancelar",
        save: "Guardar",
      };
    default:
      return {
        editBlock: "Editar Bloco",
        text: "Texto",
        max20: "(Máx. 20 caracteres)",
        title: "Título",
        channelId: "ID do Canal (Channel ID)",
        channelIdHint: "Encontre em: YouTube Studio > Personalização > Info Básica.",
        pinUrl: "URL do Pin",
        videoUrl: "URL do Vídeo",
        videoPlaceholder: "YouTube URL ou Link Direto (.mp4)",
        dateTime: "Data e Hora",
        buttonText: "Texto do Botão",
        description: "Descrição",
        onEnd: "Ao encerrar:",
        none: "Nada",
        message: "Mensagem",
        finalMessage: "Mensagem Final",
        reminders: "Lembretes",
        cancel: "Cancelar",
        save: "Salvar",
      };
  }
});

const headerOrTextContent = computed({
  get: () =>
    props.block?.type === "HEADER"
      ? props.content.title || props.content.text || ""
      : props.content.text || props.content.textContent || "",
  set: (value: string) => {
    if (props.block?.type === "HEADER") {
      props.content.title = value;
      delete props.content.text;
      delete props.content.textContent;
      return;
    }

    props.content.text = value;
  },
});
</script>
