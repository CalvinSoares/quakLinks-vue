<template>
    <Modal :is-open="true" :title="copy.title" @close="$emit('close')">
        <div class="flex flex-col h-[500px]">


            <div class="flex border-b border-slate-700 mb-4 px-6 pt-2">
                <button @click="activeTab = 'background'"
                    class="pb-2 px-4 text-sm font-medium transition-colors relative"
                    :class="activeTab === 'background' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'">
                    {{ copy.backgroundMusic }}
                    <div v-if="activeTab === 'background'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400">
                    </div>
                </button>
                <button @click="activeTab = 'embeds'" class="pb-2 px-4 text-sm font-medium transition-colors relative"
                    :class="activeTab === 'embeds' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'">
                    {{ copy.players }}
                    <div v-if="activeTab === 'embeds'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400">
                    </div>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">

                <div v-if="activeTab === 'background'" class="space-y-6 animate-fade-in">
                    <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h4 class="font-semibold text-white">{{ copy.floatingPlayer }}</h4>
                                <p class="text-xs text-slate-400">{{ copy.floatingPlayerDescription }}</p>
                            </div>
                            <SwitchToggle :model-value="showPlayer"
                                @update:model-value="$emit('update:showPlayer', $event)" />
                        </div>
                        <div class="flex items-center justify-between border-t border-slate-700/50 pt-4">
                            <div>
                                <h4 class="font-semibold text-white">{{ copy.shuffleMode }}</h4>
                                <p class="text-xs text-slate-400">{{ copy.shuffleDescription }}</p>
                            </div>
                            <SwitchToggle :model-value="shuffle"
                                @update:model-value="$emit('update:shuffle', $event)" />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <h3 class="text-slate-300 font-medium text-sm">{{ copy.myUploads(directAudios.length) }}</h3>
                            <button @click="openAddModal('DIRECT')" class="ui-btn-secondary text-xs px-3 py-1.5">
                                <UploadIcon class="w-3 h-3" /> {{ copy.upload }}
                            </button>
                        </div>

                        <div v-if="directAudios.length > 0" class="space-y-2">
                            <AudioItem v-for="audio in directAudios" :key="audio.id" :audio="audio"
                                @set-active="handleSetActive" @edit="handleEdit" @delete="handleDelete" />
                        </div>
                        <div v-else
                            class="text-center py-8 text-slate-500 text-xs border-2 border-dashed border-slate-800 rounded-lg">
                            {{ copy.noUploadedMusic }}
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'embeds'" class="space-y-6 animate-fade-in">
                    <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-semibold text-white">{{ copy.showMusicCards }}</h4>
                                <p class="text-xs text-slate-400">{{ copy.showMusicCardsDescription }}</p>
                            </div>
                            <SwitchToggle :model-value="showEmbeds"
                                @update:model-value="$emit('update:showEmbeds', $event)" />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <h3 class="text-slate-300 font-medium text-sm">{{ copy.activeEmbeds(embedAudios.length) }}</h3>
                            <button @click="isSpotifyPickerOpen = true" class="ui-btn-primary text-xs px-3 py-1.5">
                                <BrandSpotifyIcon class="w-3 h-3" /> {{ copy.add }}
                            </button>
                        </div>

                        <div v-if="embedAudios.length > 0" class="space-y-2">
                            <AudioItem v-for="audio in embedAudios" :key="audio.id" :audio="audio"
                                :hide-active-toggle="true" @edit="handleEdit" @delete="handleDelete" />
                        </div>
                        <div v-else
                            class="text-center py-8 text-slate-500 text-xs border-2 border-dashed border-slate-800 rounded-lg">
                            {{ copy.noPlayerAdded }}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <template #footer>
            <div class="text-xs text-slate-500 w-full text-center">
                {{ copy.tip }}
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
import { useAppLanguage } from '@/composables/useAppLanguage';

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
const { locale } = useAppLanguage();

const activeTab = ref<'background' | 'embeds'>('background');
const isAddModalOpen = ref(false);
const isSpotifyPickerOpen = ref(false);
const editingAudio = ref<Audio | null>(null);

const directAudios = computed(() => props.audios.filter(a => a.type === 'DIRECT'));
const embedAudios = computed(() => props.audios.filter(a => a.type === 'SPOTIFY' || a.type === 'SOUNDCLOUD'));
const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                title: 'Audio Manager',
                backgroundMusic: 'Background Music',
                players: 'Players (Spotify)',
                floatingPlayer: 'Floating Player',
                floatingPlayerDescription: 'Plays automatically when entering the profile.',
                shuffleMode: 'Shuffle Mode',
                shuffleDescription: 'Shuffle playback order.',
                myUploads: (count: number) => `My Uploads (${count})`,
                upload: 'Upload',
                noUploadedMusic: 'No music uploaded.',
                showMusicCards: 'Show Music Cards',
                showMusicCardsDescription: 'Displays Spotify/SoundCloud widgets on the profile.',
                activeEmbeds: (count: number) => `Active Embeds (${count})`,
                add: 'Add',
                noPlayerAdded: 'No player added.',
                tip: 'Tip: You can have background music AND active embeds at the same time.',
            };
        case 'es':
            return {
                title: 'Gestor de Audio',
                backgroundMusic: 'Música de Fondo',
                players: 'Players (Spotify)',
                floatingPlayer: 'Player Flotante',
                floatingPlayerDescription: 'Se reproduce automáticamente al entrar al perfil.',
                shuffleMode: 'Modo Aleatorio',
                shuffleDescription: 'Mezclar el orden de reproducción.',
                myUploads: (count: number) => `Mis Uploads (${count})`,
                upload: 'Subir',
                noUploadedMusic: 'Ninguna música subida.',
                showMusicCards: 'Mostrar Cards de Música',
                showMusicCardsDescription: 'Muestra los widgets de Spotify/SoundCloud en el perfil.',
                activeEmbeds: (count: number) => `Embeds Activos (${count})`,
                add: 'Agregar',
                noPlayerAdded: 'Ningún player agregado.',
                tip: 'Consejo: Puedes tener música de fondo Y embeds activos al mismo tiempo.',
            };
        default:
            return {
                title: 'Gerenciador de Áudio',
                backgroundMusic: 'Música de Fundo',
                players: 'Players (Spotify)',
                floatingPlayer: 'Player Flutuante',
                floatingPlayerDescription: 'Toca automaticamente ao entrar no perfil.',
                shuffleMode: 'Modo Aleatório',
                shuffleDescription: 'Embaralhar a ordem de reprodução.',
                myUploads: (count: number) => `Meus Uploads (${count})`,
                upload: 'Upload',
                noUploadedMusic: 'Nenhuma música enviada.',
                showMusicCards: 'Mostrar Cards de Música',
                showMusicCardsDescription: 'Exibe os widgets do Spotify/SoundCloud no perfil.',
                activeEmbeds: (count: number) => `Embeds Ativos (${count})`,
                add: 'Adicionar',
                noPlayerAdded: 'Nenhum player adicionado.',
                tip: 'Dica: Você pode ter música de fundo E embeds ativos simultaneamente.',
            };
    }
});

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
