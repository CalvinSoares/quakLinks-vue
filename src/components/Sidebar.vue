<template>
  <div>
    <div :class="isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'" @click="close"
      class="fixed inset-0 z-[70] transition-opacity duration-300 bg-black/80 backdrop-blur-sm lg:hidden"></div>

    <aside :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isCollapsed ? 'lg:w-24' : 'lg:w-72'
    ]" class="fixed z-[80] flex flex-col transition-all duration-300 ease-in-out
             h-[100dvh] top-0 left-0 w-64 bg-slate-900 border-r border-slate-800
             lg:h-[calc(100vh-2rem)] lg:top-4 lg:left-4 lg:rounded-3xl lg:border lg:shadow-2xl lg:shadow-black/50">

      <div class="flex items-center h-20 px-4 flex-shrink-0"
        :class="isCollapsed ? 'justify-center' : 'justify-between'">
        <div class="flex items-center gap-3 overflow-hidden">
          <img src="/duckbio.png" alt="Logo" class="w-8 h-8 object-contain transition-transform hover:scale-110" />
          <h1 v-if="!isCollapsed"
            class="text-xl font-bold tracking-wide text-white whitespace-nowrap transition-opacity duration-300">
            Quack<span class="text-amber-400">Links</span>
          </h1>
        </div>

        <button v-if="!isCollapsed" @click="toggleCollapse"
          class="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
      </div>

      <div v-if="isCollapsed" class="hidden lg:flex justify-center pb-4 border-b border-slate-800/50">
        <button @click="toggleCollapse"
          class="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 rounded-full transition-all">
          <Bars3Icon class="w-6 h-6" />
        </button>
      </div>

      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        <div v-for="item in navItems" :key="item.label" class="relative group/item">
          <component :is="item.children ? 'button' : RouterLink" :to="item.href" @click="handleNavClick(item)"
            class="relative flex items-center w-full p-3 transition-all duration-200 rounded-xl group hover:bg-slate-800"
            :class="[
              isCollapsed ? 'justify-center' : 'justify-start',
              isActiveRoute(item) ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-100'
            ]">
            <component :is="item.icon" class="w-6 h-6 transition-transform duration-300 shrink-0"
              :class="isActiveRoute(item) ? 'scale-110' : 'group-hover:scale-110'" />
            <span v-if="!isCollapsed" class="ml-3 font-medium truncate transition-all duration-300">{{ item.label
            }}</span>
            <ChevronDownIcon v-if="item.children && !isCollapsed"
              class="w-4 h-4 ml-auto transition-transform duration-200"
              :class="{ 'rotate-180': isMenuOpen(item.name) }" />

            <div v-if="isCollapsed"
              class="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-amber-400 text-sm font-medium rounded-lg opacity-0 invisible -translate-x-2 group-hover/item:opacity-100 group-hover/item:visible group-hover/item:translate-x-0 transition-all duration-200 shadow-xl whitespace-nowrap z-50 border border-slate-700">
              {{ item.label }}
            </div>
          </component>

          <div v-if="item.children && isMenuOpen(item.name) && !isCollapsed"
            class="mt-1 ml-4 pl-4 border-l border-slate-700 space-y-1">
            <router-link v-for="child in item.children" :key="child.label" :to="child.href" @click="close"
              class="block px-3 py-2 text-sm rounded-lg transition-colors text-slate-500 hover:text-slate-300">
              {{ child.label }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="p-3 mt-auto border-t border-slate-800/50">

        <div class="relative">

          <button ref="userButtonRef" @click="toggleUserMenu"
            class="flex items-center w-full p-2 rounded-xl transition-all hover:bg-slate-800 group"
            :class="isCollapsed ? 'justify-center' : ''">
            <div class="relative">
              <img
                class="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-amber-400/50 transition-all"
                :src="sidebarAvatarUrl" alt="avatar" />
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>

            <div v-if="!isCollapsed" class="ml-3 overflow-hidden text-left flex-1">
              <h4 class="text-sm font-bold text-slate-200 truncate group-hover:text-white">{{ auth.user?.name }}</h4>
              <p class="text-xs text-slate-500 truncate">Configurações</p>
            </div>

            <Cog6ToothIcon v-if="!isCollapsed"
              class="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </button>


          <div v-if="showUserMenu" ref="userMenuRef"
            class="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-visible z-50 p-1 animate-fade-in-up"
            :class="isCollapsed ? 'left-12 w-56' : 'w-full'">

            <a v-if="pageStore.currentPage" :href="userPageUrl" target="_blank"
              class="flex items-center w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white group"
              :class="!isCollapsed ? '' : 'justify-center'">
              <SparklesIcon v-if="!isCollapsed" class="w-4 h-4 mr-3 text-amber-400 group-hover:animate-pulse" />
              <span v-if="!isCollapsed">{{ copy.userMenu.viewCurrentPage }}</span>
              <span class="ml-auto text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">LIVE</span>
            </a>

            <router-link to="/dashboard/pages"
              class="flex items-center  w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white"
              :class="!isCollapsed ? '' : 'justify-center'">
              <DocumentDuplicateIcon class="w-4 h-4  text-indigo-400" :class="!isCollapsed ? 'mr-3' : ''" />
              <span v-if="!isCollapsed">{{ copy.userMenu.managePages }}</span>
            </router-link>

            <router-link to="/settings"
              class="flex items-center w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white"
              :class="!isCollapsed ? '' : 'justify-center'">
              <Cog6ToothIcon class="w-4 h-4  text-slate-400" :class="!isCollapsed ? 'mr-3' : ''" />
              <span v-if="!isCollapsed">{{ copy.userMenu.settings }}</span>
            </router-link>

            <div class="px-3 py-2.5" :class="!isCollapsed ? '' : 'flex justify-center'">
              <button ref="languageButtonRef" type="button" @click.stop="toggleLanguageMenu"
                class="flex items-center w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                :class="!isCollapsed ? '' : 'justify-center'">
                <LanguageIcon class="w-4 h-4 text-sky-400" :class="!isCollapsed ? 'mr-3' : ''" />
                <span v-if="!isCollapsed">{{ copy.userMenu.language }}</span>
                <ChevronDownIcon v-if="!isCollapsed" class="w-4 h-4 ml-auto text-slate-500"
                  :class="{ 'rotate-180': showLanguageMenu }" />
              </button>
            </div>

            <div class="h-px bg-slate-700 my-1 mx-2"></div>

            <button @click="auth.logout"
              class="flex items-center w-full px-3 py-2.5 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              :class="!isCollapsed ? '' : 'justify-center'">
              <ArrowLeftEndOnRectangleIcon class="w-4 h-4 " :class="!isCollapsed ? 'mr-3' : ''" /> <span
                v-if="!isCollapsed">{{ copy.userMenu.logout }}</span>
            </button>
          </div>

          <div v-if="showUserMenu && showLanguageMenu" ref="languageMenuRef"
            class="absolute rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl shadow-black/40 z-[70] animate-fade-in-up"
            :class="isCollapsed ? 'bottom-full left-[calc(100%+0.75rem)] w-72' : 'bottom-0 left-[calc(100%+0.75rem)] w-72'">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-white">{{ copy.userMenu.language }}</p>
                <p class="text-xs text-slate-400">{{ copy.userMenu.languageHint }}</p>
              </div>
              <button type="button" @click.stop="showLanguageMenu = false"
                class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
            <LanguageSwitcher @changed="handleLanguageChanged" />
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { RouterLink } from 'vue-router';
import { useAppLanguage } from '@/composables/useAppLanguage';
import { resolveAvatarUrl } from '@/utils/avatar';
import {
  UserCircleIcon, SwatchIcon, RectangleStackIcon,
  ChevronDownIcon, ChevronLeftIcon, Bars3Icon,
  SparklesIcon, ArrowLeftEndOnRectangleIcon, Cog6ToothIcon, CreditCardIcon,
  LanguageIcon, XMarkIcon
} from '@heroicons/vue/24/outline';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{ isOpen: boolean, isCollapsed: boolean; }>();

const emit = defineEmits<{
  (e: 'closeSidebar'): void;
  (e: 'toggleCollapse'): void;
}>();
const route = useRoute();
const auth = useAuthStore();
const pageStore = usePageStore();
const { locale } = useAppLanguage();

const openMenu = ref('account');
const showUserMenu = ref(false);
const showLanguageMenu = ref(false);


const userMenuRef = ref<HTMLElement | null>(null);
const userButtonRef = ref<HTMLElement | null>(null);
const languageMenuRef = ref<HTMLElement | null>(null);
const languageButtonRef = ref<HTMLElement | null>(null);

function close() {
  emit('closeSidebar');
}

function toggleCollapse() {
  emit('toggleCollapse');
  if (!props.isCollapsed) {
    showUserMenu.value = false;
  }
}

function closeMobile() {
  if (window.innerWidth < 1024) close();
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
  if (!showUserMenu.value) {
    showLanguageMenu.value = false;
  }
}

function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value;
}

function handleLanguageChanged() {
  showLanguageMenu.value = false;
}


const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (
    showLanguageMenu.value &&
    languageMenuRef.value && !languageMenuRef.value.contains(target) &&
    languageButtonRef.value && !languageButtonRef.value.contains(target)
  ) {
    showLanguageMenu.value = false;
  }

  if (
    showUserMenu.value &&
    userMenuRef.value && !userMenuRef.value.contains(target) &&
    !(languageMenuRef.value && languageMenuRef.value.contains(target)) &&
    userButtonRef.value && !userButtonRef.value.contains(target)
  ) {
    showUserMenu.value = false;
    showLanguageMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const sidebarAvatarUrl = computed(() => {
  return resolveAvatarUrl({
    name: auth.user?.name,
    userImage: auth.user?.image,
    pageAvatarUrl: pageStore.currentPage?.avatarUrl,
  });
});

const translations = {
  pt: {
    nav: {
      account: 'Conta',
      overview: 'Visão geral',
      analytics: 'Analytics',
      settings: 'Configurações',
      pages: 'Minhas páginas',
      appearance: 'Aparência',
      templates: 'Templates',
      plans: 'Planos',
    },
    userMenu: {
      viewCurrentPage: 'Ver página atual',
      managePages: 'Gerenciar páginas',
      settings: 'Configurações',
      language: 'Idioma',
      languageHint: 'Escolha como o painel deve aparecer.',
      logout: 'Sair',
    },
  },
  en: {
    nav: {
      account: 'Account',
      overview: 'Overview',
      analytics: 'Analytics',
      settings: 'Settings',
      pages: 'My Pages',
      appearance: 'Appearance',
      templates: 'Templates',
      plans: 'Plans',
    },
    userMenu: {
      viewCurrentPage: 'View current page',
      managePages: 'Manage pages',
      settings: 'Settings',
      language: 'Language',
      languageHint: 'Choose how the dashboard should appear.',
      logout: 'Logout',
    },
  },
  es: {
    nav: {
      account: 'Cuenta',
      overview: 'Resumen',
      analytics: 'Analytics',
      settings: 'Configuración',
      pages: 'Mis páginas',
      appearance: 'Apariencia',
      templates: 'Templates',
      plans: 'Planes',
    },
    userMenu: {
      viewCurrentPage: 'Ver página actual',
      managePages: 'Administrar páginas',
      settings: 'Configuración',
      language: 'Idioma',
      languageHint: 'Elige cómo debe mostrarse el panel.',
      logout: 'Salir',
    },
  },
} as const;

const copy = computed(() => translations[locale.value]);

const navItems = computed(() => [
  {
    label: copy.value.nav.account,
    name: 'account',
    icon: UserCircleIcon,
    basePath: '/dashboard',
    children: [
      { label: copy.value.nav.overview, href: '/dashboard/overview' },
      { label: copy.value.nav.analytics, href: '/analytics' },
      { label: copy.value.nav.settings, href: '/settings' },
    ],
  },
  { label: copy.value.nav.pages, href: '/dashboard/pages', name: 'pages', icon: DocumentDuplicateIcon },
  { label: copy.value.nav.appearance, href: '/dashboard/appearance', name: 'appearance', icon: SwatchIcon },
  { label: copy.value.nav.templates, href: '/dashboard/templates', name: 'templates', icon: RectangleStackIcon },
  { label: copy.value.nav.plans, href: '/dashboard/plans', name: 'plans', icon: CreditCardIcon },
]);

function handleNavClick(item: any) {
  if (item.children) {
    if (props.isCollapsed) {
      emit('toggleCollapse');
      setTimeout(() => { openMenu.value = item.name }, 100);
    } else {
      toggleMenu(item.name);
    }
  } else {
    closeMobile();
  }
}

const isActiveRoute = (item: any) => {
  if (item.href && route.path === item.href) return true;
  if (item.children) {
    return item.children.some((child: any) => route.path === child.href);
  }
  return false;
};

const userPageUrl = computed(() => {
  const slug = pageStore.currentPage?.slug;
  return slug ? `/${slug}` : '#';
});

const toggleMenu = (menuName: string) => {
  openMenu.value = openMenu.value === menuName ? '' : menuName;
};

const isMenuOpen = (menuName: string) => {
  return openMenu.value === menuName;
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
