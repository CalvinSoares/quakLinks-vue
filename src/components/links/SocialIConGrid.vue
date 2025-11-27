<!-- src/components/links/SocialIconGrid.vue -->
<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-gradient-to-br from-amber-400/20 to-amber-400/5 rounded-xl border border-amber-400/30">
          <LinkIcon class="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Adicionar Redes Sociais</h1>
          <p class="text-slate-400">Escolha um perfil social para adicionar à sua página</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      <!-- Social Icons -->
      <button
        v-for="social in socialProfiles"
        :key="social.name"
        @click="$emit('select', social)"
        class="group relative aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 overflow-hidden"
        :aria-label="`Adicionar ${social.name}`"
      >
        <!-- Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-amber-500/20 group-hover:to-orange-600/20 transition-all duration-300"></div>

        <!-- Border Animated -->
        <div class="absolute inset-0 rounded-2xl border border-slate-700/50 group-hover:border-amber-400/50 transition-all duration-300"></div>

        <!-- Shine Effect -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"></div>

        <!-- Icon Container -->
        <div class="relative z-10 flex items-center justify-center">
          <component
            :is="social.icon"
            class="w-8 h-8 text-slate-300 group-hover:text-amber-400 transition-all duration-300 group-hover:scale-110"
          />
        </div>

        <!-- Label on Hover -->
        <div
          class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300 text-xs font-semibold text-amber-400 whitespace-nowrap"
        >
          {{ social.name }}
        </div>
      </button>

      <!-- Custom Link Button -->
      <button
        @click="$emit('select', customLinkSocial)"
        class="group relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 overflow-hidden"
        aria-label="Adicionar URL Customizada"
      >
        <!-- Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-slate-900 group-hover:from-sky-500/30 group-hover:to-slate-800 transition-all duration-300"></div>

        <!-- Border Animated -->
        <div class="absolute inset-0 rounded-2xl border border-sky-500/30 group-hover:border-sky-400/70 transition-all duration-300"></div>

        <!-- Shine Effect -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"></div>

        <!-- Icon Container -->
        <div class="relative z-10 flex items-center justify-center">
          <component :is="customLinkSocial.icon" class="w-8 h-8 text-sky-300 group-hover:text-sky-400 transition-all duration-300 group-hover:scale-110" />
        </div>

        <!-- Label -->
        <div class="text-xs mt-1 font-medium text-sky-300 group-hover:text-sky-400 transition-colors duration-300">Custom</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GifIcon, LinkIcon } from 'vue-tabler-icons';
import { socialProfiles, customLinkSocial, type Social } from './social';
defineEmits<{ (e: 'select', social: Social): void }>();
</script>
