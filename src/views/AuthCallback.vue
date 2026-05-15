<template>
  <div class="flex items-center justify-center h-screen">
    <p>Autenticando, por favor aguarde...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { usePageStore } from "@/store/page";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pageStore = usePageStore();

onMounted(async () => {
  const code = Array.isArray(route.query.code) ? route.query.code[0] : route.query.code;
  const state = Array.isArray(route.query.state) ? route.query.state[0] : route.query.state;
  const providerFromQuery = Array.isArray(route.query.provider)
    ? route.query.provider[0]
    : route.query.provider;
  const providerFromParams = Array.isArray(route.params.provider)
    ? route.params.provider[0]
    : route.params.provider;

  if (!code || !state) {
    router.push("/login?error=missing_oauth_params");
    return;
  }

  try {
    await authStore.completeSocialLogin({
      provider: providerFromQuery?.toString() ?? providerFromParams?.toString() ?? null,
      code: code.toString(),
      state: state.toString(),
    });

    try {
      await pageStore.fetchMyPage();
    } catch (pageError) {
      console.warn("Usuario autenticado, mas sem pagina pronta para edicao.", pageError);
    }

    await router.push("/dashboard/overview");
  } catch (error) {
    console.error("Erro no callback de auth:", error);
    await router.push("/login?error=auth_failed");
  }
});
</script>
