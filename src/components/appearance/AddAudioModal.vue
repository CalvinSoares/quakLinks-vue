<template>
    <Modal :is-open="true" :title="isEditing ? copy.editMedia : copy.addNewMedia" @close="$emit('close')">
        <div class="space-y-6 p-6">

            <div>
                <label class="ui-label">{{ copy.mediaSource }}</label>
                <div class="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-lg w-full mt-1">
                    <button @click="form.type = 'DIRECT'" :class="getTypeButtonClass('DIRECT')">{{ copy.upload }}</button>
                    <button @click="form.type = 'SOUNDCLOUD'"
                        :class="getTypeButtonClass('SOUNDCLOUD')">SoundCloud</button>
                </div>
            </div>

            <transition name="fade" mode="out-in">
                <div v-if="form.type === 'DIRECT'" key="direct" class="space-y-4">
                    <AssetUploader :title="copy.audioFile" :current-url="form.url" upload-type="audio"
                        accepted-files="audio/*" @upload="(payload) => handleFileSelect('audio', payload.file)"
                        @remove="() => handleFileRemove('audio')" />
                    <AssetUploader :title="copy.coverImage" :current-url="form.coverUrl"
                        upload-type="background" accepted-files="image/*"
                        @upload="(payload) => handleFileSelect('audio_cover', payload.file)"
                        @remove="() => handleFileRemove('audio_cover')" />
                </div>

                <div v-else key="embed" class="space-y-4">
                    <div>
                        <label for="audio-url" class="ui-label">{{ copy.audioUrl }}</label>
                        <input id="audio-url" type="text" v-model="form.url" class="ui-input"
                            :placeholder="copy.pasteLink(form.type)">
                    </div>
                </div>
            </transition>

            <div>
                <label for="audio-title" class="ui-label">{{ copy.title }}</label>
                <input id="audio-title" type="text" v-model="form.title" class="ui-input"
                    :placeholder="copy.titlePlaceholder">
            </div>
        </div>

        <template #footer>
            <div class="w-full flex items-center justify-between">
                <button @click="$emit('close')" class="ui-btn-secondary">
                    {{ copy.cancel }}
                </button>
                <button @click="save" :disabled="isSaving"
                    class="ui-btn-primary min-w-[170px]">
                    <span v-if="isSaving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {{ isSaving ? copy.saving : (isEditing ? copy.saveChanges : copy.addMedia) }}
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
import { useAppLanguage } from '@/composables/useAppLanguage';

const props = defineProps<{ editingAudio?: Audio | null }>();
const emit = defineEmits(['close', 'save']);
const { locale } = useAppLanguage();

const isEditing = computed(() => !!props.editingAudio);
const isSaving = ref(false);
const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                editMedia: 'Edit Media',
                addNewMedia: 'Add New Media',
                mediaSource: 'Media Source',
                upload: 'Upload',
                audioFile: 'Audio File (.mp3, .wav)',
                coverImage: 'Song Cover (Optional)',
                audioUrl: 'Song or Playlist URL',
                pasteLink: (type: string) => `Paste the ${type.charAt(0) + type.slice(1).toLowerCase()} link here`,
                title: 'Title',
                titlePlaceholder: 'Song name, artist, etc.',
                cancel: 'Cancel',
                saving: 'Saving...',
                saveChanges: 'Save Changes',
                addMedia: 'Add Media',
                requiredFields: 'Title and URL/File are required.',
                genericError: 'An error occurred. Please try again.',
            };
        case 'es':
            return {
                editMedia: 'Editar Media',
                addNewMedia: 'Agregar Nueva Media',
                mediaSource: 'Fuente de la Media',
                upload: 'Subir',
                audioFile: 'Archivo de Audio (.mp3, .wav)',
                coverImage: 'Portada de la Canción (Opcional)',
                audioUrl: 'URL de la Canción o Playlist',
                pasteLink: (type: string) => `Pega aquí el link de ${type.charAt(0) + type.slice(1).toLowerCase()}`,
                title: 'Título',
                titlePlaceholder: 'Nombre de la canción, artista, etc.',
                cancel: 'Cancelar',
                saving: 'Guardando...',
                saveChanges: 'Guardar Cambios',
                addMedia: 'Agregar Media',
                requiredFields: 'Título y URL/Archivo son obligatorios.',
                genericError: 'Ocurrió un error. Intenta nuevamente.',
            };
        default:
            return {
                editMedia: 'Editar Mídia',
                addNewMedia: 'Adicionar Nova Mídia',
                mediaSource: 'Fonte da Mídia',
                upload: 'Upload',
                audioFile: 'Arquivo de Áudio (.mp3, .wav)',
                coverImage: 'Capa da Música (Opcional)',
                audioUrl: 'URL da Música ou Playlist',
                pasteLink: (type: string) => `Cole o link do ${type.charAt(0) + type.slice(1).toLowerCase()} aqui`,
                title: 'Título',
                titlePlaceholder: 'Nome da música, artista, etc.',
                cancel: 'Cancelar',
                saving: 'Salvando...',
                saveChanges: 'Salvar Alterações',
                addMedia: 'Adicionar Mídia',
                requiredFields: 'Título e URL/Arquivo são obrigatórios.',
                genericError: 'Ocorreu um erro. Tente novamente.',
            };
    }
});

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
        toast.warning(copy.value.requiredFields);
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
        toast.error(copy.value.genericError);
    } finally {
        isSaving.value = false;
    }
};

const getTypeButtonClass = (value: string) => {
    return [
        'flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border',
        form.type === value
            ? 'border-amber-300/40 bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
            : 'border-slate-700 text-slate-300 hover:bg-slate-700'
    ];
};
</script>

<style scoped>
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
