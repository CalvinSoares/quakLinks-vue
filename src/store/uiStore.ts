import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const cursorOverrideUrl = ref<string | null>(null);

  function setCursorOverride(url: string | null) {
    cursorOverrideUrl.value = url;
  }

  function clearCursorOverride() {
    cursorOverrideUrl.value = null;
  }

  return { cursorOverrideUrl, setCursorOverride, clearCursorOverride };
});
