<!-- src/components/links/LinksList.vue -->
<template>
  <div>
    <!-- Estado Vazio -->
    <div
      v-if="!links || links.length === 0"
      class="relative overflow-hidden rounded-2xl border border-dashed border-slate-600/50 p-12"
    >
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-slate-900/20"></div>

      <!-- Content -->
      <div class="relative text-center">
        <div class="flex justify-center mb-4">
          <div class="p-4 bg-slate-800/50 rounded-full">
            <component :is="LinkIcon" class="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <p class="text-lg font-semibold text-slate-400 mb-2">Nenhum link adicionado ainda</p>
        <p class="text-sm text-slate-500">Use a grade de ícones acima para começar a adicionar seus links</p>
      </div>
    </div>

    <!-- Lista de Links -->
    <draggable
      v-else
      v-model="draggableLinks"
      tag="ul"
      item-key="id"
      handle=".handle"
      @end="$emit('reorder')"
      class="space-y-3"
      animation="200"
    >
      <template #item="{ element: link, index }">
        <li
          class="group relative overflow-hidden rounded-2xl transition-all duration-300"
          :style="{ '--stagger': `${index * 50}ms` }"
        >
          <!-- Background Gradient Animado -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-800 to-slate-900 group-hover:from-amber-500/5 group-hover:via-slate-800 group-hover:to-sky-500/5 transition-all duration-300"
          ></div>

          <!-- Border com Gradiente -->
          <div
            class="absolute inset-0 rounded-2xl border border-slate-700/30 group-hover:border-amber-400/50 transition-all duration-300"
          ></div>

          <!-- Shine Effect -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          ></div>

          <!-- Main Content -->
          <div class="relative p-4 flex items-center gap-4">
            <!-- Handle (Drag) -->
            <button
              class="flex-shrink-0 p-2 text-slate-600 hover:text-amber-400 transition-all duration-200 group-hover:bg-slate-700/50 rounded-lg handle cursor-move"
              aria-label="Arrastar para reordenar"
            >
              <component :is="GripVerticalIcon" class="w-5 h-5" />
            </button>

            <!-- Icon Social -->
            <div class="flex-shrink-0 p-3 bg-slate-900/50 group-hover:bg-amber-500/10 rounded-xl transition-all duration-300">
              <component :is="getLinkIcon(link)" class="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
            </div>

            <!-- Link Info -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white truncate group-hover:text-amber-100 transition-colors">{{ link.title }}</p>
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-slate-400 hover:text-sky-400 transition-colors truncate block group-hover:text-sky-300"
              >
                {{ formatUrl(link.url) }}
              </a>
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
              <!-- Edit Button -->
              <button
                @click="$emit('edit', link)"
                class="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/70 rounded-lg transition-all duration-200"
                aria-label="Editar link"
              >
                <component :is="PencilIcon" class="w-5 h-5" />
              </button>

              <!-- Delete Button -->
              <button
                @click="$emit('delete', link.id)"
                class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                aria-label="Deletar link"
              >
                <component :is="TrashIcon" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </li>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Link } from '@/store/links';
import draggable from 'vuedraggable';
import { GripVerticalIcon, PencilIcon, TrashIcon, LinkIcon } from 'vue-tabler-icons';
import {
  BrandGithubIcon,
  BrandInstagramIcon,
  BrandTwitterIcon,
  BrandYoutubeIcon,
  BrandTiktokIcon,
  BrandTwitchIcon,
  BrandDiscordIcon,
  BrandLinkedinIcon,
  BrandSpotifyIcon,
} from 'vue-tabler-icons';

const props = defineProps<{ links: Link[] }>();

const emit = defineEmits<{
  (e: 'edit', link: Link): void;
  (e: 'delete', linkId: string): void;
  (e: 'reorder'): void;
}>();

const draggableLinks = computed({
  get: () => props.links,
  set: () => {
    // Handled by draggable
  },
});

function getLinkIcon(link: Link) {
  const iconMap: Record<string, any> = {
    github: BrandGithubIcon,
    instagram: BrandInstagramIcon,
    twitter: BrandTwitterIcon,
    youtube: BrandYoutubeIcon,
    tiktok: BrandTiktokIcon,
    twitch: BrandTwitchIcon,
    discord: BrandDiscordIcon,
    linkedin: BrandLinkedinIcon,
    spotify: BrandSpotifyIcon,
  };

  const title = link.title.toLowerCase();
  return Object.keys(iconMap).some((key) => title.includes(key)) ? iconMap[Object.keys(iconMap).find((key) => title.includes(key))!] : LinkIcon;
}

function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch {
    return url;
  }
}
</script>
