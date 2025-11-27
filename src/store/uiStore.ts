// src/store/ui.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  // Guarda a URL da imagem do cursor, se houver uma.
  const cursorOverrideUrl = ref<string | null>(null);

  // Ação para definir uma imagem como cursor
  function setCursorOverride(url: string | null) {
    cursorOverrideUrl.value = url;
  }

  // Ação para limpar a imagem e voltar ao cursor padrão
  function clearCursorOverride() {
    cursorOverrideUrl.value = null;
  }

  return { cursorOverrideUrl, setCursorOverride, clearCursorOverride };
});
