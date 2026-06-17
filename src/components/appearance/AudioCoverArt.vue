<template>
  <div
    class="flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300"
    :class="containerClass"
  >
    <img
      v-if="showImage"
      :src="coverUrl || undefined"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="handleImageError"
    >
    <MusicalNoteIcon v-else :class="iconClass" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { MusicalNoteIcon } from "@heroicons/vue/24/solid";

const props = withDefaults(defineProps<{
  coverUrl?: string | null;
  alt?: string;
  roundedClass?: string;
  sizeClass?: string;
  iconClass?: string;
}>(), {
  coverUrl: null,
  alt: "Capa do audio",
  roundedClass: "rounded-lg",
  sizeClass: "",
  iconClass: "h-5 w-5",
});

const hasImageError = ref(false);

watch(
  () => props.coverUrl,
  () => {
    hasImageError.value = false;
  },
);

const showImage = computed(() => Boolean(props.coverUrl) && !hasImageError.value);
const containerClass = computed(() => [props.roundedClass, props.sizeClass]);

function handleImageError() {
  hasImageError.value = true;
}
</script>
