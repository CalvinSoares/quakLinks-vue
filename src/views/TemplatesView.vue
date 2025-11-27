<template>
  <DashboardLayout>
    <div class="p-4 h-full flex flex-col">
      <TemplatesHeader :active-tab="activeTab" @create="isCreateModalOpen = true" @tab-change="setActiveTab" />

      <main class="flex-1 overflow-y-auto">
        <TemplatesSearch v-if="activeTab === 'explore'" v-model:search="searchQuery" v-model:sortBy="sortBy"
          v-model:creator="creatorQuery" />

        <TemplatesLoading v-if="store.isLoading && currentList.length === 0" />

        <TemplatesEmpty v-else-if="!currentList.length"
          :message="activeTab === 'explore' ? 'Nenhum template encontrado.' : 'Você ainda não criou nenhum template.'" />

        <TemplatesGrid v-else :templates="currentList" :variant="activeTab"
          :has-more="activeTab === 'explore' && store.pagination.hasMore" :is-loading="store.isLoading"
          @view="openDetailModal" @apply="handleApply" @favorite="handleFavorite" @edit="openEditModal"
          @delete="handleDelete" @load-more="loadMore" />
      </main>

      <TemplateDetailModal v-if="selectedTemplateId" :template-id="selectedTemplateId" :is-open="isDetailModalOpen"
        @close="isDetailModalOpen = false" />
      <CreateTemplateModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false" />
      <EditTemplateModal v-if="templateToEdit" :template="templateToEdit" :is-open="isEditModalOpen"
        @close="isEditModalOpen = false" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useTemplatesStore, type Template } from '@/store/templates'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import TemplateDetailModal from '@/components/templates/TemplateDetailModal.vue'
import CreateTemplateModal from '@/components/templates/CreateTemplateModal.vue'
import EditTemplateModal from '@/components/templates/EditTemplateModal.vue'
import { useDebounceFn } from '@vueuse/core'
import TemplatesHeader from '@/components/templates/TemplatesHeader.vue'
import TemplatesSearch from '@/components/templates/TemplatesSearch.vue'
import TemplatesLoading from '@/components/templates/TemplatesLoading.vue'
import TemplatesEmpty from '@/components/templates/TemplatesEmpty.vue'
import TemplatesGrid from '@/components/templates/TemplatesGrid.vue'

type TabId = 'explore' | 'favorites' | 'recent' | 'mine';


const store = useTemplatesStore()
const activeTab = ref<TabId>('explore')
const searchQuery = ref('')
const creatorQuery = ref('')
const sortBy = ref<'popular' | 'newest' | 'oldest'>('popular')

const isDetailModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedTemplateId = ref<string | null>(null)
const templateToEdit = ref<Template | null>(null)

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
  store.fetchTemplates()
})


function setActiveTab(tab: TabId) {
  activeTab.value = tab
  // Lógica para buscar os dados corretos para cada aba
  switch (tab) {
    case 'explore': store.fetchTemplates(); break;
    case 'favorites': store.fetchFavoriteTemplates(); break;
    case 'recent': store.fetchRecentTemplates(); break;
    case 'mine': store.fetchMyTemplates(); break;
  }
}

function openDetailModal(templateId: string) {
  selectedTemplateId.value = templateId
  isDetailModalOpen.value = true
}

function openEditModal(template: Template) {
  templateToEdit.value = template
  isEditModalOpen.value = true
}

function loadMore() {
  store.fetchTemplates(true)
}

async function handleApply(templateId: string) {
  const success = await store.applyTemplate(templateId)
  if (success) {
    alert('Template aplicado com sucesso!')
  } else {
    alert('Falha ao aplicar o template.')
  }
}

function handleFavorite(template: Template) {
  store.toggleFavorite(template)
}

async function handleDelete(templateId: string) {
  if (confirm('Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.')) {
    try {
      await store.deleteTemplate(templateId)
      alert('Template excluído com sucesso.')
    } catch (error) {
      alert('Falha ao excluir o template.')
    }
  }
}
</script>
