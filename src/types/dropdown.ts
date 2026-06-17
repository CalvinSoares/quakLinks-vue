import type { Component } from "vue";

export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: Component;
  disabled?: boolean;
}
