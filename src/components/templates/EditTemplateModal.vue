<template>
  <BaseModal :is-open="isOpen" @close="resetAndClose" max-width="lg">
    <template #title>
      <div class="space-y-1">
        <h2 class="ui-modal-title">{{ copy.modalTitle }}</h2>
        <p class="ui-modal-copy">{{ copy.modalDescription }}</p>
      </div>
    </template>

    <form v-if="template" @submit.prevent="handleSubmit" class="space-y-5">
      <section class="section-card">
        <div class="space-y-1">
          <h3 class="section-title">{{ copy.basicSection }}</h3>
          <p class="section-copy">{{ copy.basicSectionHint }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label for="edit-name" class="ui-label">{{ copy.templateName }}</label>
            <input id="edit-name" v-model="form.name" type="text" required class="ui-input"
              :placeholder="copy.templateNamePlaceholder" />
          </div>

          <div class="md:col-span-2">
            <label class="ui-label">{{ copy.visibility }}</label>
            <div class="grid gap-3 md:grid-cols-2">
              <label v-for="option in visibilityOptions" :key="option.value"
                class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300 transition hover:border-slate-700"
                :class="form.visibility === option.value ? 'border-amber-400/40 bg-amber-400/10 text-white' : ''">
                <input v-model="form.visibility" type="radio" :value="option.value" name="visibility"
                  class="mt-1 ui-radio" />
                <span class="space-y-1">
                  <span class="block text-sm font-semibold">{{ option.label }}</span>
                  <span class="block text-xs text-slate-400">{{ option.description }}</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section class="section-card">
        <div class="space-y-1">
          <h3 class="section-title">{{ copy.previewSection }}</h3>
          <p class="section-copy">{{ copy.previewSectionHint }}</p>
        </div>

        <div class="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
          <div v-if="previewSource" class="space-y-3">
            <div class="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
              <img :src="previewSource" class="h-full w-full object-cover" />
              <button v-if="selectedFile" type="button"
                class="absolute right-3 top-3 rounded-full bg-slate-950/80 p-2 text-slate-200 transition hover:bg-red-500 hover:text-white"
                @click="removeFile">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <p class="truncate text-sm text-slate-300">
                {{ selectedFile?.name || copy.currentPreview }}
              </p>
              <label :for="fileInputId"
                class="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white">
                {{ copy.changeImage }}
              </label>
            </div>
          </div>

          <label v-else :for="fileInputId"
            class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl px-6 py-10 text-center transition hover:bg-slate-900/70">
            <PhotoIcon class="h-12 w-12 text-slate-500" />
            <div class="space-y-1">
              <p class="text-sm font-medium text-slate-200">{{ copy.selectFile }}</p>
              <p class="text-xs text-slate-500">{{ copy.fileHint }}</p>
            </div>
          </label>

          <input :id="fileInputId" :key="fileInputKey" type="file" class="sr-only"
            accept="image/png, image/jpeg, image/gif" @change="handleFileChange" />
        </div>
      </section>

      <section class="section-card">
        <div class="space-y-1">
          <h3 class="section-title">{{ copy.tagsSection }}</h3>
          <p class="section-copy">{{ copy.tagsSectionHint }}</p>
        </div>

        <TemplateTagsInput v-model="form.tags" :label="copy.tags" :placeholder="copy.addTag" :hint="copy.tagHint"
          :suggestions="store.popularTags" :suggestions-label="copy.suggestedTags" :empty-state-label="copy.noTagResults" />
      </section>
    </form>

    <template #footer>
      <button type="button" @click="resetAndClose" class="ui-btn-secondary">{{ copy.cancel }}</button>
      <button type="button" @click="handleSubmit" :disabled="isLoading" class="ui-btn-primary">
        {{ isLoading ? copy.saving : copy.saveChanges }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { PhotoIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';
import { useAppLanguage } from '@/composables/useAppLanguage';
import { useTemplatesStore, type Template, type UpdateTemplateInput } from '@/store/templates';
import BaseModal from '../modals/BaseModal.vue';
import TemplateTagsInput from './TemplateTagsInput.vue';

const props = defineProps<{ isOpen: boolean; template: Template | null }>();
const emit = defineEmits(['close']);
const store = useTemplatesStore();
const { locale } = useAppLanguage();

const isLoading = ref(false);
const preview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const fileInputKey = ref(0);
const fileInputId = 'template-preview-edit-upload';

const form = reactive<{
  name: string;
  previewImageUrl?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  tags: string[];
}>({
  name: '',
  previewImageUrl: '',
  visibility: 'PUBLIC',
  tags: [],
});

const copy = computed(() => {
  switch (locale.value) {
    case 'en':
      return {
        modalTitle: 'Edit Template',
        modalDescription: 'Update the metadata and presentation of your template without changing the original page snapshot.',
        basicSection: 'Template Details',
        basicSectionHint: 'Keep the title and visibility aligned with how you want the template to appear in your library.',
        templateName: 'Template Name',
        templateNamePlaceholder: 'Ex: Dark portfolio',
        previewSection: 'Preview Image',
        previewSectionHint: 'You can replace the cover image at any time to improve presentation.',
        previewImage: 'Preview Image',
        currentPreview: 'Current preview image',
        changeImage: 'Change image',
        selectFile: 'Choose an image',
        fileHint: 'PNG, JPG, GIF up to 10MB',
        tagsSection: 'Categories',
        tagsSectionHint: 'Keep the template inside the predefined category catalog used by search filters.',
        tags: 'Categories',
        addTag: 'Search categories',
        tagHint: 'Only predefined categories can be saved on templates.',
        suggestedTags: 'Available categories',
        noTagResults: 'No categories match this search.',
        visibility: 'Visibility',
        cancel: 'Cancel',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
        public: 'Public',
        publicDescription: 'Visible in explore and can be discovered by other users.',
        private: 'Private',
        privateDescription: 'Visible only in your own template list.',
        updated: 'Template updated successfully!',
        atLeastOneTag: 'Add at least one tag.',
        errorPrefix: 'Error',
      };
    case 'es':
      return {
        modalTitle: 'Editar Template',
        modalDescription: 'Actualiza los metadatos y la presentación del template sin cambiar el snapshot original de la página.',
        basicSection: 'Detalles del Template',
        basicSectionHint: 'Mantén el título y la visibilidad alineados con cómo quieres mostrar el template en tu biblioteca.',
        templateName: 'Nombre del Template',
        templateNamePlaceholder: 'Ej: Portfolio oscuro',
        previewSection: 'Imagen de Preview',
        previewSectionHint: 'Puedes cambiar la portada en cualquier momento para mejorar la presentación.',
        previewImage: 'Imagen de Preview',
        currentPreview: 'Imagen de preview actual',
        changeImage: 'Cambiar imagen',
        selectFile: 'Elegir imagen',
        fileHint: 'PNG, JPG, GIF hasta 10MB',
        tagsSection: 'Categorías',
        tagsSectionHint: 'Mantén el template dentro del catálogo predefinido de categorías usado por los filtros.',
        tags: 'Categorías',
        addTag: 'Buscar categorías',
        tagHint: 'Solo las categorías predefinidas se pueden guardar en templates.',
        suggestedTags: 'Categorías disponibles',
        noTagResults: 'Ninguna categoría coincide con esta búsqueda.',
        visibility: 'Visibilidad',
        cancel: 'Cancelar',
        saving: 'Guardando...',
        saveChanges: 'Guardar Cambios',
        public: 'Público',
        publicDescription: 'Visible en explorar y descubrible por otros usuarios.',
        private: 'Privado',
        privateDescription: 'Visible solo en tu propia lista de templates.',
        updated: 'Template actualizado con éxito!',
        atLeastOneTag: 'Agrega al menos una tag.',
        errorPrefix: 'Error',
      };
    default:
      return {
        modalTitle: 'Editar Template',
        modalDescription: 'Atualize os metadados e a apresentação do template sem alterar o snapshot original da página.',
        basicSection: 'Detalhes do Template',
        basicSectionHint: 'Mantenha o título e a visibilidade alinhados com a forma como o template deve aparecer na sua biblioteca.',
        templateName: 'Nome do Template',
        templateNamePlaceholder: 'Ex: Portfolio escuro',
        previewSection: 'Imagem de Preview',
        previewSectionHint: 'Você pode trocar a capa a qualquer momento para melhorar a apresentação.',
        previewImage: 'Imagem de Preview',
        currentPreview: 'Imagem de preview atual',
        changeImage: 'Trocar imagem',
        selectFile: 'Escolher imagem',
        fileHint: 'PNG, JPG, GIF até 10MB',
        tagsSection: 'Categorias',
        tagsSectionHint: 'Mantenha o template dentro do catálogo predefinido de categorias usado nos filtros.',
        tags: 'Categorias',
        addTag: 'Buscar categorias',
        tagHint: 'Apenas categorias predefinidas podem ser salvas em templates.',
        suggestedTags: 'Categorias disponíveis',
        noTagResults: 'Nenhuma categoria corresponde a esta busca.',
        visibility: 'Visibilidade',
        cancel: 'Cancelar',
        saving: 'Salvando...',
        saveChanges: 'Salvar Alterações',
        public: 'Público',
        publicDescription: 'Visível na exploração e pode ser descoberto por outros usuários.',
        private: 'Privado',
        privateDescription: 'Visível apenas na sua lista de templates.',
        updated: 'Template atualizado com sucesso!',
        atLeastOneTag: 'Adicione pelo menos uma tag.',
        errorPrefix: 'Erro',
      };
  }
});

const previewSource = computed(() => preview.value || form.previewImageUrl || '');

const visibilityOptions = computed(() => [
  {
    label: copy.value.public,
    description: copy.value.publicDescription,
    value: 'PUBLIC',
  },
  {
    label: copy.value.private,
    description: copy.value.privateDescription,
    value: 'PRIVATE',
  },
]);

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && store.popularTags.length === 0) {
      await store.fetchPopularTags();
    }

    if (isOpen && props.template) {
      populateForm(props.template);
    }

    if (!isOpen) {
      resetForm();
    }
  },
  { immediate: true },
);

watch(
  () => props.template,
  (newTemplate) => {
    if (!newTemplate) {
      return;
    }

    populateForm(newTemplate);
  },
  { immediate: true },
);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  selectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removeFile() {
  selectedFile.value = null;
  preview.value = null;
  fileInputKey.value += 1;
}

function populateForm(template: Template) {
  const allowedTags = new Set(store.popularTags.map((tag) => tag.name));
  form.name = template.name;
  form.previewImageUrl = template.previewImageUrl;
  form.visibility = template.visibility;
  form.tags = template.tags
    .map((tag) => tag.name)
    .filter((tag) => allowedTags.size === 0 || allowedTags.has(tag));
  preview.value = null;
  selectedFile.value = null;
  fileInputKey.value += 1;
}

function resetForm() {
  preview.value = null;
  selectedFile.value = null;
  fileInputKey.value += 1;
}

function resetAndClose() {
  resetForm();
  emit('close');
}

async function handleSubmit() {
  if (!props.template) {
    return;
  }

  if (form.tags.length === 0) {
    toast.error(copy.value.atLeastOneTag);
    return;
  }

  isLoading.value = true;

  const payload: UpdateTemplateInput = {
    name: form.name,
    previewImageUrl: form.previewImageUrl,
    visibility: form.visibility,
    tags: form.tags,
  };

  if (selectedFile.value) {
    payload.previewImageFile = selectedFile.value;
  }

  try {
    await store.updateTemplate(props.template.id, payload);
    toast.success(copy.value.updated);
    resetAndClose();
  } catch (error: any) {
    toast.error(`${copy.value.errorPrefix}: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.section-card {
  @apply space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4;
}

.section-title {
  @apply text-sm font-semibold uppercase tracking-[0.18em] text-slate-300;
}

.section-copy {
  @apply text-sm text-slate-500;
}
</style>
