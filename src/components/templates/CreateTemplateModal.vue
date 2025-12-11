<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')" max-width="md">
    <template #title>Criar Novo Template</template>

    <p class="mt-1 text-sm text-slate-400">Compartilhe o design da sua página com a comunidade.</p>

    <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
      <div>
        <label for="name" class="form-label">Nome do Template</label>
        <input v-model="form.name" id="name" type="text" required class="form-input" />
      </div>
      <div>
        <label class="form-label">Imagem de Preview</label>
        <div
          class="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
          <div v-if="!preview" class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48"
              aria-hidden="true">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <div class="flex text-sm text-slate-400">
              <label for="file-upload"
                class="relative cursor-pointer rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none">
                <span>Selecione um arquivo</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange"
                  accept="image/png, image/jpeg, image/gif" required>
              </label>
            </div>
            <p class="text-xs text-slate-500">PNG, JPG, GIF até 10MB</p>
          </div>
          <div v-else class="relative w-full aspect-video">
            <img :src="preview" class="w-full h-full object-contain rounded-md" />
            <button @click="removeFile" type="button"
              class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div>
        <label for="tags" class="form-label">Tags</label>
        <div class="form-input flex items-center flex-wrap gap-2 overflow-y-auto h-[20vh]">
          <span v-for="(tag, index) in form.tags" :key="tag"
            class="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-sm font-medium px-2.5 py-1 rounded-full">
            {{ tag }}
            <button @click="removeTag(index)" type="button" class="text-amber-500 hover:text-white">
              <XMarkIcon class="w-3 h-3" />
            </button>
          </span>
          <input id="tags" v-model="newTag" @keydown.enter.prevent="addTag" @keydown.,.prevent="addTag"
            @keydown.backspace="handleBackspace" type="text"
            class="bg-transparent flex-grow focus:outline-none min-w-[100px]" placeholder="Adicione uma tag..." />
        </div>
        <p class="text-xs text-slate-500 mt-1">Pressione Enter ou vírgula para adicionar uma tag.</p>
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
        {{ isLoading ? 'Criando...' : 'Criar Template' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTemplatesStore, type CreateTemplateInput } from '@/store/templates';
import BaseModal from '../modals/BaseModal.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);
const store = useTemplatesStore();

const isLoading = ref(false);
const newTag = ref('');
const preview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);



const form = reactive<{
  name: string;
  tags: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}>({
  name: '',
  tags: [],
  visibility: 'PUBLIC',
})

const visibilityOptions = [
  { label: 'Público', value: 'PUBLIC' },
  { label: 'Privado', value: 'PRIVATE' },
];

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    // Cria um preview local da imagem
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
  // Limpa o input para permitir selecionar o mesmo arquivo novamente
  const input = document.getElementById('file-upload') as HTMLInputElement;
  if (input) input.value = '';
}

function addTag() {
  const tagToAdd = newTag.value.trim();
  // Evita tags vazias ou duplicadas
  if (tagToAdd && !form.tags.includes(tagToAdd)) {
    form.tags.push(tagToAdd);
  }
  newTag.value = ''; // Limpa o input
}

function removeTag(index: number) {
  form.tags.splice(index, 1);
}

// Opcional: permite remover a última tag com a tecla Backspace
function handleBackspace() {
  if (newTag.value === '' && form.tags.length > 0) {
    form.tags.pop();
  }
}

function resetForm() {
  form.name = '';
  form.tags = [];
  newTag.value = '';
  form.visibility = 'PUBLIC';
  removeFile();
}

function resetAndClose() {
  resetForm();
  emit('close');
}

async function handleSubmit() {
  if (!selectedFile.value) {
    toast.error('Por favor, selecione uma imagem de preview.');
    return;
  }

  if (form.tags.length === 0) {
    toast.error('Adicione pelo menos uma tag.');
    return;
  }


  isLoading.value = true;

  const payload: CreateTemplateInput = {
    ...form,
    previewImageFile: selectedFile.value,
  };

  const promise = () => store.createTemplate(payload);

  toast.promise(promise, {
    loading: 'Criando seu novo template...',
    success: (data: any) => {
      resetAndClose();
      return `Template "${data.name}" criado com sucesso!`;
    },
    error: (err: any) => {
      // Retorna a mensagem de erro da sua API, ou uma mensagem padrão
      return err.message || 'Ocorreu um erro ao criar o template.';
    },
    finally: () => {
      isLoading.value = false;
    }
  });
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