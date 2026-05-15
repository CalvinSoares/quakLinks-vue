<template>
  <Modal :is-open="true" title="Spotify" @close="$emit('close')">
    <div class="flex flex-col h-full">
      <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div v-if="spotifyStore.isLoading" class="flex items-center justify-center h-full text-center p-8">
          <div>
            <span class="animate-spin ..."></span> Verificando conexao...
          </div>
        </div>

        <div v-else-if="!spotifyStore.isConnected" class="flex items-center justify-center h-full text-center p-8">
          <div class="space-y-4">
            <p class="text-slate-400">
              Conecte sua conta do Spotify para sincronizar o perfil no produto.
            </p>
            <button @click="handleConnect"
              class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full">
              Conectar com Spotify
            </button>
          </div>
        </div>

        <div v-else class="space-y-5">
          <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div class="flex items-center gap-4">
              <img v-if="spotifyStore.connection?.avatarUrl" :src="spotifyStore.connection.avatarUrl"
                class="h-16 w-16 rounded-full object-cover" alt="Avatar do Spotify" />
              <div class="space-y-1 text-left">
                <p class="text-lg font-semibold text-white">
                  {{ spotifyStore.connection?.spotifyUserName || "Conta conectada" }}
                </p>
                <p class="text-sm text-slate-400">
                  {{ spotifyStore.connection?.spotifyUserEmail || "Email nao informado pelo Spotify" }}
                </p>
                <p class="text-xs text-slate-500">
                  Plano {{ spotifyStore.connection?.product || "desconhecido" }} ·
                  Pais {{ spotifyStore.connection?.country || "--" }}
                </p>
              </div>
            </div>
          </div>

          <p class="text-sm text-slate-400">
            A busca de faixas ainda nao foi portada para a API Spring. Por enquanto, esta tela serve para conectar e
            sincronizar o perfil do Spotify.
          </p>

          <div class="flex gap-3">
            <button @click="handleSync"
              class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg">
              Sincronizar perfil
            </button>
            <button @click="$emit('close')"
              class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 font-semibold rounded-lg">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { toast } from "vue-sonner";
import Modal from "../dashboard/Modal.vue";
import { useSpotifyStore } from "@/store/spotify";

defineEmits(["close", "save"]);

const spotifyStore = useSpotifyStore();

onMounted(() => {
  spotifyStore.checkConnectionStatus();
});

async function handleConnect() {
  try {
    await spotifyStore.startConnection();
  } catch (error) {
    console.error("Erro ao iniciar conexao com Spotify:", error);
    toast.error("Nao foi possivel iniciar a conexao com Spotify.");
  }
}

async function handleSync() {
  try {
    await spotifyStore.syncProfile();
    toast.success("Perfil do Spotify sincronizado.");
  } catch (error) {
    console.error("Erro ao sincronizar perfil do Spotify:", error);
    toast.error("Nao foi possivel sincronizar o perfil do Spotify.");
  }
}
</script>
