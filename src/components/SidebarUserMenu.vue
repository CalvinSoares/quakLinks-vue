<template>
  <div class="px-4 py-3 border-t border-slate-800/50">
    <button 
      @click="toggleMenu"
      class="flex items-center w-full px-3 py-2.5 rounded-lg transition-all hover:bg-slate-800/50"
    >
      <img class="w-10 h-10 rounded-full object-cover" :src="avatar" alt="avatar" />
      <div class="ml-3 overflow-hidden flex-1">
        <h4 class="text-sm font-semibold text-white truncate">{{ user?.name }}</h4>
        <p class="text-xs text-slate-400">/{{ userSlug }}</p>
      </div>
      <ChevronDownIcon class="w-4 h-4 text-slate-400" />
    </button>

    <div v-show="showUserMenu" class="absolute bottom-full mb-2 left-4 right-4 bg-slate-800/95 border border-slate-700/50 rounded-lg overflow-hidden shadow-xl z-50">
      <router-link to="/settings" class="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-amber-400/10 hover:text-amber-400">
        <Cog6ToothIcon class="w-4 h-4 mr-3" />
        Configurações
      </router-link>
      <button @click="handleLogout" class="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400">
        <ArrowLeftEndOnRectangleIcon class="w-4 h-4 mr-3" />
        Sair
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useRouter } from 'vue-router';
import { Cog6ToothIcon, ChevronDownIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/outline';

const auth = useAuthStore();
const pageStore = usePageStore();
const router = useRouter();
const showUserMenu = ref(false);

const user = computed(() => auth.user);
const userSlug = computed(() => pageStore.currentPage?.slug || '');
const avatar = computed(() => 
  pageStore.currentPage?.avatarUrl || `https://ui-avatars.com/api/?name=${auth.user?.name}&background=fbbd24&color=1e293b&bold=true`
);

const toggleMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  await auth.logout();
  router.push('/');
};
</script>
