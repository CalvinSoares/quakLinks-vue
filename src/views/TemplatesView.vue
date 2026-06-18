<template>
  <DashboardLayout>
    <div class="p-4 h-full flex flex-col">
      <TemplatesHeader :active-tab="activeTab" @create="isCreateModalOpen = true" @tab-change="setActiveTab" />

      <main class="flex-1 overflow-y-auto custom-scrollbar">
        <TemplatesSearch
          v-if="activeTab === 'explore'"
          v-model:search="searchQuery"
          v-model:sortBy="sortBy"
          v-model:creator="creatorQuery"
          :tags="store.popularTags"
          :selected-tags="store.selectedTags"
          @toggle-tag="store.toggleTagFilter"
        />

        <TemplatesLoading v-if="store.isLoading && (!currentList || currentList.length === 0)" />

        <TemplatesEmpty
          v-else-if="!currentList || currentList.length === 0"
          :message="activeTab === 'explore' ? copy.emptyExplore : copy.emptyMine"
        />

        <TemplatesGrid
          v-else
          :templates="currentList"
          :variant="activeTab"
          :sort-by="sortBy"
          :has-more="activeTab === 'explore' && store.pagination.hasMore"
          :is-loading="store.isLoading"
          @view="openPreviewGate"
          @apply="handleApply"
          @favorite="handleFavorite"
          @edit="openEditModal"
          @delete="handleDelete"
          @copy-link="handleCopyLink"
          @load-more="loadMore"
        />
      </main>

      <TemplatePreviewGate
        :is-open="isPreviewGateOpen"
        :template="templateForQuickView"
        :is-loading="store.isDetailLoading"
        @close="closePreviewGate"
        @show-modal="openQuickViewModalFromGate"
      />

      <QuickViewModal
        :is-open="isQuickViewModalOpen"
        :template="templateForQuickView"
        :is-loading="store.isDetailLoading"
        @close="isQuickViewModalOpen = false"
        @apply="handleApply"
        @favorite="handleFavorite"
      />
      <CreateTemplateModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false" />
      <EditTemplateModal :is-open="isEditModalOpen" :template="templateForEdit" @close="isEditModalOpen = false" />
      <ConfirmationModal
        :is-open="isDeleteModalOpen"
        :title="copy.deleteModalTitle"
        :description="copy.deleteConfirm"
        :cancel-label="copy.cancel"
        :confirm-label="copy.confirmDelete"
        :loading-label="copy.deleteLoading"
        :is-loading="isDeletingTemplate"
        @close="closeDeleteModal"
        @confirm="confirmDeleteTemplate"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTemplatesStore, type Template, type TemplateListItem } from "@/store/templates";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import CreateTemplateModal from "@/components/templates/CreateTemplateModal.vue";
import { useDebounceFn } from "@vueuse/core";
import TemplatesHeader from "@/components/templates/TemplatesHeader.vue";
import TemplatesSearch from "@/components/templates/TemplatesSearch.vue";
import TemplatesLoading from "@/components/templates/TemplatesLoading.vue";
import TemplatesEmpty from "@/components/templates/TemplatesEmpty.vue";
import TemplatesGrid from "@/components/templates/TemplatesGrid.vue";
import { toast } from "vue-sonner";
import QuickViewModal from "@/components/templates/QuickViewModal.vue";
import TemplatePreviewGate from "@/components/templates/TemplatePreviewGate.vue";
import EditTemplateModal from "@/components/templates/EditTemplateModal.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";
import { copyTemplateShareLink } from "@/utils/templateShare";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";

type TabId = "explore" | "favorites" | "recent" | "mine";

const store = useTemplatesStore();
const route = useRoute();
const router = useRouter();
const activeTab = ref<TabId>("explore");
const searchQuery = ref("");
const creatorQuery = ref("");
const sortBy = ref<"popular" | "newest" | "oldest">("popular");

const isCreateModalOpen = ref(false);
const isPreviewGateOpen = ref(false);
const isQuickViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDeletingTemplate = ref(false);
const templateForQuickView = ref<TemplateListItem | Template | null>(null);
const templateForEdit = ref<Template | null>(null);
const templateIdPendingDeletion = ref<string | null>(null);
const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        emptyExplore: "No templates found.",
        emptyMine: "You have not created any templates yet.",
        applyLoading: "Applying template...",
        applySuccess: "Template applied successfully!",
        applyError: "Failed to apply template.",
        deleteConfirm: "Are you sure you want to delete this template? This action cannot be undone.",
        deleteModalTitle: "Delete template",
        deleteLoading: "Deleting template...",
        deleteSuccess: "Template deleted successfully.",
        cancel: "Cancel",
        confirmDelete: "Delete template",
        deleteError: "Failed to delete the template.",
        linkCopied: "Template link copied!",
        linkCopyError: "Failed to copy template link.",
      };
    case "es":
      return {
        emptyExplore: "No se encontraron plantillas.",
        emptyMine: "Aun no has creado ninguna plantilla.",
        applyLoading: "Aplicando plantilla...",
        applySuccess: "Plantilla aplicada con exito!",
        applyError: "Error al aplicar la plantilla.",
        deleteConfirm: "Seguro que deseas eliminar esta plantilla? Esta accion no se puede deshacer.",
        deleteModalTitle: "Eliminar plantilla",
        deleteLoading: "Eliminando plantilla...",
        deleteSuccess: "Plantilla eliminada con exito.",
        cancel: "Cancelar",
        confirmDelete: "Eliminar plantilla",
        deleteError: "Error al eliminar la plantilla.",
        linkCopied: "Enlace de la plantilla copiado!",
        linkCopyError: "Error al copiar el enlace de la plantilla.",
      };
    default:
      return {
        emptyExplore: "Nenhum modelo encontrado.",
        emptyMine: "Voce ainda nao criou nenhum modelo.",
        applyLoading: "Aplicando modelo...",
        applySuccess: "Modelo aplicado com sucesso!",
        applyError: "Falha ao aplicar o modelo.",
        deleteConfirm: "Tem certeza de que deseja excluir este modelo? Esta acao nao pode ser desfeita.",
        deleteModalTitle: "Excluir modelo",
        deleteLoading: "Excluindo modelo...",
        deleteSuccess: "Modelo excluido com sucesso.",
        cancel: "Cancelar",
        confirmDelete: "Excluir modelo",
        deleteError: "Falha ao excluir o modelo.",
        linkCopied: "Link do modelo copiado!",
        linkCopyError: "Falha ao copiar o link do modelo.",
      };
  }
});

const currentList = computed(() => {
  switch (activeTab.value) {
    case "explore":
      return store.templates;
    case "favorites":
      return store.favoriteTemplates;
    case "recent":
      return store.recentTemplates;
    case "mine":
      return store.myTemplates;
    default:
      return [];
  }
});

const debouncedSearch = useDebounceFn(() => {
  store.setFilter("search", searchQuery.value || undefined);
  store.setFilter("creatorName", creatorQuery.value || undefined);
}, 500);

watch(searchQuery, debouncedSearch);
watch(creatorQuery, debouncedSearch);
watch(sortBy, (newSort) => store.setFilter("sortBy", newSort));

onMounted(async () => {
  await store.fetchTemplates();
  store.fetchPopularTags();

  const previewId = route.query.preview;
  if (typeof previewId === "string" && previewId) {
    await openPreviewGate(previewId);
    router.replace({ query: { ...route.query, preview: undefined } });
  }
});

function setActiveTab(tab: TabId) {
  activeTab.value = tab;

  switch (tab) {
    case "explore":
      if (store.templates.length === 0) store.fetchTemplates();
      break;
    case "favorites":
      if (store.favoriteTemplates.length === 0) store.fetchFavoriteTemplates();
      break;
    case "recent":
      if (store.recentTemplates.length === 0) store.fetchRecentTemplates();
      break;
    case "mine":
      store.fetchMyTemplates();
      break;
  }
}

async function loadTemplateForPreview(templateId: string) {
  const listItem = currentList.value.find((t) => t.id === templateId);
  templateForQuickView.value = listItem ?? null;

  const fullTemplate = await store.fetchTemplateById(templateId);
  if (fullTemplate) {
    templateForQuickView.value = fullTemplate;
  }
}

async function openPreviewGate(templateId: string) {
  isPreviewGateOpen.value = true;
  await loadTemplateForPreview(templateId);
}

function closePreviewGate() {
  isPreviewGateOpen.value = false;
}

function openQuickViewModalFromGate() {
  if (!templateForQuickView.value) return;
  isPreviewGateOpen.value = false;
  isQuickViewModalOpen.value = true;
}

async function openEditModal(template: TemplateListItem) {
  const fullTemplate = await store.fetchTemplateById(template.id);
  templateForEdit.value = fullTemplate ?? store.selectedTemplate;
  isEditModalOpen.value = true;
}

function loadMore() {
  store.fetchTemplates(true);
}

async function handleApply(templateId: string) {
  const promise = () => store.applyTemplate(templateId);
  toast.promise(promise, {
    loading: copy.value.applyLoading,
    success: copy.value.applySuccess,
    error: copy.value.applyError,
  });
}

async function handleFavorite(template: TemplateListItem) {
  await store.toggleFavorite(template);
  if (templateForQuickView.value?.id === template.id) {
  const fromList =
      currentList.value.find((t) => t.id === template.id) ??
      store.selectedTemplate;
    if (fromList) {
      templateForQuickView.value = fromList;
    }
  }
}

async function handleCopyLink(templateId: string) {
  try {
    await copyTemplateShareLink(templateId);
    toast.success(copy.value.linkCopied);
  } catch {
    toast.error(copy.value.linkCopyError);
  }
}

function handleDelete(templateId: string) {
  templateIdPendingDeletion.value = templateId;
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  if (isDeletingTemplate.value) {
    return;
  }

  isDeleteModalOpen.value = false;
  templateIdPendingDeletion.value = null;
}

async function confirmDeleteTemplate() {
  if (!templateIdPendingDeletion.value) {
    return;
  }

  isDeletingTemplate.value = true;
  try {
    await store.deleteTemplate(templateIdPendingDeletion.value);
    toast.success(copy.value.deleteSuccess);
    isDeleteModalOpen.value = false;
    templateIdPendingDeletion.value = null;
  } catch {
    toast.error(copy.value.deleteError);
  } finally {
    isDeletingTemplate.value = false;
  }
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}
</style>
