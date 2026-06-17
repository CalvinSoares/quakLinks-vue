<template>
  <div class="rounded-2xl border border-white/10 bg-slate-950/70 p-1"
    :class="compact ? 'w-full max-w-[180px]' : 'w-full sm:w-auto'">
    <div class="grid gap-1" :class="compact ? 'grid-cols-3' : 'grid-cols-3 sm:flex sm:flex-wrap'">
      <button v-for="option in localeOptions" :key="option.value" type="button"
        class="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border px-2 py-2 text-left transition"
        :class="locale === option.value
          ? 'border-amber-400/30 bg-amber-500/15 text-white'
          : 'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-slate-900/80 hover:text-white'"
        @click="handleChange(option.value)">
        <img :src="option.flag" :alt="option.label" class="h-5 w-5 rounded-full object-cover" />
        <span v-if="!compact" class="min-w-0 truncate font-semibold"
          :class="showFullLabels ? 'text-xs' : 'text-[11px]'">
          {{ showFullLabels ? option.label : option.value.toUpperCase() }}
        </span>
        <span v-else class="text-[11px] font-bold uppercase">
          {{ option.value }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useAppLanguage, type AppLocale } from "@/composables/useAppLanguage";

const props = withDefaults(
  defineProps<{
    compact?: boolean;
  }>(),
  {
    compact: false,
  },
);

const { locale, localeOptions, setLocale } = useAppLanguage();
const emit = defineEmits<{
  (e: "changed", value: AppLocale): void;
}>();
const showFullLabels = computed(() => !props.compact);

function handleChange(value: AppLocale) {
  setLocale(value);
  emit("changed", value);
}
</script>
