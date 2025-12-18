<template>
    <Modal :is-open="true" :title="isEditing ? 'Editar Mídia' : 'Adicionar Nova Mídia'" @close="$emit('close')">
        <div class="space-y-6 p-6">

            <div>
                <label class="label-text">Fonte da Mídia</label>
                <div class="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-lg w-full mt-1">
                    <button @click="form.type = 'DIRECT'" :class="getTypeButtonClass('DIRECT')">Upload</button>
                    <button @click="form.type = 'SOUNDCLOUD'"
                        :class="getTypeButtonClass('SOUNDCLOUD')">SoundCloud</button>
                </div>
            </div>

            <transition name="fade" mode="out-in">
                <div v-if="form.type === 'DIRECT'" key="direct" class="space-y-4">
                    <AssetUploader title="Arquivo de Áudio (.mp3, .wav)" :current-url="form.url" upload-type="audio"
                        accepted-files="audio/*" @upload="(payload) => handleFileSelect('audio', payload.file)"
                        @remove="() => handleFileRemove('audio')" />
                    <AssetUploader title="Capa da Música (Opcional)" :current-url="form.coverUrl"
                        upload-type="background" accepted-files="image/*"
                        @upload="(payload) => handleFileSelect('audio_cover', payload.file)"
                        @remove="() => handleFileRemove('audio_cover')" />
                </div>

                <div v-else key="embed" class="space-y-4">
                    <div>
                        <label for="audio-url" class="label-text">URL da Música ou Playlist</label>
                        <input id="audio-url" type="text" v-model="form.url" class="input-dark"
                            :placeholder="`Cole o link do ${form.type.charAt(0) + form.type.slice(1).toLowerCase()} aqui`">
                    </div>
                </div>
            </transition>

            <div>
                <label for="audio-title" class="label-text">Título</label>
                <input id="audio-title" type="text" v-model="form.title" class="input-dark"
                    placeholder="Nome da música, artista, etc.">
            </div>
        </div>

        <template #footer>
            <div class="w-full flex items-center justify-between">
                <button @click="$emit('close')" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                    Cancelar
                </button>
                <button @click="save" :disabled="isSaving"
                    class="px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center justify-center">
                    <span v-if="isSaving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {{ isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Mídia') }}
                </button>
            </div>

        </template>
    </Modal>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from 'vue';
import type { Audio } from '@/store/page';
import { uploadFileWithSignedUrl } from '@/services/uploadService';
import AssetUploader from '../assetUploader.vue';
import Modal from '../dashboard/Modal.vue';
import { toast } from 'vue-sonner';

const props = defineProps<{ editingAudio?: Audio | null }>();
const emit = defineEmits(['close', 'save']);

const isEditing = computed(() => !!props.editingAudio);
const isSaving = ref(false);

const form = reactive({
    title: '',
    url: null as string | null,
    type: 'DIRECT' as 'DIRECT' | 'SPOTIFY' | 'SOUNDCLOUD',
    coverUrl: null as string | null,
});

const pendingFiles = reactive<{ audio?: File, audio_cover?: File }>({});

onMounted(() => {
    if (props.editingAudio) {
        form.title = props.editingAudio.title;
        form.url = props.editingAudio.url;
        form.type = props.editingAudio.type || 'DIRECT';
        form.coverUrl = props.editingAudio.coverUrl || null;
    }
});


watch(() => form.type, (newType, oldType) => {
    if (newType !== oldType) {
        form.url = null;
        form.coverUrl = null;
        delete pendingFiles.audio;
        delete pendingFiles.audio_cover;
    }
});

const handleFileSelect = (type: 'audio' | 'audio_cover', file: File) => {
    pendingFiles[type] = file;
    if (type === 'audio') {
        form.url = file.name;
    } else {
        const reader = new FileReader();
        reader.onload = (e) => { form.coverUrl = e.target?.result as string; };
        reader.readAsDataURL(file);
    }
};

const handleFileRemove = (type: 'audio' | 'audio_cover') => {
    if (type === 'audio') form.url = props.editingAudio?.url || null;
    if (type === 'audio_cover') form.coverUrl = props.editingAudio?.coverUrl || null;
    delete pendingFiles[type];
};

const save = async () => {
    if (!form.title || !form.url) {
        toast.warning('Título e URL/Arquivo são obrigatórios.');
        return;
    }

    isSaving.value = true;

    const finalData: any = {
        title: form.title,
        type: form.type,
        url: form.type !== 'DIRECT' ? form.url : (props.editingAudio?.url || null),
        coverUrl: form.type === 'DIRECT' ? (props.editingAudio?.coverUrl || null) : null,
    };

    try {
        if (form.type === 'DIRECT') {
            if (pendingFiles.audio) {
                finalData.url = await uploadFileWithSignedUrl(pendingFiles.audio, 'audio');
            }
            if (pendingFiles.audio_cover) {
                finalData.coverUrl = await uploadFileWithSignedUrl(pendingFiles.audio_cover, 'background');
            }
        }

        emit('save', finalData);

    } catch (error) {
        console.error("Erro no upload ou salvamento:", error);
        toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
        isSaving.value = false;
    }
};

const getTypeButtonClass = (value: string) => {
    return [
        'flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5',
        form.type === value
            ? 'bg-yellow-500 text-slate-900 shadow-md'
            : 'text-slate-300 hover:bg-slate-700'
    ];
};
</script>

<style scoped>
.label-text {
    @apply block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide;
}

.input-dark {
    @apply w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors placeholder-slate-600 text-sm;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>