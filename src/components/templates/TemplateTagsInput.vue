<template>
  <div class="space-y-3">
    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <label v-if="label" class="ui-label">{{ label }}</label>
        <span class="text-xs text-slate-500">{{ selectionSummary }}</span>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
        <div v-if="modelValue.length > 0" class="mb-3 flex flex-wrap gap-2">
          <button
            v-for="tag in modelValue"
            :key="tag"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-400/20"
            @click="removeTag(tag)"
          >
            <span>{{ formatTag(tag) }}</span>
            <XMarkIcon class="h-3.5 w-3.5" />
          </button>
        </div>

        <input
          v-model="draft"
          type="text"
          class="w-full bg-transparent px-1 py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          :placeholder="placeholder"
          @keydown.backspace="handleBackspace"
        />
      </div>

      <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    </div>

    <div v-if="filteredSuggestions.length > 0" class="space-y-2">
      <p v-if="suggestionsLabel" class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {{ suggestionsLabel }}
      </p>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="suggestion in filteredSuggestions"
          :key="suggestion"
          type="button"
          class="rounded-full border px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
          :class="
            hasTag(suggestion)
              ? 'border-sky-400/40 bg-sky-400/15 text-sky-200'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
          "
          :disabled="isMaxReached && !hasTag(suggestion)"
          @click="toggleSuggestion(suggestion)"
        >
          {{ formatTag(suggestion) }}
        </button>
      </div>
    </div>

    <p v-else-if="draft" class="text-xs text-slate-500">{{ emptyStateLabel }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(defineProps<{
  modelValue: string[];
  suggestions?: Array<{ name: string }> | string[];
  label?: string;
  placeholder?: string;
  hint?: string;
  suggestionsLabel?: string;
  emptyStateLabel?: string;
  maxSelections?: number;
}>(), {
  suggestions: () => [],
  label: '',
  placeholder: '',
  hint: '',
  suggestionsLabel: '',
  emptyStateLabel: '',
  maxSelections: 5,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const draft = ref('');

const normalizedSuggestions = computed(() =>
  props.suggestions
    .map((item) => (typeof item === 'string' ? item : item.name))
    .map((item) => normalizeTag(item))
    .filter(Boolean),
);

const filteredSuggestions = computed(() => {
  const query = draft.value.trim().toLowerCase();

  return normalizedSuggestions.value.filter((tag) =>
    query ? tag.includes(query) : true,
  );
});

const isMaxReached = computed(() => props.modelValue.length >= props.maxSelections);

const selectionSummary = computed(
  () => `${props.modelValue.length}/${props.maxSelections}`,
);

function normalizeTag(tag: string) {
  return tag.trim().replace(/^#/, '').toLowerCase();
}

function formatTag(tag: string) {
  return tag.replace(/-/g, ' ');
}

function hasTag(tag: string) {
  const normalized = normalizeTag(tag);
  return props.modelValue.some((item) => item.toLowerCase() === normalized);
}

function removeTag(tagToRemove: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((tag) => normalizeTag(tag) !== normalizeTag(tagToRemove)),
  );
}

function toggleSuggestion(tag: string) {
  if (hasTag(tag)) {
    removeTag(tag);
    return;
  }

  if (isMaxReached.value) {
    return;
  }

  emit('update:modelValue', [...props.modelValue, normalizeTag(tag)]);
  draft.value = '';
}

function handleBackspace() {
  if (!draft.value && props.modelValue.length > 0) {
    emit('update:modelValue', props.modelValue.slice(0, -1));
  }
}
</script>
