<template>
  <div class="flex h-screen bg-slate-950 text-white">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />

    <div class="flex flex-col flex-1 w-full overflow-hidden">

      <DashboardHeader :is-sidebar-open="isSidebarOpen" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Conteúdo da Página com Scroll -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-slate-950/80 p-6 lg:p-8">
        <slot />
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

const isSidebarOpen = ref(false);
const authStore = useAuthStore();
const pageStore = usePageStore();

// Carrega os dados essenciais quando o layout é montado
onMounted(async () => {
  if (authStore.isAuthenticated) {
    // Garante que temos os dados do usuário e da página
    await authStore.fetchUser();
    await pageStore.fetchMyPage();
  }
});
</script>

<style>
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