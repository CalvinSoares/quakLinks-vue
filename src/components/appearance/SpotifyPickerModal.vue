<template>
  <Modal :is-open="true" :title="copy.title" @close="$emit('close')">
    <div class="flex flex-col h-full">
      <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div v-if="spotifyStore.isLoading" class="flex items-center justify-center h-full text-center p-8">
          <div>
            <span class="animate-spin ..."></span> {{ copy.checkingConnection }}
          </div>
        </div>

        <div v-else-if="!spotifyStore.isConnected" class="flex items-center justify-center h-full text-center p-8">
          <div class="space-y-4">
            <p class="ui-modal-copy">
              {{ copy.connectDescription }}
            </p>
            <button @click="handleConnect" class="ui-btn-primary">
              {{ copy.connectButton }}
            </button>
          </div>
        </div>

        <div v-else class="space-y-5">
          <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div class="flex items-center gap-4">
              <img v-if="spotifyStore.connection?.avatarUrl" :src="spotifyStore.connection.avatarUrl"
                class="h-16 w-16 rounded-full object-cover" :alt="copy.spotifyAvatarAlt" />
              <div class="space-y-1 text-left">
                <p class="text-lg font-semibold text-white">
                  {{ spotifyStore.connection?.spotifyUserName || copy.connectedAccount }}
                </p>
                <p class="text-sm text-slate-400">
                  {{ spotifyStore.connection?.spotifyUserEmail || copy.emailUnavailable }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ copy.planLabel }} {{ spotifyStore.connection?.product || copy.unknown }} ·
                  {{ copy.countryLabel }} {{ spotifyStore.connection?.country || "--" }}
                </p>
              </div>
            </div>
          </div>

          <p class="text-sm text-slate-400">
            {{ copy.syncOnlyDescription }}
          </p>

          <div class="flex gap-3">
            <button @click="handleSync" class="ui-btn-primary">
              {{ copy.syncProfile }}
            </button>
            <button @click="$emit('close')" class="ui-btn-secondary">
              {{ copy.close }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import Modal from "../dashboard/Modal.vue";
import { useSpotifyStore } from "@/store/spotify";
import { useAppLanguage } from "@/composables/useAppLanguage";

defineEmits(["close", "save"]);

const spotifyStore = useSpotifyStore();
const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        title: "Spotify",
        checkingConnection: "Checking connection...",
        connectDescription: "Connect your Spotify account to sync the profile in the product.",
        connectButton: "Connect with Spotify",
        spotifyAvatarAlt: "Spotify Avatar",
        connectedAccount: "Connected account",
        emailUnavailable: "Email not provided by Spotify",
        planLabel: "Plan",
        countryLabel: "Country",
        unknown: "unknown",
        syncOnlyDescription: "Track search has not yet been ported to the Spring API. For now, this screen is used to connect and sync the Spotify profile.",
        syncProfile: "Sync profile",
        close: "Close",
        startError: "Could not start the Spotify connection.",
        syncSuccess: "Spotify profile synced.",
        syncError: "Could not sync the Spotify profile.",
      };
    case "es":
      return {
        title: "Spotify",
        checkingConnection: "Verificando conexión...",
        connectDescription: "Conecta tu cuenta de Spotify para sincronizar el perfil en el producto.",
        connectButton: "Conectar con Spotify",
        spotifyAvatarAlt: "Avatar de Spotify",
        connectedAccount: "Cuenta conectada",
        emailUnavailable: "Email no informado por Spotify",
        planLabel: "Plan",
        countryLabel: "País",
        unknown: "desconocido",
        syncOnlyDescription: "La búsqueda de canciones aún no fue portada a la API Spring. Por ahora, esta pantalla sirve para conectar y sincronizar el perfil de Spotify.",
        syncProfile: "Sincronizar perfil",
        close: "Cerrar",
        startError: "No se pudo iniciar la conexión con Spotify.",
        syncSuccess: "Perfil de Spotify sincronizado.",
        syncError: "No se pudo sincronizar el perfil de Spotify.",
      };
    default:
      return {
        title: "Spotify",
        checkingConnection: "Verificando conexao...",
        connectDescription: "Conecte sua conta do Spotify para sincronizar o perfil no produto.",
        connectButton: "Conectar com Spotify",
        spotifyAvatarAlt: "Avatar do Spotify",
        connectedAccount: "Conta conectada",
        emailUnavailable: "Email nao informado pelo Spotify",
        planLabel: "Plano",
        countryLabel: "Pais",
        unknown: "desconhecido",
        syncOnlyDescription: "A busca de faixas ainda nao foi portada para a API Spring. Por enquanto, esta tela serve para conectar e sincronizar o perfil do Spotify.",
        syncProfile: "Sincronizar perfil",
        close: "Fechar",
        startError: "Nao foi possivel iniciar a conexao com Spotify.",
        syncSuccess: "Perfil do Spotify sincronizado.",
        syncError: "Nao foi possivel sincronizar o perfil do Spotify.",
      };
  }
});

onMounted(() => {
  spotifyStore.checkConnectionStatus();
});

async function handleConnect() {
  try {
    await spotifyStore.startConnection();
  } catch (error) {
    console.error("Erro ao iniciar conexao com Spotify:", error);
    toast.error(copy.value.startError);
  }
}

async function handleSync() {
  try {
    await spotifyStore.syncProfile();
    toast.success(copy.value.syncSuccess);
  } catch (error) {
    console.error("Erro ao sincronizar perfil do Spotify:", error);
    toast.error(copy.value.syncError);
  }
}
</script>
