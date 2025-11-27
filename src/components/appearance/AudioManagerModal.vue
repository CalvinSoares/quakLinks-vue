<template>
    <Modal :is-open="true" title="Gerenciador de áudio" @close="$emit('close')">
        <div class="space-y-6 p-6">
            <p class="text-sm text-slate-400">Para ativar um áudio, selecione-o clicando.</p>

            <!-- Botão Premium -->
            <button
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition">
                Adicione até 4 áudios com
                <DiamondIcon class="w-4 h-4" /> Premium
            </button>

            <!-- Lista de Áudios -->
            <div class="space-y-3">
                <h3 class="text-slate-300 font-medium">Áudios ({{ audios.length }}/{{ maxAudios }})</h3>
                <AudioItem v-for="audio in audios" :key="audio.id" :audio="audio" @set-active="handleSetActive"
                    @edit="handleEdit" @delete="handleDelete" />
            </div>

            <!-- Opções -->
            <div class="space-y-4 pt-4 border-t border-slate-700/50">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-white">Embaralhar áudios</h4>
                        <p class="text-xs text-slate-400">Reproduza um áudio aleatório da sua lista.</p>
                    </div>
                    <SwitchToggle :model-value="shuffle" @update:model-value="$emit('update:shuffle', $event)" />
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-white">Reprodutor de áudio</h4>
                        <p class="text-xs text-slate-400">Adiciona um widget de áudio ao seu perfil.</p>
                    </div>
                    <SwitchToggle :model-value="showPlayer" @update:model-value="$emit('update:showPlayer', $event)" />
                </div>
            </div>
        </div>
        <template #footer>
            <button @click="isAddModalOpen = true"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                <MusicIcon class="w-5 h-5" />
                Adicionar áudio
            </button>
        </template>
    </Modal>

    <!-- Modal de Adicionar/Editar -->
    <AddAudioModal v-if="isAddModalOpen" :editing-audio="editingAudio" @close="closeAddModal" @save="handleSaveAudio" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SwitchToggle from '../SwitchToggle.vue';
import type { Audio } from '@/store/page';
import AudioItem from './AudioItem.vue';
import { DiamondIcon, MusicIcon } from 'vue-tabler-icons';
import AddAudioModal from './AddAudioModal.vue';
import Modal from '../dashboard/Modal.vue';

const props = defineProps<{
    audios: Audio[];
    shuffle: boolean;
    showPlayer: boolean;
}>();

const emit = defineEmits(['close', 'add', 'update', 'delete', 'update:shuffle', 'update:showPlayer', 'set-active']);

const maxAudios = ref(2);
const isAddModalOpen = ref(false);
const editingAudio = ref<Audio | null>(null);

const handleSetActive = (audioId: string) => emit('set-active', audioId);
const handleEdit = (audio: Audio) => {
    editingAudio.value = audio;
    isAddModalOpen.value = true;
};
const handleDelete = (audioId: string) => emit('delete', audioId);

const closeAddModal = () => {
    isAddModalOpen.value = false;
    editingAudio.value = null;
};

const handleSaveAudio = (data: { title: string; url: string; coverUrl?: string | null }) => {
    if (editingAudio.value) {
        emit('update', { id: editingAudio.value.id, ...data });
    } else {
        emit('add', data);
    }
    closeAddModal();
};
</script>