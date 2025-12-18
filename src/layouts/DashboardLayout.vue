<template>
  <div class="flex min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 relative overflow-hidden">

    <div class="fixed inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <div v-for="flake in snowflakes" :key="flake.id" class="absolute bg-white rounded-full opacity-80"
        :style="flake.style"></div>
    </div>

    <Sidebar :is-open="isMobileOpen" :is-collapsed="isDesktopCollapsed" @close-sidebar="isMobileOpen = false"
      @toggle-collapse="isDesktopCollapsed = !isDesktopCollapsed" />

    <div class="flex flex-col flex-1 min-h-screen w-full transition-all duration-300 ease-in-out"
      :class="isDesktopCollapsed ? 'lg:pl-32' : 'lg:pl-80'">
      <DashboardHeader class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
        :is-sidebar-open="isMobileOpen" @toggle-sidebar="isMobileOpen = !isMobileOpen" />

      <main class="flex-1 p-4 lg:p-8 overflow-x-hidden relative z-50">
        <div class="max-w-7xl mx-auto animate-fade-in">
          <slot />
        </div>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';

const isMobileOpen = ref(false);
const isDesktopCollapsed = ref(false);
const authStore = useAuthStore();
const pageStore = usePageStore();


interface Snowflake {
  id: number;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
    opacity: number;
    animationName: string;
    animationDuration: string;
    animationDelay: string;
  };
}

const snowflakes = ref<Snowflake[]>([]);

const generateSnow = () => {
  const count = 70;
  const newFlakes: Snowflake[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 20;

    newFlakes.push({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `-10px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: Math.random() * 0.5 + 0.3,
        animationName: 'snowfall',
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * 20}s`
      }
    });
  }
  snowflakes.value = newFlakes;
};

onMounted(async () => {

  generateSnow();

  if (authStore.isAuthenticated) {
    await authStore.fetchUser();
    await pageStore.fetchMyPage();
  }
});
</script>

<style>
@keyframes snowfall {
  0% {
    transform: translateY(-10px) translateX(0);
  }

  25% {
    transform: translateY(25vh) translateX(15px);
    /* Balanço para direita */
  }

  50% {
    transform: translateY(50vh) translateX(-15px);
    /* Balanço para esquerda */
  }

  75% {
    transform: translateY(75vh) translateX(15px);
  }

  100% {
    transform: translateY(105vh) translateX(0);
  }
}

.fixed div {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}


::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 99px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #fbbf24;
}

.main-wrapper a,
.main-wrapper button,
.main-wrapper [role="button"] {
  cursor: pointer !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}
</style>