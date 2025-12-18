<template>
    <Modal :is-open="true" title="Gerenciador de Áudio" @close="$emit('close')">
        <div class="flex flex-col h-[500px]">


            <div class="flex border-b border-slate-700 mb-4 px-6 pt-2">
                <button @click="activeTab = 'background'"
                    class="pb-2 px-4 text-sm font-medium transition-colors relative"
                    :class="activeTab === 'background' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'">
                    Música de Fundo
                    <div v-if="activeTab === 'background'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400">
                    </div>
                </button>
                <button @click="activeTab = 'embeds'" class="pb-2 px-4 text-sm font-medium transition-colors relative"
                    :class="activeTab === 'embeds' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'">
                    Players (Spotify)
                    <div v-if="activeTab === 'embeds'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400">
                    </div>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">

                <div v-if="activeTab === 'background'" class="space-y-6 animate-fade-in">
                    <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h4 class="font-semibold text-white">Player Flutuante</h4>
                                <p class="text-xs text-slate-400">Toca automaticamente ao entrar no perfil.</p>
                            </div>
                            <SwitchToggle :model-value="showPlayer"
                                @update:model-value="$emit('update:showPlayer', $event)" />
                        </div>
                        <div class="flex items-center justify-between border-t border-slate-700/50 pt-4">
                            <div>
                                <h4 class="font-semibold text-white">Modo Aleatório</h4>
                                <p class="text-xs text-slate-400">Embaralhar a ordem de reprodução.</p>
                            </div>
                            <SwitchToggle :model-value="shuffle"
                                @update:model-value="$emit('update:shuffle', $event)" />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <h3 class="text-slate-300 font-medium text-sm">Meus Uploads ({{ directAudios.length }})</h3>
                            <button @click="openAddModal('DIRECT')"
                                class="text-xs flex items-center gap-1 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-md transition text-white">
                                <UploadIcon class="w-3 h-3" /> Upload
                            </button>
                        </div>

                        <div v-if="directAudios.length > 0" class="space-y-2">
                            <AudioItem v-for="audio in directAudios" :key="audio.id" :audio="audio"
                                @set-active="handleSetActive" @edit="handleEdit" @delete="handleDelete" />
                        </div>
                        <div v-else
                            class="text-center py-8 text-slate-500 text-xs border-2 border-dashed border-slate-800 rounded-lg">
                            Nenhuma música enviada.
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'embeds'" class="space-y-6 animate-fade-in">
                    <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-semibold text-white">Mostrar Cards de Música</h4>
                                <p class="text-xs text-slate-400">Exibe os widgets do Spotify/SoundCloud no perfil.</p>
                            </div>
                            <SwitchToggle :model-value="showEmbeds"
                                @update:model-value="$emit('update:showEmbeds', $event)" />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <h3 class="text-slate-300 font-medium text-sm">Embeds Ativos ({{ embedAudios.length }})</h3>
                            <button @click="isSpotifyPickerOpen = true"
                                class="text-xs flex items-center gap-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-3 py-1.5 rounded-md transition">
                                <BrandSpotifyIcon class="w-3 h-3" /> Adicionar
                            </button>
                        </div>

                        <div v-if="embedAudios.length > 0" class="space-y-2">
                            <AudioItem v-for="audio in embedAudios" :key="audio.id" :audio="audio"
                                :hide-active-toggle="true" @edit="handleEdit" @delete="handleDelete" />
                        </div>
                        <div v-else
                            class="text-center py-8 text-slate-500 text-xs border-2 border-dashed border-slate-800 rounded-lg">
                            Nenhum player adicionado.
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <template #footer>
            <div class="text-xs text-slate-500 w-full text-center">
                Dica: Você pode ter música de fundo E embeds ativos simultaneamente.
            </div>
        </template>
    </Modal>

    <AddAudioModal v-if="isAddModalOpen" :editing-audio="editingAudio" @close="closeAddModal" @save="handleSaveAudio" />
    <SpotifyPickerModal v-if="isSpotifyPickerOpen" @close="isSpotifyPickerOpen = false" @save="handleSaveAudio" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SwitchToggle from '../SwitchToggle.vue';
import type { Audio } from '@/store/page';
import AudioItem from './AudioItem.vue';
import { UploadIcon, BrandSpotifyIcon } from 'vue-tabler-icons';
import AddAudioModal from './AddAudioModal.vue';
import SpotifyPickerModal from './SpotifyPickerModal.vue';
import Modal from '../dashboard/Modal.vue';

const props = defineProps<{
    audios: Audio[];
    shuffle: boolean;
    showPlayer: boolean;
    showEmbeds: boolean;
}>();

const emit = defineEmits([
    'close', 'add', 'update', 'delete',
    'update:shuffle', 'update:showPlayer', 'update:showEmbeds',
    'set-active'
]);

const activeTab = ref<'background' | 'embeds'>('background');
const isAddModalOpen = ref(false);
const isSpotifyPickerOpen = ref(false);
const editingAudio = ref<Audio | null>(null);

const directAudios = computed(() => props.audios.filter(a => a.type === 'DIRECT'));
const embedAudios = computed(() => props.audios.filter(a => a.type === 'SPOTIFY' || a.type === 'SOUNDCLOUD'));

const handleSetActive = (audioId: string) => emit('set-active', audioId);

const handleEdit = (audio: Audio) => {
    editingAudio.value = audio;
    if (audio.type === 'SPOTIFY') {
        isSpotifyPickerOpen.value = true;
    } else {
        isAddModalOpen.value = true;
    }
};

const handleDelete = (audioId: string) => emit('delete', audioId);

const openAddModal = (type: 'DIRECT') => {
    isAddModalOpen.value = true;
}

const closeAddModal = () => {
    isAddModalOpen.value = false;
    isSpotifyPickerOpen.value = false;
    editingAudio.value = null;
};

const handleSaveAudio = (data: any) => {
    if (editingAudio.value) {
        emit('update', { id: editingAudio.value.id, ...data });
    } else {
        emit('add', data);
    }
    closeAddModal();
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>