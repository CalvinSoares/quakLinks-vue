<!-- src/views/dashboard/LinksView.vue -->
<template>
  <DashboardLayout>
    <div class="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mt-12">
          <SocialIConGrid @select="handleSelectSocial" />
        </div>
        <div class="my-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <LinksSection :links="linkStore.links" @edit="handleEditLink" @delete="handleDeleteLink"
          @reorder="handleReorderLinks" />
      </div>
      <AddLinkModal :is-open="isModalOpen" :social="selectedSocial" :editing-link="editingLink" @close="closeModal"
        @save="handleSaveLink" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usePageStore } from '@/store/page';
import { useLinkStore, type Link } from '@/store/links';


import type { Social } from '@/components/links/social';

import AddLinkModal from '@/components/links/AddLinkModal.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LinksSection from '@/components/links/LinksSection.vue';
import SocialIConGrid from '@/components/links/SocialIConGrid.vue';

const pageStore = usePageStore();
const linkStore = useLinkStore();

const isModalOpen = ref(false);
const selectedSocial = ref<Social | null>(null);
const editingLink = ref<Link | null>(null);

// Popula a linkStore quando a pageStore carregar os dados
watch(() => pageStore.currentPage, (newPage) => {
  if (newPage?.links) {
    linkStore.setLinks(newPage.links);
  }
}, { immediate: true });

onMounted(() => {
  if (!pageStore.currentPage) {
    pageStore.fetchMyPage();
  }
});

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedSocial.value = null;
  editingLink.value = null;
}

function handleSelectSocial(social: Social) {
  selectedSocial.value = social;
  editingLink.value = null; // Garante que não está em modo de edição
  openModal();
}

function handleEditLink(link: Link) {
  editingLink.value = link;
  selectedSocial.value = null; // Garante que não é um social pré-definido
  openModal();
}

async function handleDeleteLink(linkId: string) {
  if (confirm('Tem certeza que deseja remover este link?')) {
    await linkStore.deleteLink(linkId);
  }
}

async function handleSaveLink(linkData: {
  title: string,
  url: string,
  scheduledAt?: string | null,
  expiresAt?: string | null
}) {
  if (editingLink.value) {
    await linkStore.updateLink(editingLink.value.id, linkData);
  } else {
    await linkStore.createLink(linkData);
  }
  closeModal();
}

async function handleReorderLinks() {
  await linkStore.reorderLinks();
  // opcional: mostrar um toast de sucesso
}
</script>