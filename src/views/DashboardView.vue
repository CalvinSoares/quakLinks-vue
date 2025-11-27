<template>
  <DashboardLayout>
    <div v-if="auth.user">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Bem-vindo, {{ auth.user.name }}!</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Este é o seu dashboard. Apenas usuários logados podem ver esta página.</p>
      
      <div class="p-6 mt-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md">
        <h3 class="font-semibold text-gray-800 dark:text-white">Seus Dados:</h3>
        <p class="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {{ auth.user.email }}</p>
        <p class="text-gray-600 dark:text-gray-300"><strong>ID:</strong> {{ auth.user.id }}</p>
      </div>
      

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import DashboardLayout from '@/layouts/DashboardLayout.vue'; 

const auth = useAuthStore();

</script>