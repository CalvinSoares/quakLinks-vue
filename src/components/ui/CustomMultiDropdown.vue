<template>
  <Menu as="div" class="relative text-left" :class="containerClass">
    <MenuButton
      :id="id"
      class="ui-dropdown-trigger group"
      :class="triggerClass"
      :disabled="disabled"
      :aria-label="ariaLabel"
    >
      <span
        class="min-w-0 flex-1 truncate text-sm"
        :class="modelValue.length > 0 ? 'text-white' : 'text-slate-500'"
      >
        {{ triggerText }}
      </span>
      <ChevronDownIcon
        class="ui-dropdown-chevron h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[headlessui-state=open]:rotate-180"
        aria-hidden="true"
      />
    </MenuButton>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <MenuItems class="ui-dropdown-menu ui-dropdown-scrollbar" :class="menuClass">
        <MenuItem
          v-for="option in options"
          :key="String(option.value)"
          v-slot="{ active }"
          as="template"
          :disabled="option.disabled"
        >
          <button
            type="button"
            class="ui-dropdown-item"
            :class="[
              active && 'ui-dropdown-item-active',
              isSelected(option.value) && 'ui-dropdown-item-selected',
              option.disabled && 'pointer-events-none opacity-40',
            ]"
            @click="toggle(option.value)"
          >
            <span class="flex h-4 w-4 shrink-0 items-center justify-center">
              <CheckIcon
                v-if="isSelected(option.value)"
                class="h-4 w-4 text-amber-400"
                aria-hidden="true"
              />
            </span>
            <component
              v-if="option.icon"
              :is="option.icon"
              class="h-4 w-4 shrink-0"
              :class="isSelected(option.value) ? 'text-amber-300' : 'text-slate-400'"
              aria-hidden="true"
            />
            <span class="flex-1 truncate">{{ option.label }}</span>
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/24/outline";
import type { DropdownOption } from "@/types/dropdown";

const props = withDefaults(
  defineProps<{
    options: DropdownOption[];
    modelValue: string[];
    placeholder?: string;
    selectedLabel?: (count: number) => string;
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
    ariaLabel: "Selecionar opções",
    containerClass: "",
    triggerClass: "",
    menuClass: "",
  },
);

const emit = defineEmits<{
  toggle: [value: string];
}>();

const triggerText = computed(() => {
  if (props.modelValue.length === 0) {
    return props.placeholder;
  }

  if (props.selectedLabel) {
    return props.selectedLabel(props.modelValue.length);
  }

  return `${props.modelValue.length} selecionados`;
});

function isSelected(value: string | number) {
  return props.modelValue.includes(String(value));
}

function toggle(value: string | number) {
  emit("toggle", String(value));
}
</script>
