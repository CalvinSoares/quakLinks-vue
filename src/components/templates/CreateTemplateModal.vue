<template>
  <BaseModal :is-open="isOpen" @close="resetAndClose" max-width="lg">
    <template #title>
      <div class="space-y-1">
        <h2 class="ui-modal-title">{{ copy.modalTitle }}</h2>
        <p class="ui-modal-copy">{{ copy.modalDescription }}</p>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <section class="section-card">
        <div class="space-y-1">
          <h3 class="section-title">{{ copy.basicSection }}</h3>
          <p class="section-copy">{{ copy.basicSectionHint }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label for="template-page" class="ui-label">{{ copy.pageLabel }}</label>
            <CustomDropdown
              id="template-page"
              v-model="selectedPageId"
              :options="pageDropdownOptions"
              :placeholder="copy.pagePlaceholder"
            />
            <p class="mt-2 text-xs text-slate-500">{{ copy.pageHint }}</p>
          </div>

          <div class="md:col-span-2">
            <label for="template-name" class="ui-label">{{ copy.templateName }}</label>
            <input id="template-name" v-model="form.name" type="text" required class="ui-input"
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
          <div v-if="preview" class="space-y-3">
            <div class="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
              <img :src="preview" class="h-full w-full object-cover" />
              <button type="button"
                class="absolute right-3 top-3 rounded-full bg-slate-950/80 p-2 text-slate-200 transition hover:bg-red-500 hover:text-white"
                @click="removeFile">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <p class="truncate text-sm text-slate-300">{{ selectedFile?.name }}</p>
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
        {{ isLoading ? copy.creating : copy.createTemplate }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { PhotoIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';
import { useAppLanguage } from '@/composables/useAppLanguage';
import { useTemplatesStore, type CreateTemplateInput } from '@/store/templates';
import { usePageStore } from '@/store/page';
import BaseModal from '../modals/BaseModal.vue';
import TemplateTagsInput from './TemplateTagsInput.vue';
import CustomDropdown from '@/components/ui/CustomDropdown.vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const store = useTemplatesStore();
const pageStore = usePageStore();
const { locale } = useAppLanguage();
const { userPages, currentPage } = storeToRefs(pageStore);

const isLoading = ref(false);
const preview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const selectedPageId = ref('');
const fileInputKey = ref(0);
const fileInputId = 'template-preview-upload';

const form = reactive<{
  name: string;
  tags: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}>({
  name: '',
  tags: [],
  visibility: 'PUBLIC',
});

const copy = computed(() => {
  switch (locale.value) {
    case 'en':
      return {
        modalTitle: 'Create New Template',
        modalDescription: 'Choose a page, organize the template metadata, and publish a cleaner version of your design.',
        basicSection: 'Base Page',
        basicSectionHint: 'The selected page defines the visual snapshot, blocks, and audio stored in this template.',
        pageLabel: 'Page',
        pagePlaceholder: 'Select the page',
        pageHint: 'Pick which page should be used as the source for the new template.',
        pageRequired: 'Select a page before creating the template.',
        templateName: 'Template Name',
        templateNamePlaceholder: 'Ex: Dark portfolio',
        previewSection: 'Preview Image',
        previewSectionHint: 'Use a cover image that represents the final look of the template.',
        previewImage: 'Preview Image',
        selectFile: 'Choose an image',
        changeImage: 'Change image',
        fileHint: 'PNG, JPG, GIF up to 10MB',
        tagsSection: 'Categories',
        tagsSectionHint: 'Choose from the predefined categories to keep discovery organized.',
        tags: 'Categories',
        addTag: 'Search categories',
        tagHint: 'Templates use a controlled tag catalog to keep filters compact.',
        suggestedTags: 'Available categories',
        noTagResults: 'No categories match this search.',
        visibility: 'Visibility',
        cancel: 'Cancel',
        creating: 'Creating...',
        createTemplate: 'Create Template',
        public: 'Public',
        publicDescription: 'Visible in explore and can be discovered by other users.',
        private: 'Private',
        privateDescription: 'Visible only in your own template list.',
        previewRequired: 'Please select a preview image.',
        atLeastOneTag: 'Add at least one tag.',
        loadingToast: 'Creating your new template...',
        successToast: (name: string) => `Template "${name}" created successfully!`,
        errorToast: 'An error occurred while creating the template.',
      };
    case 'es':
      return {
        modalTitle: 'Crear Nueva Plantilla',
        modalDescription: 'Elige una pagina, organiza los metadatos de la plantilla y publica una version mas clara de tu diseno.',
        basicSection: 'Página Base',
        basicSectionHint: 'La pagina seleccionada define la vista visual, los bloques y los audios guardados en esta plantilla.',
        pageLabel: 'Página',
        pagePlaceholder: 'Selecciona la página',
        pageHint: 'Elige que pagina sera la base de la nueva plantilla.',
        pageRequired: 'Selecciona una pagina antes de crear la plantilla.',
        templateName: 'Nombre de la Plantilla',
        templateNamePlaceholder: 'Ej: Portfolio oscuro',
        previewSection: 'Imagen de Vista Previa',
        previewSectionHint: 'Usa una portada que represente el resultado visual de la plantilla.',
        previewImage: 'Imagen de Vista Previa',
        selectFile: 'Elegir imagen',
        changeImage: 'Cambiar imagen',
        fileHint: 'PNG, JPG, GIF hasta 10MB',
        tagsSection: 'Categorías',
        tagsSectionHint: 'Elige entre las categorías predefinidas para mantener el descubrimiento organizado.',
        tags: 'Categorías',
        addTag: 'Buscar categorías',
        tagHint: 'Las plantillas usan un catalogo controlado de etiquetas para evitar filtros gigantes.',
        suggestedTags: 'Categorías disponibles',
        noTagResults: 'Ninguna categoría coincide con esta búsqueda.',
        visibility: 'Visibilidad',
        cancel: 'Cancelar',
        creating: 'Creando...',
        createTemplate: 'Crear Plantilla',
        public: 'Público',
        publicDescription: 'Visible en explorar y descubrible por otros usuarios.',
        private: 'Privado',
        privateDescription: 'Visible solo en tu propia lista de plantillas.',
        previewRequired: 'Por favor, selecciona una imagen de vista previa.',
        atLeastOneTag: 'Agrega al menos una etiqueta.',
        loadingToast: 'Creando tu nueva plantilla...',
        successToast: (name: string) => `Plantilla "${name}" creada con exito!`,
        errorToast: 'Ocurrio un error al crear la plantilla.',
      };
    default:
      return {
        modalTitle: 'Criar Novo Modelo',
        modalDescription: 'Escolha uma pagina, organize os metadados do modelo e publique uma versao mais clara do seu design.',
        basicSection: 'Página Base',
        basicSectionHint: 'A pagina selecionada define a previa visual, os blocos e os audios salvos neste modelo.',
        pageLabel: 'Página',
        pagePlaceholder: 'Selecione a página',
        pageHint: 'Escolha qual pagina deve ser usada como base do novo modelo.',
        pageRequired: 'Selecione uma pagina antes de criar o modelo.',
        templateName: 'Nome do Modelo',
        templateNamePlaceholder: 'Ex: Portfolio escuro',
        previewSection: 'Imagem de Previa',
        previewSectionHint: 'Use uma capa que represente bem o resultado visual do modelo.',
        previewImage: 'Imagem de Previa',
        selectFile: 'Escolher imagem',
        changeImage: 'Trocar imagem',
        fileHint: 'PNG, JPG, GIF até 10MB',
        tagsSection: 'Categorias',
        tagsSectionHint: 'Escolha entre categorias predefinidas para manter a descoberta organizada.',
        tags: 'Categorias',
        addTag: 'Buscar categorias',
        tagHint: 'Modelos usam um catalogo controlado de tags para evitar filtros gigantes.',
        suggestedTags: 'Categorias disponíveis',
        noTagResults: 'Nenhuma categoria corresponde a esta busca.',
        visibility: 'Visibilidade',
        cancel: 'Cancelar',
        creating: 'Criando...',
        createTemplate: 'Criar Modelo',
        public: 'Público',
        publicDescription: 'Visível na exploração e pode ser descoberto por outros usuários.',
        private: 'Privado',
        privateDescription: 'Visivel apenas na sua lista de modelos.',
        previewRequired: 'Por favor, selecione uma imagem de previa.',
        atLeastOneTag: 'Adicione pelo menos uma tag.',
        loadingToast: 'Criando seu novo modelo...',
        successToast: (name: string) => `Modelo "${name}" criado com sucesso!`,
        errorToast: 'Ocorreu um erro ao criar o modelo.',
      };
  }
});

const pageOptions = computed(() =>
  userPages.value.map((page) => ({
    id: page.id,
    label: `${page.title || 'Sem título'} (/${page.slug})`,
  })),
);

const pageDropdownOptions = computed(() =>
  pageOptions.value.map((page) => ({
    label: page.label,
    value: page.id,
  })),
);

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
    if (!isOpen) {
      resetForm();
      return;
    }

    if (userPages.value.length === 0) {
      await pageStore.fetchUserPages();
    }

    if (store.popularTags.length === 0) {
      await store.fetchPopularTags();
    }

    selectedPageId.value =
      currentPage.value?.id ||
      (userPages.value.length === 1 ? userPages.value[0]?.id || '' : '');
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

function resetForm() {
  form.name = '';
  form.tags = [];
  form.visibility = 'PUBLIC';
  selectedPageId.value = '';
  removeFile();
}

function resetAndClose() {
  resetForm();
  emit('close');
}

async function handleSubmit() {
  if (!selectedPageId.value) {
    toast.error(copy.value.pageRequired);
    return;
  }

  if (!selectedFile.value) {
    toast.error(copy.value.previewRequired);
    return;
  }

  if (form.tags.length === 0) {
    toast.error(copy.value.atLeastOneTag);
    return;
  }

  isLoading.value = true;

  const payload: CreateTemplateInput = {
    pageId: selectedPageId.value,
    ...form,
    previewImageFile: selectedFile.value,
  };

  const promise = () => store.createTemplate(payload);

  toast.promise(promise, {
    loading: copy.value.loadingToast,
    success: (data: any) => {
      resetAndClose();
      return copy.value.successToast(data.name);
    },
    error: (err: any) => err.message || copy.value.errorToast,
    finally: () => {
      isLoading.value = false;
    },
  });
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

.input-modern {
  @apply w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/40;
}
</style>
