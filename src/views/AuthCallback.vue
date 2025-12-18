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
    authStore.setToken(token);
    try {
      await authStore.fetchUser();

      if (authStore.user) {
        try {
          await pageStore.fetchMyPage();
        } catch (pageError) {
          console.warn("Usuário logado, mas erro ao buscar página (pode ser novo usuário):", pageError);
        }
        router.push('/dashboard/overview');

      } else {
        throw new Error("Falha ao recuperar usuário");
      }
    } catch (e) {
      console.error("Erro no callback de auth:", e);
      router.push('/login?error=auth_failed');
    }
  } else {
    router.push('/login?error=no_token');
  }
});
</script>