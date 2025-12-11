<!-- components/appearance/SpotifyPickerModal.vue -->
<template>
    <Modal :is-open="true" title="Adicionar do Spotify" @close="$emit('close')">
        <div class="flex flex-col h-full">
            <!-- Conteúdo principal que se expande e rola -->
            <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
                <!-- Estado de Carregamento -->
                <div v-if="spotifyStore.isLoading" class="flex items-center justify-center h-full text-center p-8">
                    <div>
                        <span class="animate-spin ..."></span> Verificando conexão...
                    </div>
                </div>

                <!-- Botão de Conexão -->
                <div v-else-if="!spotifyStore.isConnected"
                    class="flex items-center justify-center h-full text-center p-8">
                    <div class="space-y-4">
                        <p class="text-slate-400">Conecte sua conta do Spotify para pesquisar e adicionar suas músicas
                            favoritas.</p>
                        <a :href="spotifyStore.connectUrl"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full">
                            Conectar com Spotify
                        </a>
                    </div>
                </div>

                <!-- Interface de Busca -->
                <div v-else class="space-y-4">
                    <input v-model="searchQuery" type="text" placeholder="Buscar por música ou artista..."
                        class="input-dark w-full" />

                    <!-- MODIFICADO: Removido max-h e overflow daqui, pois o pai agora controla a rolagem -->
                    <div class="space-y-2 pr-2">
                        <div v-if="isSearching" class="text-center py-4">Buscando...</div>
                        <div v-for="track in searchResults" :key="track.id" @click="selectTrack(track)"
                            class="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
                            <img :src="track.album.images[2]?.url || track.album.images[0]?.url"
                                class="w-12 h-12 rounded flex-shrink-0" alt="Capa do álbum">
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-white truncate">{{ track.name }}</p>
                                <p class="text-sm text-slate-400 truncate">{{track.artists.map(a => a.name).join(', ')}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Modal from '../dashboard/Modal.vue';
import { useSpotifyStore, type SpotifyTrack } from '@/store/spotify';
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits(['close', 'save']);

const spotifyStore = useSpotifyStore();
const searchQuery = ref('');
const searchResults = ref<SpotifyTrack[]>([]);
const isSearching = ref(false);

onMounted(() => {
    spotifyStore.checkConnectionStatus();
});

const performSearch = useDebounceFn(async () => {
    if (searchQuery.value.length < 3) {
        searchResults.value = [];
        return;
    }
    isSearching.value = true;
    searchResults.value = await spotifyStore.searchTracks(searchQuery.value);
    isSearching.value = false;
}, 500); // Debounce de 500ms

watch(searchQuery, performSearch);

const selectTrack = (track: SpotifyTrack) => {
    // 1. Pega o nome do artista de forma segura
    const artistName = track.artists && track.artists.length > 0
        ? track.artists[0]?.name
        : 'Artista Desconhecido'; // Fallback caso não haja artista

    // 2. Monta o título
    const title = `${track.name} - ${artistName}`;

    // 3. Pega a URL da capa de forma segura
    const coverUrl = track.album?.images?.[0]?.url || null; // Fallback para null se não houver imagem

    const dataToSave = {
        type: 'SPOTIFY' as const,
        title: title,
        url: track.external_urls.spotify, // A URL principal da música é garantida
        coverUrl: coverUrl,
        spotifyTrackId: track.id
    };

    emit('save', dataToSave);
};
</script>