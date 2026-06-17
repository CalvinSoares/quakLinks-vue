<!--
  Exemplo de uso do CustomDropdown.
  Importe o componente e passe um array de { label, value, icon }.
-->
<template>
  <div class="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <div>
      <label for="sort-dropdown" class="ui-label">Ordenar por</label>
      <CustomDropdown
        id="sort-dropdown"
        v-model="sortBy"
        :options="sortOptions"
        placeholder="Escolha uma ordenação"
      />
    </div>

    <div>
      <label for="status-dropdown" class="ui-label">Status</label>
      <CustomDropdown
        id="status-dropdown"
        v-model="status"
        :options="statusOptions"
        placeholder="Selecione o status"
      />
    </div>

    <p class="text-sm text-slate-400">
      Selecionado: <span class="text-amber-300">{{ sortBy }}</span> /
      <span class="text-amber-300">{{ status }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  FireIcon,
  ClockIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import CustomDropdown from "@/components/ui/CustomDropdown.vue";
import type { DropdownOption } from "@/types/dropdown";

const sortBy = ref<string | number>("popular");
const status = ref<string | number | null>(null);

const sortOptions: DropdownOption[] = [
  { label: "Em alta", value: "popular", icon: FireIcon },
  { label: "Mais recentes", value: "newest", icon: ClockIcon },
  { label: "Mais antigos", value: "oldest", icon: ArchiveBoxIcon },
];

const statusOptions: DropdownOption[] = [
  { label: "Ativo", value: "active", icon: CheckCircleIcon },
  { label: "Inativo", value: "inactive", icon: XCircleIcon },
];
</script>
