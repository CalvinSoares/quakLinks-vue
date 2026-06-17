<template>
  <div v-if="open" class="ui-modal-shell z-[100]">
    <div class="ui-modal-backdrop"></div>
    <div
      class="ui-modal-panel animate-fade-in-up w-full max-w-sm space-y-4 p-6">
      <div class="flex flex-col items-center text-center gap-3">
        <div class="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <ExclamationTriangleIcon class="w-7 h-7" />
        </div>
        <h3 class="text-lg font-bold text-white">{{ copy.title }}</h3>
        <p class="text-sm text-slate-400">{{ copy.description }}</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button @click="$emit('discard')"
          class="ui-btn-secondary flex-1">
          {{ copy.leave }}
        </button>
        <button @click="$emit('save-and-exit')"
          class="ui-btn-primary flex-1">
          {{ copy.saveAndLeave }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid";
import { useAppLanguage } from "@/composables/useAppLanguage";

defineProps<{
  open: boolean;
}>();

defineEmits(["discard", "save-and-exit"]);

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        title: "Unsaved changes",
        description: "You have pending changes. Do you want to leave without saving?",
        leave: "Leave",
        saveAndLeave: "Save and leave",
      };
    case "es":
      return {
        title: "Cambios no guardados",
        description: "Tienes cambios pendientes. ¿Deseas salir sin guardar?",
        leave: "Salir",
        saveAndLeave: "Guardar y salir",
      };
    default:
      return {
        title: "Alterações não salvas",
        description: "Você tem alterações pendentes. Deseja sair sem salvar?",
        leave: "Sair",
        saveAndLeave: "Salvar e Sair",
      };
  }
});
</script>
