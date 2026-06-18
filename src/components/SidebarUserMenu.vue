<template>
  <div class="px-4 py-3 border-t border-slate-800/50">
    <button @click="toggleMenu"
      class="flex items-center w-full px-3 py-2.5 rounded-lg transition-all hover:bg-slate-800/50">
      <img class="w-10 h-10 rounded-full object-cover" :src="avatar" alt="avatar" />
      <div class="ml-3 overflow-hidden flex-1">
        <h4 class="text-sm font-semibold text-white truncate">{{ user?.name }}</h4>
        <p class="text-xs text-slate-400">/{{ userSlug }}</p>
      </div>
      <ChevronDownIcon class="w-4 h-4 text-slate-400" />
    </button>

    <div v-show="showUserMenu"
      class="absolute bottom-full mb-2 left-4 right-4 bg-slate-800/95 border border-slate-700/50 rounded-lg overflow-visible shadow-xl z-50">
      <router-link to="/settings"
        class="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-amber-400/10 hover:text-amber-400">
        <Cog6ToothIcon class="w-4 h-4 mr-3" />
        {{ copy.settings }}
      </router-link>
      <div class="border-t border-slate-700/50">
        <button ref="languageButtonRef" type="button" @click.stop="toggleLanguageMenu"
          class="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors">
          <LanguageIcon class="w-4 h-4 mr-3 text-sky-400" />
          {{ copy.language }}
          <ChevronDownIcon class="w-4 h-4 ml-auto transition-transform" :class="{ 'rotate-180': showLanguageMenu }" />
        </button>

      </div>
      <button @click="handleLogout"
        class="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400">
        <ArrowLeftEndOnRectangleIcon class="w-4 h-4 mr-3" />
        {{ copy.logout }}
      </button>
    </div>

    <div v-if="showUserMenu && showLanguageMenu" ref="languageMenuRef"
      class="absolute bottom-full left-[calc(100%+0.75rem)] mb-2 w-72 rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl shadow-black/40 z-[60]">
      <div class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-white">{{ copy.language }}</p>
          <p class="text-xs text-slate-400">{{ copy.languageHint }}</p>
        </div>
        <button type="button" @click.stop="showLanguageMenu = false"
          class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      <LanguageSwitcher @changed="handleLanguageChanged" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useRouter } from 'vue-router';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useAppLanguage } from '@/composables/useAppLanguage';
import { Cog6ToothIcon, ChevronDownIcon, ArrowLeftEndOnRectangleIcon, LanguageIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { resolveAvatarUrl } from '@/utils/avatar';

const auth = useAuthStore();
const pageStore = usePageStore();
const router = useRouter();
const showUserMenu = ref(false);
const showLanguageMenu = ref(false);
const languageMenuRef = ref<HTMLElement | null>(null);
const languageButtonRef = ref<HTMLElement | null>(null);
const { locale } = useAppLanguage();

const user = computed(() => auth.user);
const userSlug = computed(() => pageStore.currentPage?.slug || '');
const avatar = computed(() =>
  resolveAvatarUrl({
    name: auth.user?.name,
    userImage: auth.user?.image,
    pageAvatarUrl: pageStore.currentPage?.avatarUrl,
  })
);

const copy = computed(() => {
  switch (locale.value) {
    case 'en':
      return {
        settings: 'Settings',
        language: 'Language',
        languageHint: 'Choose how the panel should appear.',
        logout: 'Logout',
      };
    case 'es':
      return {
        settings: 'Configuracion',
        language: 'Idioma',
        languageHint: 'Elige como debe mostrarse el panel.',
        logout: 'Salir',
      };
    default:
      return {
        settings: 'Configuracoes',
        language: 'Idioma',
        languageHint: 'Escolha como o painel deve aparecer.',
        logout: 'Sair',
      };
  }
});

const toggleMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (!showUserMenu.value) {
    showLanguageMenu.value = false;
  }
};

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};

const handleLanguageChanged = () => {
  showLanguageMenu.value = false;
};

const handleLogout = async () => {
  await auth.logout();
  router.push('/');
};
</script>
