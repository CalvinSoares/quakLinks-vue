<template>
  <DashboardLayout>
    <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0B0F19] text-white font-sans rounded-lg shadow-lg">
      <AppearanceSidebar :active-tab="activeTab" :is-dirty="isDirty" :is-editing-page="isEditingPage"
        :is-loading="pageStore.isLoading" :is-saving="isSaving" :user-pages="pageStore.userPages"
        @back="handleBackToSelection" @save="saveChanges" @select-page="selectPage" @select-tab="activeTab = $event">
        <AppearanceProfileTab v-if="activeTab === 'profile'" key="profile" :form="form" @upload="handleAssetChange"
          @remove="removeAsset" @open-effects="isEffectsModalOpen = true" />

        <AppearanceStyleTab v-else-if="activeTab === 'style'" key="style" :form="form" />

        <AppearanceBackgroundTab v-else-if="activeTab === 'background'" key="background" :form="form"
          :is-body-gradient="isBodyGradient" :available-background-tabs="availableBackgroundTabs"
          @change-layout="changeLayout" @update:isBodyGradient="isBodyGradient = $event" @upload="handleAssetChange"
          @remove="removeAsset" />

        <AppearanceExtrasTab v-else-if="activeTab === 'extras'" key="extras" :form="form"
          :audio-count="pageStore.currentPage?.audios?.length || 0" @upload="handleAssetChange" @remove="removeAsset"
          @open-audio-manager="isAudioManagerOpen = true" />

        <div v-else-if="activeTab === 'blocks'" key="blocks">
          <BlockManager @edit="openBlockEditor" />
        </div>
      </AppearanceSidebar>

      <AppearanceBlockEditorModal :block="editingBlock" :content="editingBlockContent" @close="editingBlock = null"
        @save="saveBlockEdit" />

      <AppearancePreviewPanel :is-editing-page="isEditingPage" :preview-data="previewData" :preview-mode="previewMode"
        @update:preview-mode="previewMode = $event" />

      <AppearanceUnsavedChangesModal :open="showUnsavedModal" @discard="confirmExit(false)"
        @save-and-exit="confirmExit(true)" />


    </div>
  </DashboardLayout>


  <TitleEffectsModal v-if="isEffectsModalOpen" v-model="form.titleEffect" :title="form.title"
    @close="isEffectsModalOpen = false" />
  <AudioManagerModal v-if="isAudioManagerOpen" :audios="pageStore.currentPage?.audios || []"
    :shuffle="form.shuffleAudios" :showPlayer="form.showAudioPlayer" :showEmbeds="form.showEmbeds"
    @close="isAudioManagerOpen = false" @add="handleAddAudio" @update="handleUpdateAudio" @delete="handleDeleteAudio"
    @set-active="handleSetActiveAudio" @update:shuffle="v => form.shuffleAudios = v"
    @update:showPlayer="v => form.showAudioPlayer = v" @update:showEmbeds="v => form.showEmbeds = v" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { usePageStore, type Page } from '@/store/page'
import { uploadFileWithSignedUrl } from '@/services/uploadService'
import AppearanceBlockEditorModal from '@/components/appearance/AppearanceBlockEditorModal.vue'
import AppearanceBackgroundTab from '@/components/appearance/AppearanceBackgroundTab.vue'
import AppearanceExtrasTab from '@/components/appearance/AppearanceExtrasTab.vue'
import AppearancePreviewPanel from '@/components/appearance/AppearancePreviewPanel.vue'
import AppearanceProfileTab from '@/components/appearance/AppearanceProfileTab.vue'
import AppearanceSidebar from '@/components/appearance/AppearanceSidebar.vue'
import AppearanceStyleTab from '@/components/appearance/AppearanceStyleTab.vue'
import AppearanceUnsavedChangesModal from '@/components/appearance/AppearanceUnsavedChangesModal.vue'
import { useUserStore } from '@/store/user'
import AudioManagerModal from '@/components/appearance/AudioManagerModal.vue'
import TitleEffectsModal from '@/components/appearance/TitleEffectsModal.vue'
import { toast } from 'vue-sonner'
import BlockManager from '@/components/BlockManager.vue'
import { useAuthStore } from '@/store/auth'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import isEqual from 'lodash/isEqual'

const activeTab = ref('profile')
type UploadableField = 'avatarUrl' | 'backgroundUrl' | 'cursorUrl' | 'backgroundVideoUrl'
type UploadType = 'avatar' | 'background' | 'audio' | 'cursor' | 'video';
interface AssetChangeEvent { file: File; field: UploadableField; uploadType: UploadType }

const route = useRoute();
const userStore = useUserStore()
const pageStore = usePageStore()
const isSaving = ref(false)
const isAudioManagerOpen = ref(false);
const isEffectsModalOpen = ref(false);
const isBodyGradient = ref(false);
const editingBlock = ref<any>(null);
const editingBlockContent = ref<any>({});
const showUnsavedModal = ref(false);
const pendingNavigation = ref<null | (() => void)>(null);
const isEditingPage = computed(() => !!route.query.slug);

const form = reactive({
  title: '',
  bio: '',
  location: '',
  avatarUrl: null as string | null,
  backgroundUrl: null as string | null,
  backgroundVideoUrl: null as string | null,
  cursorUrl: null as string | null,
  imageProvider: 'LOCAL',
  shuffleAudios: false,
  showAudioPlayer: true,
  showEmbeds: true,
  backgroundType: 'solid',
  gradientDirection: 'to bottom',
  gradientColorA: '#1E3A8A',
  gradientColorB: '#4C1D95',
  backgroundColor: '#1E293B',
  textColor: '#FFFFFF',
  iconColor: '#CCCCCC',
  fontFamily: 'Inter',
  buttonStyle: 'solid',
  buttonColor: null as string | null,
  buttonRoundness: 'rounded-lg',
  backgroundOverlay: 'none',
  backgroundBlur: 0,
  titleEffect: 'none',
  showProfileCard: true,
  profileCardColor: '#1f293780',
  profileCardOpacity: 0.2,
  showViewCount: true,
  buttonShadow: false,
  linkStyle: 'classic',
  layoutLinkStyle: 'list',
  useStandardIconColors: true,
  glowEffect: "none",
  profileRingType: 'none',
  profileRingColors: ['#FFFFFF', '#8B5CF6'],
  pageLayout: 'standard',

})

const authStore = useAuthStore();
const router = useRouter();
const pendingFiles = reactive<Partial<Record<UploadableField, File>>>({})
const previewMode = ref('mobile');
const previewData = computed(() => ({
  ...form,
  viewCount: pageStore.currentPage?.viewCount || 0,
  audios: pageStore.currentPage?.audios || [],
  isBodyGradient: isBodyGradient.value
}))

const originalForm = ref({});

const isDirty = computed(() => {
  return !isEqual(form, originalForm.value);
});

watch(() => pageStore.currentPage, (newPage) => {
  if (newPage) {

    Object.assign(form, {
      title: newPage.title ?? '',
      bio: newPage.bio ?? '',
      location: newPage.location ?? '',

      backgroundType: newPage.backgroundType ?? 'solid',
      gradientDirection: newPage.gradientDirection ?? 'to bottom',
      gradientColorA: newPage.gradientColorA ?? '#1E3A8A',
      gradientColorB: newPage.gradientColorB ?? '#4C1D95',
      backgroundColor: newPage.backgroundColor ?? '#1E293B',
      backgroundUrl: newPage.backgroundUrl ?? null,
      backgroundVideoUrl: newPage.backgroundVideoUrl ?? null,
      backgroundOverlay: newPage.backgroundOverlay ?? 'none',
      backgroundBlur: newPage.backgroundBlur ?? 0,
      pageLayout: newPage.pageLayout ?? 'standard',
      isBodyGradient: true,


      textColor: newPage.textColor ?? '#FFFFFF',
      iconColor: newPage.iconColor ?? '#CCCCCC',
      useStandardIconColors: newPage.useStandardIconColors ?? true,
      glowEffect: newPage.glowEffect ?? 'none',
      fontFamily: newPage.fontFamily ?? 'Inter',
      titleEffect: newPage.typewriterEffect ? 'typewriter' : (newPage.titleEffect ?? 'none'),


      linkStyle: newPage.linkStyle ?? 'classic',
      layoutLinkStyle: newPage.layoutLinkStyle ?? 'list',
      buttonStyle: newPage.buttonStyle ?? 'solid',
      buttonColor: newPage.buttonColor ?? null,
      buttonRoundness: newPage.buttonRoundness ?? 'rounded-lg',
      buttonShadow: newPage.buttonShadow ?? false,


      avatarUrl: newPage.avatarUrl ?? null,
      imageProvider: authStore.user?.imageProvider || 'LOCAL',
      cursorUrl: newPage.cursorUrl ?? null,
      profileRingType: newPage.profileRingType ?? 'none',
      profileRingColors: (newPage.profileRingColors && newPage.profileRingColors.length > 0)
        ? [...newPage.profileRingColors]
        : ['#FFFFFF', '#8B5CF6'],

      showProfileCard: newPage.showProfileCard ?? true,
      profileCardColor: newPage.profileCardColor ?? '#1f293780',
      profileCardOpacity: newPage.profileCardOpacity ?? 0.2,
      showViewCount: newPage.showViewCount ?? true,

      shuffleAudios: newPage.shuffleAudios ?? false,
      showAudioPlayer: newPage.showAudioPlayer ?? true,
      showEmbeds: newPage.showEmbeds ?? true,
    });

    nextTick(() => {
      originalForm.value = JSON.parse(JSON.stringify(form));
    });
  }
}, { immediate: true });

onMounted(async () => {
  const slug = route.query.slug as string;

  await pageStore.fetchUserPages(1);

  if (slug) {
    await pageStore.fetchPageBySlug(slug);
    return;
  }

  const firstPage = pageStore.userPages[0];
  if (firstPage) {
    await pageStore.fetchPageBySlug(firstPage.slug);
  }
});

async function selectPage(slug: string) {
  if (isDirty.value) {
    requestExit(() => {
      router.push({ query: { slug } });
      pageStore.fetchPageBySlug(slug);
    });
  } else {
    await router.push({ query: { slug } });
    await pageStore.fetchPageBySlug(slug);
  }
}

function handleBackToSelection() {
  requestExit(() => {
    router.push({ query: {} });
    pageStore.currentPage = null;
  });
}

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    requestExit(() => next());
  } else {
    next();
  }
});

function requestExit(callback: () => void) {
  pendingNavigation.value = callback;
  showUnsavedModal.value = true;
}

async function confirmExit(save: boolean) {
  showUnsavedModal.value = false;

  if (save) {
    await saveChanges();
  } else {
    Object.assign(form, originalForm.value);
  }

  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
}


function handleAssetChange({ file, field }: AssetChangeEvent) {
  pendingFiles[field] = file
  const reader = new FileReader()
  reader.onload = (e) => { form[field] = e.target?.result as string }
  reader.readAsDataURL(file)
}

function removeAsset(field: UploadableField) {
  form[field] = null
  delete pendingFiles[field]
}

function openBlockEditor(block: any) {
  editingBlock.value = block;
  editingBlockContent.value = { ...block.content };
}

async function saveBlockEdit() {
  if (editingBlock.value) {
    await pageStore.updateBlock(editingBlock.value.id, {
      content: editingBlockContent.value
    });
    editingBlock.value = null;
  }
}


const handleAddAudio = (data: any) => pageStore.addAudio(data).catch(err => toast.error(err.message));
const handleUpdateAudio = (data: any) => pageStore.updateAudio(data.id, data).catch(err => toast.error(err.message));
const handleDeleteAudio = (id: string) => { if (confirm('Excluir áudio?')) pageStore.deleteAudio(id).catch(err => toast.error(err.message)); };
const handleSetActiveAudio = (id: string) => pageStore.setActiveAudio(id).catch(err => toast.error(err.message));


async function saveChanges() {
  isSaving.value = true;
  try {
    const pagePayload: Partial<Page> = {};
    const originalPage = pageStore.currentPage;

    Object.keys(form).forEach(key => {
      const typedKey = key as keyof typeof form;

      if (typedKey === 'imageProvider') return;

      if (originalPage && typedKey in originalPage) {
        const formValue = form[typedKey];
        const originalValue = originalPage[typedKey as keyof Page];
        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          if (formValue !== null) (pagePayload as any)[typedKey] = formValue;
        }
      }
    });

    for (const key in pendingFiles) {
      const field = key as UploadableField;
      const file = pendingFiles[field];
      if (file) {
        const uploadType = field === 'backgroundVideoUrl' ? 'video' : field.replace('Url', '') as UploadType;
        const newUrl = await uploadFileWithSignedUrl(file, uploadType);
        (pagePayload as any)[field] = newUrl;
      }
    }

    if (Object.keys(pagePayload).length > 0) await pageStore.updateMyPage(pagePayload);
    Object.keys(pendingFiles).forEach(key => delete pendingFiles[key as UploadableField]);
    toast.success('Alterações salvas!');

  } catch (error) {
    console.error("Erro ao salvar:", error);
    toast.error('Erro ao salvar.');
  } finally {
    isSaving.value = false;
  }
}


function changeLayout(newLayout: string) {
  form.pageLayout = newLayout;

  if (newLayout !== 'standard') {
    if (form.backgroundType === 'solid' || form.backgroundType === 'gradient') {
      form.backgroundType = 'image';
    }
  }
}


const availableBackgroundTabs = computed(() => {
  if (form.pageLayout === 'standard') {
    return ['solid', 'gradient', 'image', 'video'];
  } else {

    return ['image', 'video'];
  }
});

</script>

<style scoped>
.group-section {
  @apply bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4;
}

.section-title {
  @apply text-sm font-bold text-slate-300 uppercase tracking-wider mb-2;
}

/* Inputs Modernos */
.input-label {
  @apply block text-xs font-semibold text-slate-400 mb-1.5 ml-1;
}

.input-modern {
  @apply w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all;
}

/* Scrollbar Clean */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

/* Animações Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
