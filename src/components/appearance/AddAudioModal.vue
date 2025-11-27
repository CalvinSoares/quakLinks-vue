<template>
    <Modal :is-open="true" :title="isEditing ? 'Editar áudio' : 'Adicionar um áudio'" @close="$emit('close')">
        <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <AssetUploader title="Áudio" :current-url="form.url" upload-type="audio" accepted-files="audio/*"
                    @upload="(payload) => handleFileSelect('audio', payload.file)"
                    @remove="() => handleFileRemove('audio')" />

                <AssetUploader title="Capa" :current-url="form.coverUrl" upload-type="background"
                    accepted-files="image/*" @upload="(payload) => handleFileSelect('audio_cover', payload.file)"
                    @remove="() => handleFileRemove('audio_cover')" />
            </div>
            <div>
                <label class="label-text">Título do áudio</label>
                <input type="text" v-model="form.title" placeholder="Adicionar um título..." class="input-dark">
            </div>
        </div>
        <template #footer>
            <button @click="save" :disabled="isSaving"
                class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center justify-center">
                <span v-if="isSaving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                {{ isSaving ? 'Salvando...' : (isEditing ? 'Salvar alterações' : 'Adicionar áudio') }}
            </button>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import type { Audio } from '@/store/page';
import { uploadFileWithSignedUrl } from '@/services/uploadService';
import AssetUploader from '../assetUploader.vue';
import Modal from '../dashboard/Modal.vue';

const props = defineProps<{ editingAudio?: Audio | null }>();
const emit = defineEmits(['close', 'save']);

const isEditing = computed(() => !!props.editingAudio);
const isSaving = ref(false);

const form = reactive({
    title: props.editingAudio?.title || '',
    url: props.editingAudio?.url || null,
    coverUrl: props.editingAudio?.coverUrl || null,
});

const pendingFiles = reactive<{ audio?: File, audio_cover?: File }>({});

const handleFileSelect = (type: 'audio' | 'audio_cover', file: File) => {
    pendingFiles[type] = file;

    if (type === 'audio_cover') {
        const reader = new FileReader();
        reader.onload = (e) => {
            form.coverUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        form.url = file.name;
    }
};


const handleFileRemove = (type: 'audio' | 'audio_cover') => {
    if (type === 'audio') form.url = props.editingAudio?.url || null;
    if (type === 'audio_cover') form.coverUrl = props.editingAudio?.coverUrl || null;
    delete pendingFiles[type];
};

const save = async () => {
    if (!form.title || (!form.url && !pendingFiles.audio)) {
        alert('Título e arquivo de áudio são obrigatórios.');
        return;
    }

    isSaving.value = true;

    const finalData = {
        title: form.title,
        url: props.editingAudio?.url || null,
        coverUrl: props.editingAudio?.coverUrl || null,
    };

    try {
        if (pendingFiles.audio) {
            finalData.url = await uploadFileWithSignedUrl(pendingFiles.audio, 'audio');
        }

        if (pendingFiles.audio_cover) {
            finalData.coverUrl = await uploadFileWithSignedUrl(pendingFiles.audio_cover, 'background');
        }

        emit('save', finalData);

    } catch (error) {
        console.error("Erro no upload do áudio:", error);
        alert("Ocorreu um erro ao enviar os arquivos. Tente novamente.");
    } finally {
        isSaving.value = false;
    }
};
</script>