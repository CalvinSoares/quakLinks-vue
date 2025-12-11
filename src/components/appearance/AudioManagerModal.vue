<!-- components/appearance/AudioManagerModal.vue -->
<template>
    <Modal :is-open="true" title="Gerenciador de Mídia" @close="$emit('close')">
        <div class="space-y-6 p-6">
            <p class="text-sm text-slate-400">Gerencie suas músicas de fundo (upload) e players incorporados (Spotify).
            </p>

            <!-- Botão Premium -->
            <button
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition">
                Adicione mais mídias com
                <DiamondIcon class="w-4 h-4" /> Premium
            </button>

            <!-- Lista de Áudios -->
            <div class="space-y-3">
                <h3 class="text-slate-300 font-medium">Suas Mídias ({{ audios.length }}/{{ maxAudios }})</h3>
                <div v-if="audios.length > 0" class="max-h-60 overflow-y-auto pr-2 space-y-3">
                    <AudioItem v-for="audio in audios" :key="audio.id" :audio="audio" @set-active="handleSetActive"
                        @edit="handleEdit" @delete="handleDelete" />
                </div>
                <div v-else
                    class="text-center py-6 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-lg">
                    Nenhuma mídia adicionada.
                </div>
            </div>

            <!-- Opções -->
            <div class="space-y-4 pt-4 border-t border-slate-700/50">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-white">Embaralhar músicas de fundo</h4>
                        <p class="text-xs text-slate-400">Reproduz um áudio aleatório da sua lista de uploads.</p>
                    </div>
                    <SwitchToggle :model-value="shuffle" @update:model-value="$emit('update:shuffle', $event)" />
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-white">Player de música de fundo</h4>
                        <p class="text-xs text-slate-400">Mostra um widget flutuante no seu perfil para uploads.</p>
                    </div>
                    <SwitchToggle :model-value="showPlayer" @update:model-value="$emit('update:showPlayer', $event)" />
                </div>
            </div>
        </div>

        <!-- ATUALIZADO: Rodapé com duas opções -->
        <template #footer>
            <div class="grid grid-cols-2 gap-3 w-full">
                <button @click="openAddModal('DIRECT')"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                    <UploadIcon class="w-5 h-5" />
                    Adicionar por Upload
                </button>
                <button @click="isSpotifyPickerOpen = true"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition">
                    <BrandSpotifyIcon class="w-5 h-5" />
                    Adicionar do Spotify
                </button>
            </div>
        </template>
    </Modal>

    <!-- Modal de Adicionar/Editar por UPLOAD -->
    <AddAudioModal v-if="isAddModalOpen" :editing-audio="editingAudio" @close="closeAddModal" @save="handleSaveAudio" />

    <!-- NOVO: Modal para escolher músicas do Spotify -->
    <SpotifyPickerModal v-if="isSpotifyPickerOpen" @close="isSpotifyPickerOpen = false" @save="handleSaveAudio" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SwitchToggle from '../SwitchToggle.vue';
import type { Audio } from '@/store/page';
import AudioItem from './AudioItem.vue';
import { DiamondIcon, UploadIcon, BrandSpotifyIcon } from 'vue-tabler-icons';
import AddAudioModal from './AddAudioModal.vue';
import SpotifyPickerModal from './SpotifyPickerModal.vue'; // Importe o novo modal
import Modal from '../dashboard/Modal.vue';

defineProps<{
    audios: Audio[];
    shuffle: boolean;
    showPlayer: boolean;
}>();

const emit = defineEmits(['close', 'add', 'update', 'delete', 'update:shuffle', 'update:showPlayer', 'set-active']);

const maxAudios = ref(2); // Idealmente, isso viria do estado do usuário (plano free/premium)
const isAddModalOpen = ref(false);
const isSpotifyPickerOpen = ref(false); // Novo estado para o modal do Spotify
const editingAudio = ref<Audio | null>(null);

const handleSetActive = (audioId: string) => emit('set-active', audioId);

const handleEdit = (audio: Audio) => {
    editingAudio.value = audio;
    // Abre o modal correto dependendo do tipo de áudio
    if (audio.type === 'SPOTIFY') {
        isSpotifyPickerOpen.value = true; // No futuro, você pode passar o `editingAudio` para o SpotifyPicker para mostrar a música atual
    } else {
        isAddModalOpen.value = true;
    }
};

const handleDelete = (audioId: string) => emit('delete', audioId);

// Função genérica para abrir o modal de upload/edição
const openAddModal = (type: 'DIRECT') => {
    // Se precisar, você pode passar o tipo inicial para o AddAudioModal
    isAddModalOpen.value = true;
}

// Fecha ambos os modais de adição e reseta o estado de edição
const closeAddModal = () => {
    isAddModalOpen.value = false;
    isSpotifyPickerOpen.value = false;
    editingAudio.value = null;
};

// Função unificada para salvar. Funciona para ambos os modais.
const handleSaveAudio = (data: {
    title: string;
    url: string;
    type: 'DIRECT' | 'SPOTIFY' | 'SOUNDCLOUD'; // Mantemos SoundCloud para o futuro
    coverUrl?: string | null;
    spotifyTrackId?: string;
}) => {
    if (editingAudio.value) {
        emit('update', { id: editingAudio.value.id, ...data });
    } else {
        emit('add', data);
    }
    closeAddModal(); // Fecha qualquer modal que estiver aberto
};
</script>