<template>
  <div>
    <div :class="isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'" @click="close"
      class="fixed inset-0 z-40 transition-opacity duration-300 bg-black/80 backdrop-blur-sm lg:hidden"></div>

    <aside :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isCollapsed ? 'lg:w-24' : 'lg:w-72'
    ]" class="fixed z-50 flex flex-col transition-all duration-300 ease-in-out
             h-[100dvh] top-0 left-0 w-64 bg-slate-900 border-r border-slate-800
             lg:h-[calc(100vh-2rem)] lg:top-4 lg:left-4 lg:rounded-3xl lg:border lg:shadow-2xl lg:shadow-black/50">

      <div class="flex items-center h-20 px-4 flex-shrink-0"
        :class="isCollapsed ? 'justify-center' : 'justify-between'">
        <div class="flex items-center gap-3 overflow-hidden">
          <img src="/ducklogonatal.png" alt="Logo"
            class="w-8 h-8 object-contain transition-transform hover:scale-110" />
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
            class="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1 animate-fade-in-up"
            :class="isCollapsed ? 'left-12 w-56' : 'w-full'">

            <a v-if="pageStore.currentPage" :href="`/${pageStore.currentPage.slug}`" target="_blank"
              class="flex items-center w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white group"
              :class="!isCollapsed ? '' : 'justify-center'">
              <SparklesIcon v-if="!isCollapsed" class="w-4 h-4 mr-3 text-amber-400 group-hover:animate-pulse" />
              <span v-if="!isCollapsed">Ver Página Atual</span>
              <span class="ml-auto text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">LIVE</span>
            </a>

            <router-link to="/dashboard/pages"
              class="flex items-center  w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white"
              :class="!isCollapsed ? '' : 'justify-center'">
              <DocumentDuplicateIcon class="w-4 h-4  text-indigo-400" :class="!isCollapsed ? 'mr-3' : ''" />
              <span v-if="!isCollapsed">Gerenciar Páginas</span>
            </router-link>

            <router-link to="/settings"
              class="flex items-center w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white"
              :class="!isCollapsed ? '' : 'justify-center'">
              <Cog6ToothIcon class="w-4 h-4  text-slate-400" :class="!isCollapsed ? 'mr-3' : ''" />
              <span v-if="!isCollapsed">Configurações</span>
            </router-link>

            <div class="h-px bg-slate-700 my-1 mx-2"></div>

            <button @click="auth.logout"
              class="flex items-center w-full px-3 py-2.5 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              :class="!isCollapsed ? '' : 'justify-center'">
              <ArrowLeftEndOnRectangleIcon class="w-4 h-4 " :class="!isCollapsed ? 'mr-3' : ''" /> <span
                v-if="!isCollapsed">Sair</span>
            </button>
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
import { RouterLink } from 'vue-router';
import {
  UserCircleIcon, SwatchIcon, RectangleStackIcon,
  ChevronDownIcon, ChevronLeftIcon, Bars3Icon,
  SparklesIcon, ArrowLeftEndOnRectangleIcon, Cog6ToothIcon
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

const openMenu = ref('account');
const showUserMenu = ref(false);


const userMenuRef = ref<HTMLElement | null>(null);
const userButtonRef = ref<HTMLElement | null>(null);

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
}


const handleClickOutside = (event: MouseEvent) => {
  if (showUserMenu.value) {
    const target = event.target as HTMLElement;

    if (
      userMenuRef.value && !userMenuRef.value.contains(target) &&
      userButtonRef.value && !userButtonRef.value.contains(target)
    ) {
      showUserMenu.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});


const sidebarAvatarUrl = computed(() => {
  if (auth.user?.image) {
    return auth.user.image;
  }
  if (pageStore.currentPage?.avatarUrl) {
    return pageStore.currentPage.avatarUrl;
  }
  if (auth.user?.name) {
    return `https://ui-avatars.com/api/?name=${auth.user.name}&background=fbbd24&color=1e293b&bold=true`;
  }
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
  { label: 'My Pages', href: '/dashboard/pages', name: 'pages', icon: DocumentDuplicateIcon },
  { label: 'Appearance', href: '/dashboard/appearance', name: 'appearance', icon: SwatchIcon },
  { label: 'Templates', href: '/dashboard/templates', name: 'templates', icon: RectangleStackIcon },
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>