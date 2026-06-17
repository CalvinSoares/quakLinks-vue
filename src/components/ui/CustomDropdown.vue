<template>
  <Listbox
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="handleChange"
  >
    <div class="relative" :class="containerClass">
      <ListboxButton
        :id="id"
        class="ui-dropdown-trigger group"
        :class="triggerClass"
        :aria-label="ariaLabel"
      >
        <span class="flex min-w-0 flex-1 items-center gap-2">
          <component
            v-if="selectedOption?.icon"
            :is="selectedOption.icon"
            class="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <span
            class="truncate text-sm"
            :class="selectedOption ? 'text-white' : 'text-slate-500'"
          >
            {{ selectedOption?.label ?? placeholder }}
          </span>
        </span>
        <ChevronDownIcon
          class="ui-dropdown-chevron h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[headlessui-state=open]:rotate-180"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <ListboxOptions class="ui-dropdown-menu ui-dropdown-scrollbar" :class="menuClass">
          <ListboxOption
            v-for="option in options"
            :key="String(option.value)"
            :value="option.value"
            :disabled="option.disabled"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              class="ui-dropdown-item"
              :class="[
                active && 'ui-dropdown-item-active',
                selected && 'ui-dropdown-item-selected',
                option.disabled && 'pointer-events-none opacity-40',
              ]"
            >
              <component
                v-if="option.icon"
                :is="option.icon"
                class="h-4 w-4 shrink-0"
                :class="selected ? 'text-amber-300' : 'text-slate-400'"
                aria-hidden="true"
              />
              <span class="flex-1 truncate">{{ option.label }}</span>
              <CheckIcon
                v-if="selected"
                class="h-4 w-4 shrink-0 text-amber-400"
                aria-hidden="true"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/24/outline";
import type { DropdownOption } from "@/types/dropdown";

const props = withDefaults(
  defineProps<{
    options: DropdownOption[];
    modelValue: string | number | null;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    ariaLabel?: string;
    containerClass?: string;
    triggerClass?: string;
    menuClass?: string;
  }>(),
  {
    placeholder: "Selecione...",
    disabled: false,
    ariaLabel: "Selecionar opção",
    containerClass: "",
    triggerClass: "",
    menuClass: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
);

function handleChange(value: string | number) {
  emit("update:modelValue", value);
}
</script>
