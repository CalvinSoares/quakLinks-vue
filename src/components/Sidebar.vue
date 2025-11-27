<template>
  <div>
    <!-- Fundo Overlay para Mobile -->
    <div :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="close"
      class="fixed inset-0 z-20 transition-opacity duration-300 bg-black/70 backdrop-blur-sm lg:hidden"></div>

    <!-- Conteúdo da Sidebar -->
    <div :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-30 flex flex-col w-64 h-full transition-transform duration-300 ease-in-out transform bg-slate-900 border-r border-slate-800 lg:translate-x-0 lg:static lg:h-screen">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-6 border-b border-slate-800 flex-shrink-0">
        <img src="/duckbio.png" alt="QuackLinks Logo" class="w-9 h-7" />
        <h1 class="ml-3 text-2xl font-bold tracking-wider text-white">Quack<span class="text-amber-400">Links</span>
        </h1>
      </div>

      <!-- Navegação Principal -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div v-for="item in navItems" :key="item.label">
          <!-- Item Principal (com ou sem submenu) -->
          <component :is="item.children ? 'button' : RouterLink" :to="item.href" @click="handleNavClick(item)"
            class="relative flex items-center w-full px-4 py-3 text-left text-slate-300 transition-colors duration-200 rounded-lg group hover:bg-slate-800 hover:text-white"
            :class="{ 'bg-slate-800': isMenuOpen(item.name) }">
            <div class="absolute left-0 w-1 h-0 transition-all duration-300 rounded-r-full bg-amber-400 group-hover:h-6"
              :class="{ 'h-8': $route.path.startsWith(item.basePath || item.href || '') }"></div>
            <component :is="item.icon" class="w-6 h-6 transition-transform duration-200 shrink-0 group-hover:scale-110"
              :class="$route.path.startsWith(item.basePath || item.href || '') ? 'text-amber-400' : 'text-slate-400'" />
            <span class="ml-4 flex-1">{{ item.label }}</span>
            <ChevronDownIcon v-if="item.children" class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': isMenuOpen(item.name) }" />
          </component>

          <!-- Submenu -->
          <div v-if="item.children && isMenuOpen(item.name)"
            class="mt-1 ml-5 pl-4 border-l-2 border-slate-700/50 space-y-1">
            <router-link v-for="child in item.children" :key="child.label" :to="child.href" @click="close" custom
              v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate"
                class="flex items-center w-full px-4 py-2.5 text-sm rounded-lg transition-colors"
                :class="isActive ? 'font-semibold text-white' : 'text-slate-400 hover:text-white'">
                {{ child.label }}
              </a>
            </router-link>
          </div>
        </div>
        <UpgradeToPremium v-if="!auth.isPremium" />

      </nav>


      <!-- Ações e Perfil -->
      <div class="px-4 py-4 space-y-2 border-t border-slate-800 flex-shrink-0">
        <a href="#"
          class="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-sky-500/10 hover:text-sky-400">
          <QuestionMarkCircleIcon class="w-5 h-5 mr-3" />
          Central de Ajuda
        </a>
        <router-link :to="userPageUrl" target="_blank"
          class="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-amber-400/10 hover:text-amber-400">
          <SparklesIcon class="w-5 h-5 mr-3" />
          Minha Página
        </router-link>
      </div>

      <div class="px-4 py-3 border-t border-slate-800">
        <div v-if="auth.user" class="flex items-center">
          <img class="w-10 h-10 rounded-full object-cover" :src="sidebarAvatarUrl" alt="avatar" />
          <div class="ml-3 overflow-hidden">
            <h4 class="text-sm font-semibold text-white truncate">{{ auth.user.name }}</h4>
            <p v-if="pageStore.currentPage?.slug" class="text-xs text-slate-400 truncate">/{{ pageStore.currentPage.slug
              }}</p>
          </div>
          <button @click="auth.logout" title="Logout"
            class="p-2 ml-auto text-slate-400 rounded-md shrink-0 hover:bg-red-500/20 hover:text-red-400">
            <ArrowLeftEndOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { RouterLink } from 'vue-router';
import {
  UserCircleIcon, LinkIcon, SwatchIcon, ChartBarIcon, Cog6ToothIcon,
  ChevronDownIcon, QuestionMarkCircleIcon, SparklesIcon, ArrowLeftEndOnRectangleIcon,
  RectangleStackIcon,
} from '@heroicons/vue/24/outline';
import UpgradeToPremium from './dashboard/UpgradeToPremium.vue';

defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{
  (e: 'closeSidebar'): void
}>();

function close() {
  emit('closeSidebar');
}


const auth = useAuthStore();
const pageStore = usePageStore();
const openMenu = ref('account'); // Mantém o menu 'account' aberto por padrão

const sidebarAvatarUrl = computed(() => {
  // Prioridade 1: Avatar do Discord, se o usuário optou por usá-lo E ele existe no `auth.user`
  if (auth.user?.useDiscordAvatar && auth.user.discordAvatarUrl) {
    return auth.user.discordAvatarUrl;
  }

  // Prioridade 2: Avatar customizado, se foi feito upload (vem da `pageStore`)
  if (pageStore.currentPage?.avatarUrl) {
    return pageStore.currentPage.avatarUrl;
  }

  // Prioridade 3 (Fallback): Avatar gerado com o nome do usuário
  if (auth.user?.name) {
    return `https://ui-avatars.com/api/?name=${auth.user.name}&background=fbbd24&color=1e293b&bold=true`;
  }

  // Fallback final se nada estiver disponível
  return 'https://via.placeholder.com/40';
});

const navItems = ref([
  {
    label: 'Account',
    name: 'account',
    icon: UserCircleIcon,
    basePath: '/dashboard',
    children: [
      { label: 'Overview', href: '/dashboard/overview' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Settings', href: '/settings' },
    ],
  },
  { label: 'Links', href: '/links', name: 'links', icon: LinkIcon },
  { label: 'Appearance', href: '/dashboard/appearance', name: 'appearance', icon: SwatchIcon },
  { label: 'Templates', href: '/dashboard/templates', name: 'templates', icon: RectangleStackIcon },
]);

function handleNavClick(item: typeof navItems.value[0]) {

  if (item.children) {
    // Se for um menu com filhos, apenas abre/fecha o submenu
    toggleMenu(item.name);
  } else {
    // Se for um link direto, fecha a sidebar (no mobile)
    close();
  }
}

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