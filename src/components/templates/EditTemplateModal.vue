<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')" max-width="md">
    <template #title>Editar Template</template>

    <form v-if="template" @submit.prevent="handleSubmit" class="mt-6 space-y-4">
      <div>
        <label for="edit-name" class="form-label">Nome do Template</label>
        <input v-model="form.name" id="edit-name" type="text" required class="form-input" />
      </div>
      <div>
        <label class="form-label">Imagem de Preview</label>
        <div
          class="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
          <div v-if="!preview && form.previewImageUrl" class="relative w-full aspect-video">
            <img :src="form.previewImageUrl" class="w-full h-full object-contain rounded-md" />
            <label for="edit-file-upload"
              class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-semibold">
              Trocar Imagem
              <input id="edit-file-upload" type="file" class="sr-only" @change="handleFileChange"
                accept="image/png, image/jpeg, image/gif">
            </label>
          </div>
          <div v-else-if="preview" class="relative w-full aspect-video">
            <img :src="preview" class="w-full h-full object-contain rounded-md" />
            <button @click="removeFile" type="button"
              class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div v-else class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48"
              aria-hidden="true">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <div class="flex text-sm text-slate-400">
              <label for="edit-file-upload-empty"
                class="relative cursor-pointer rounded-md font-medium text-amber-400 hover:text-amber-300">
                <span>Selecione um arquivo</span>
                <input id="edit-file-upload-empty" type="file" class="sr-only" @change="handleFileChange"
                  accept="image/png, image/jpeg, image/gif">
              </label>
            </div>
            <p class="text-xs text-slate-500">PNG, JPG, GIF até 10MB</p>
          </div>
        </div>
      </div>
      <div>
        <label for="edit-tags" class="form-label">Tags (separadas por vírgula)</label>
        <input v-model="tagsInput" id="edit-tags" type="text" required class="form-input" />
      </div>
      <div>
        <label class="form-label">Visibilidade</label>
        <div class="flex gap-4 mt-2">
          <label v-for="option in visibilityOptions" :key="option.value"
            class="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input type="radio" v-model="form.visibility" :value="option.value" name="visibility" class="form-radio" />
            {{ option.label }}
          </label>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
      <button type="button" @click="handleSubmit" :disabled="isLoading" class="btn-primary">
        {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useTemplatesStore, type CreateTemplateInput, type Template } from '@/store/templates';
import BaseModal from '../modals/BaseModal.vue';
import { toast } from 'vue-sonner';

const props = defineProps<{ isOpen: boolean, template: Template | null }>();
const emit = defineEmits(['close']);
const store = useTemplatesStore();

const isLoading = ref(false);
const tagsInput = ref('');
const preview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
type EditTemplateForm = Omit<Partial<CreateTemplateInput>, 'tags'>;

const form = reactive<EditTemplateForm>({});

const visibilityOptions = [
  { label: 'Público', value: 'PUBLIC' },
  { label: 'Privado', value: 'PRIVATE' },
];

watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.name = newTemplate.name;
    form.previewImageUrl = newTemplate.previewImageUrl;
    form.visibility = newTemplate.visibility;
    tagsInput.value = newTemplate.tags.map(t => t.name).join(', ');
  }
}, { immediate: true });

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removeFile() {
  selectedFile.value = null;
  preview.value = null;

  const input = document.getElementById('edit-file-upload') as HTMLInputElement;
  if (input) input.value = '';
}

function resetAndClose() {
  removeFile();
  emit('close');
}

async function handleSubmit() {
  if (!props.template) return;
  isLoading.value = true;


  const payload: Partial<CreateTemplateInput> = {
    ...form,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean),
  };

  if (selectedFile.value) {
    payload.previewImageFile = selectedFile.value;
  }

  try {
    await store.updateTemplate(props.template.id, payload);
    toast.success('Template atualizado com sucesso!');
    resetAndClose();
  } catch (error: any) {
    toast.error(`Erro: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-slate-300 mb-1;
}

.form-input {
  @apply w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500;
}

.form-radio {
  @apply h-4 w-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500;
}

.btn-primary {
  @apply px-6 py-2 text-sm font-medium text-slate-900 bg-amber-400 rounded-md hover:bg-amber-300 disabled:bg-slate-600 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 transition-colors;
}
</style>