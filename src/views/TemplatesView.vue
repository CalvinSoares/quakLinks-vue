<template>
  <DashboardLayout>
    <div class="p-4 h-full flex flex-col">
      <TemplatesHeader :active-tab="activeTab" @create="isCreateModalOpen = true" @tab-change="setActiveTab" />

      <main class="flex-1 overflow-y-auto custom-scrollbar">
        <TemplatesSearch v-if="activeTab === 'explore'" v-model:search="searchQuery" v-model:sortBy="sortBy"
          v-model:creator="creatorQuery" :tags="store.popularTags" :selected-tags="store.selectedTags"
          @toggle-tag="store.toggleTagFilter" />

        <TemplatesLoading v-if="store.isLoading && (!currentList || currentList.length === 0)" />

        <TemplatesEmpty v-else-if="!currentList || currentList.length === 0"
          :message="activeTab === 'explore' ? 'Nenhum template encontrado.' : 'Você ainda não criou nenhum template.'" />

        <TemplatesGrid v-else :templates="currentList" :variant="activeTab"
          :has-more="activeTab === 'explore' && store.pagination.hasMore" :is-loading="store.isLoading"
          @view="openQuickViewModal" @apply="handleApply" @favorite="handleFavorite" @edit="handleEdit"
          @delete="handleDelete" @load-more="loadMore" />
      </main>

      <QuickViewModal :is-open="isQuickViewModalOpen" :template="templateForQuickView"
        @close="isQuickViewModalOpen = false" @apply="handleApply" @favorite="handleFavorite" />
      <CreateTemplateModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false" />
      <EditTemplateModal v-if="templateToEdit" :template="templateToEdit" :is-open="isEditModalOpen"
        @close="isEditModalOpen = false" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useTemplatesStore, type Template, type TemplateListItem } from '@/store/templates'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import CreateTemplateModal from '@/components/templates/CreateTemplateModal.vue'
import EditTemplateModal from '@/components/templates/EditTemplateModal.vue'
import { useDebounceFn } from '@vueuse/core'
import TemplatesHeader from '@/components/templates/TemplatesHeader.vue'
import TemplatesSearch from '@/components/templates/TemplatesSearch.vue'
import TemplatesLoading from '@/components/templates/TemplatesLoading.vue'
import TemplatesEmpty from '@/components/templates/TemplatesEmpty.vue'
import TemplatesGrid from '@/components/templates/TemplatesGrid.vue'
import { toast } from 'vue-sonner'
import QuickViewModal from '@/components/templates/QuickViewModal.vue'

type TabId = 'explore' | 'favorites' | 'recent' | 'mine';


const store = useTemplatesStore()
const activeTab = ref<TabId>('explore')
const searchQuery = ref('')
const creatorQuery = ref('')
const sortBy = ref<'popular' | 'newest' | 'oldest'>('popular')

const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const templateToEdit = ref<Template | null>(null)
const isQuickViewModalOpen = ref(false);
const templateForQuickView = ref<TemplateListItem | null>(null);

const currentList = computed(() => {
  switch (activeTab.value) {
    case 'explore': return store.templates;
    case 'favorites': return store.favoriteTemplates;
    case 'recent': return store.recentTemplates;
    case 'mine': return store.myTemplates;
    default: return [];
  }
})

const debouncedSearch = useDebounceFn(() => {
  store.setFilter('search', searchQuery.value || undefined)
  store.setFilter('creatorName', creatorQuery.value || undefined)
}, 500)

watch(searchQuery, debouncedSearch)
watch(creatorQuery, debouncedSearch)
watch(sortBy, (newSort) => store.setFilter('sortBy', newSort))

onMounted(() => {
  store.fetchTemplates();
  store.fetchPopularTags();
})


function setActiveTab(tab: TabId) {
  activeTab.value = tab;

  switch (tab) {
    case 'explore':
      if (store.templates.length === 0) store.fetchTemplates();
      break;
    case 'favorites':
      if (store.favoriteTemplates.length === 0) store.fetchFavoriteTemplates();
      break;
    case 'recent':
      if (store.recentTemplates.length === 0) store.fetchRecentTemplates();
      break;
    case 'mine':
      store.fetchMyTemplates();
      break;
  }
}
function openQuickViewModal(templateId: string) {
  const foundTemplate = currentList.value.find(t => t.id === templateId);
  if (foundTemplate) {
    templateForQuickView.value = foundTemplate;
    isQuickViewModalOpen.value = true;
  }
}
async function handleEdit(item: TemplateListItem) {
  await store.fetchTemplateById(item.id);

  if (store.selectedTemplate) {
    templateToEdit.value = store.selectedTemplate;

    isEditModalOpen.value = true;
  } else {
    toast.error("Error: Could not load template details for editing.");
  }
}

function loadMore() {
  store.fetchTemplates(true)
}

async function handleApply(templateId: string) {
  const promise = () => store.applyTemplate(templateId);
  toast.promise(promise, {
    loading: 'Aplicando template...',
    success: 'Template aplicado com sucesso!',
    error: 'Falha ao aplicar o template.',
  });
}

function handleFavorite(template: TemplateListItem) {
  store.toggleFavorite(template)
}

async function handleDelete(templateId: string) {
  if (confirm('Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.')) {
    const promise = () => store.deleteTemplate(templateId);
    toast.promise(promise, {
      loading: 'Excluindo template...',
      success: 'Template excluído com sucesso.',
      error: 'Falha ao excluir o template.',
    });
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
