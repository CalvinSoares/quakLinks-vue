<!-- src/components/links/LinksSection.vue -->
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white flex items-center">
          Links Adicionados
        </h2>
        <p class="text-slate-400 text-sm mt-1">Gerencie e reorganize seus links da página</p>
      </div>
      <div class="text-sm font-medium text-slate-400">
        {{ links.length }} {{ links.length === 1 ? 'link' : 'links' }}
      </div>
    </div>
    <LinksList :links="links" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" @reorder="$emit('reorder')" />
  </div>
</template>

<script setup lang="ts">
import type { Link } from '@/store/links';
import LinksList from './LinksList.vue';

defineProps<{ links: Link[] }>();
defineEmits<{
  (e: 'edit', link: Link): void;
  (e: 'delete', linkId: string): void;
  (e: 'reorder'): void;
}>();
</script>
