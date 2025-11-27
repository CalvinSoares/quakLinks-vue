<template>
  <div class="flex items-center justify-center h-screen">
    <p>Autenticando, por favor aguarde...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pageStore = usePageStore();

onMounted(async () => {
  const token = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token;

  if (token) {
    // A action setToken deve salvar o token no localStorage e no state
    authStore.setToken(token);
    // Após salvar o token, busca os dados do usuário
    await Promise.all([
      authStore.fetchUser(),
      pageStore.fetchMyPage() // <-- Busca a página ao mesmo tempo
    ]);
    // Redireciona para o dashboard
    router.push('/dashboard/overview');
  } else {
    // Se não houver token, redireciona de volta para a página de login com um erro
    router.push('/login?error=auth_failed');
  }
});
</script>