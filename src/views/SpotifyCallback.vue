<template>
  <div class="flex items-center justify-center h-screen">
    <p>Conectando Spotify, por favor aguarde...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSpotifyStore } from "@/store/spotify";

const route = useRoute();
const router = useRouter();
const spotifyStore = useSpotifyStore();

onMounted(async () => {
  const code = Array.isArray(route.query.code) ? route.query.code[0] : route.query.code;
  const state = Array.isArray(route.query.state) ? route.query.state[0] : route.query.state;

  if (!code || !state) {
    await router.push("/dashboard/overview?error=missing_spotify_params");
    return;
  }

  try {
    await spotifyStore.completeConnection({
      code: code.toString(),
      state: state.toString(),
    });
    await router.push("/dashboard/overview?spotify=connected");
  } catch (error) {
    console.error("Erro ao concluir conexao com Spotify:", error);
    await router.push("/dashboard/overview?spotify=failed");
  }
});
</script>
