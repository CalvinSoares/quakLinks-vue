<template>
  <div class="text-center py-16">
    <div class="inline-flex items-center gap-3">
      <div class="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
      <p class="text-slate-400 font-medium">{{ copy.loading }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return { loading: "Loading templates..." };
    case "es":
      return { loading: "Cargando plantillas..." };
    default:
      return { loading: "Carregando modelos..." };
  }
});
</script>
