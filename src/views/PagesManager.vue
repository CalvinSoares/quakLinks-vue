<template>
    <DashboardLayout>
        <div class="p-6 max-w-5xl mx-auto space-y-6">

            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-white">{{ copy.title }}</h1>
                    <p class="text-slate-400 text-sm">{{ copy.subtitle(pageStore.userPages.length) }}
                    </p>
                </div>
                <button @click="openCreateModal" :disabled="pageStore.userPages.length >= 5"
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center gap-2">
                    <PlusIcon class="w-5 h-5" /> {{ copy.newPage }}
                </button>
            </div>

            <div class="relative">
                <input v-model="search" @input="handleSearch" type="text" :placeholder="copy.searchPlaceholder"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                <MagnifyingGlassIcon class="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>

            <div v-if="pageStore.isLoading" class="text-center py-10 text-slate-500">{{ copy.loading }}</div>

            <div v-else-if="pageStore.userPages.length === 0"
                class="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                <DocumentIcon class="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p class="text-slate-400">{{ copy.empty }}</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="page in pageStore.userPages" :key="page.id"
                    class="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-900">

                    <div class="flex items-start justify-between gap-3">
                        <div class="flex min-w-0 items-start gap-3">
                            <div
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-bold text-white">
                                {{ page.title?.charAt(0).toUpperCase() || '?' }}
                            </div>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2 min-w-0">
                                    <h3 class="truncate text-sm font-semibold text-white"
                                        :title="page.title || copy.untitled">
                                        {{ page.title || copy.untitled }}
                                    </h3>
                                    <span v-if="page.primaryPage"
                                        class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                                        <StarIcon class="h-3 w-3" />
                                        {{ copy.primaryBadge }}
                                    </span>
                                </div>
                                <a :href="`/${page.slug}`" target="_blank"
                                    class="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-indigo-300 hover:text-indigo-200"
                                    :title="`/${page.slug}`">
                                    <ArrowTopRightOnSquareIcon class="h-3.5 w-3.5 shrink-0" />
                                    <span class="truncate">/{{ page.slug }}</span>
                                </a>
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-2">
                            <button v-if="!page.primaryPage" @click="handleSetPrimary(page.id)"
                                :disabled="isSettingPrimaryPageId === page.id"
                                class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                                :title="copy.makePrimary">
                                <StarIcon class="h-4 w-4" />
                            </button>
                            <button @click="editPage(page)"
                                class="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-white"
                                :title="copy.edit">
                                <PencilIcon class="h-4 w-4" />
                            </button>
                            <button @click="confirmDelete(page)" :disabled="page.primaryPage"
                                class="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:text-slate-400"
                                :title="page.primaryPage ? copy.primaryDeleteBlocked : copy.delete">
                                <TrashIcon class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-2">
                        <span v-if="page.customDomain?.verified"
                            class="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                            <ShieldCheckIcon class="h-3.5 w-3.5" />
                            {{ copy.domainVerifiedBadge }}
                        </span>
                        <span v-else-if="page.customDomain"
                            class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                            <ExclamationTriangleIcon class="h-3.5 w-3.5" />
                            {{ copy.domainPendingBadge }}
                        </span>
                        <span v-else-if="authStore.isPremium"
                            class="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                            <GlobeAltIcon class="h-3.5 w-3.5" />
                            {{ copy.domainEmptyBadge }}
                        </span>
                        <span v-else
                            class="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-300">
                            <LockClosedIcon class="h-3.5 w-3.5" />
                            {{ copy.domainPremiumBadge }}
                        </span>

                        <span
                            class="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                            <EyeIcon class="h-3.5 w-3.5" />
                            {{ page.viewCount }}
                        </span>
                    </div>

                    <div
                        class="mt-4 flex items-center justify-between gap-3 border-t border-slate-800/70 pt-3 text-xs text-slate-500">
                        <span class="truncate">{{ formatDate(page.updatedAt) }}</span>
                        <button @click="openDomainSettings(page)"
                            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-sky-300"
                            :title="copy.manageDomain">
                            <GlobeAltIcon class="h-4 w-4" />
                            <span>{{ copy.domainAction }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="pageStore.totalPages > 1" class="flex justify-center gap-2 mt-6">
                <button v-for="p in pageStore.totalPages" :key="p" @click="changePage(p)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                    :class="currentPage === p ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'">
                    {{ p }}
                </button>
            </div>

            <div v-if="isCreateModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl">
                    <h3 class="text-lg font-bold text-white">{{ copy.createModalTitle }}</h3>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">{{ copy.pageTitleLabel }}</label>
                            <input v-model="form.title"
                                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                :placeholder="copy.pageTitlePlaceholder" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">{{ copy.slugLabel }}</label>
                            <div class="flex items-center">
                                <span
                                    class="bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg px-3 py-2 text-slate-400 text-sm">{{
                                        copy.slugPrefix }}</span>
                                <input v-model="form.slug"
                                    class="w-full bg-slate-950 border border-slate-700 rounded-r-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                    :placeholder="copy.slugPlaceholder" />
                            </div>
                            <div class="mt-2 flex items-center justify-between gap-3 text-xs">
                                <p class="text-slate-500 truncate">
                                    {{ copy.slugPreviewPrefix }} <span class="font-semibold text-slate-300">/{{
                                        form.slug || '...' }}</span>
                                </p>
                                <p v-if="slugStatus === 'checking'" class="text-slate-400">{{ copy.slugChecking }}</p>
                                <p v-else-if="slugStatus === 'available'" class="text-emerald-400">{{ copy.slugAvailable
                                    }}</p>
                                <p v-else-if="slugStatus === 'taken'" class="text-red-400">{{ copy.slugInUse }}</p>
                                <p v-else-if="slugStatus === 'invalid'" class="text-red-400">{{ slugValidationError }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button @click="isCreateModalOpen = false"
                            class="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white">{{
                                copy.cancel }}</button>
                        <button @click="createPage" :disabled="isCreating"
                            class="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50">
                            {{ isCreating ? copy.creating : copy.create }}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal :is-open="isDeleteModalOpen" :title="copy.deleteModalTitle"
                :description="pagePendingDeletion ? copy.deleteConfirm(pagePendingDeletion.title || copy.untitled) : ''"
                :cancel-label="copy.cancel" :confirm-label="copy.confirmDelete" :loading-label="copy.deleting"
                :is-loading="isDeleting" @close="closeDeleteModal" @confirm="handleDeleteConfirmed" />

        </div>
    </DashboardLayout>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore, type Page } from '@/store/page';
import { useRouter } from 'vue-router';
import { PlusIcon, MagnifyingGlassIcon, DocumentIcon, PencilIcon, TrashIcon, EyeIcon, StarIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon, ExclamationTriangleIcon, LockClosedIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';
import debounce from 'lodash/debounce';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useAppLanguage } from '@/composables/useAppLanguage';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';
import {
    isPublicHandleAvailable,
    normalizePublicHandle,
    validatePublicHandle,
} from '@/utils/publicHandle';

const authStore = useAuthStore();
const pageStore = usePageStore();
const router = useRouter();
const { locale } = useAppLanguage();

const search = ref('');
const currentPage = ref(1);
const isCreateModalOpen = ref(false);
const isCreating = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const isSettingPrimaryPageId = ref<string | null>(null);
const pagePendingDeletion = ref<Page | null>(null);
const slugStatus = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
const slugValidationError = ref<string | null>(null);
let slugCheckTimer: ReturnType<typeof setTimeout> | null = null;
let lastCheckedSlug = '';

const form = reactive({ title: '', slug: '' });

const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                title: 'My Pages',
                subtitle: (count: number) => `Manage your biolink pages (${count}/5)`,
                newPage: 'New Page',
                searchPlaceholder: 'Search pages...',
                loading: 'Loading...',
                empty: 'No pages found.',
                untitled: 'Untitled',
                edit: 'Edit',
                delete: 'Delete',
                makePrimary: 'Set as primary',
                settingPrimary: 'Saving...',
                primaryBadge: 'Primary',
                primaryDeleteBlocked: 'Set another page as primary before deleting this one.',
                views: (count: number) => `${count} views`,
                domainVerifiedBadge: 'Domain ok',
                domainPendingBadge: 'DNS pending',
                domainEmptyBadge: 'No domain',
                domainPremiumBadge: 'Premium',
                manageDomain: 'Open domain settings',
                domainAction: 'Domain',
                createModalTitle: 'Create New Page',
                pageTitleLabel: 'Page Title',
                pageTitlePlaceholder: 'Ex: My Portfolio',
                slugLabel: 'Custom Link (Slug)',
                slugPrefix: 'quack.com/',
                slugPlaceholder: 'yourname',
                slugPreviewPrefix: 'Public link:',
                slugChecking: 'Checking...',
                slugAvailable: 'Available',
                slugInUse: 'This link is already in use.',
                slugInvalid: 'Choose a valid link.',
                slugRequired: 'Enter a link.',
                slugTooShort: 'Use at least 3 characters.',
                slugReserved: 'This link is not available.',
                cancel: 'Cancel',
                creating: 'Creating...',
                create: 'Create',
                fillAll: 'Fill in all fields',
                pageCreated: 'Page created!',
                createError: 'Error creating page',
                deleteConfirm: (title: string) => `Are you sure you want to delete "${title}"?`,
                deleteModalTitle: 'Delete page',
                deleted: 'Page deleted.',
                deleting: 'Deleting...',
                confirmDelete: 'Delete page',
                deleteError: 'Error deleting.',
                primarySaved: 'Primary page updated.',
                primarySaveError: 'Could not update the primary page.',
                domainOpenError: 'Could not open domain settings.',
            };
        case 'es':
            return {
                title: 'Mis Páginas',
                subtitle: (count: number) => `Administra tus páginas biolink (${count}/5)`,
                newPage: 'Nueva Página',
                searchPlaceholder: 'Buscar páginas...',
                loading: 'Cargando...',
                empty: 'No se encontraron páginas.',
                untitled: 'Sin Título',
                edit: 'Editar',
                delete: 'Eliminar',
                makePrimary: 'Definir como principal',
                settingPrimary: 'Guardando...',
                primaryBadge: 'Principal',
                primaryDeleteBlocked: 'Define otra página como principal antes de eliminar esta.',
                views: (count: number) => `${count} vistas`,
                domainVerifiedBadge: 'Dominio ok',
                domainPendingBadge: 'DNS pendiente',
                domainEmptyBadge: 'Sin dominio',
                domainPremiumBadge: 'Premium',
                manageDomain: 'Abrir ajustes de dominio',
                domainAction: 'Dominio',
                createModalTitle: 'Crear Nueva Página',
                pageTitleLabel: 'Título de la Página',
                pageTitlePlaceholder: 'Ej: Mi Portfolio',
                slugLabel: 'Link Personalizado (Slug)',
                slugPrefix: 'quack.com/',
                slugPlaceholder: 'tunombre',
                slugPreviewPrefix: 'Link público:',
                slugChecking: 'Verificando...',
                slugAvailable: 'Disponible',
                slugInUse: 'Este link ya está en uso.',
                slugInvalid: 'Elige un link válido.',
                slugRequired: 'Ingresa un link.',
                slugTooShort: 'Usa al menos 3 caracteres.',
                slugReserved: 'Este link no está disponible.',
                cancel: 'Cancelar',
                creating: 'Creando...',
                create: 'Crear',
                fillAll: 'Completa todos los campos',
                pageCreated: '¡Página creada!',
                createError: 'Error al crear',
                deleteConfirm: (title: string) => `¿Seguro que deseas eliminar "${title}"?`,
                deleteModalTitle: 'Eliminar página',
                deleted: 'Página eliminada.',
                deleting: 'Eliminando...',
                confirmDelete: 'Eliminar página',
                deleteError: 'Error al eliminar.',
                primarySaved: 'Página principal actualizada.',
                primarySaveError: 'No se pudo actualizar la página principal.',
                domainOpenError: 'No se pudieron abrir los ajustes de dominio.',
            };
        default:
            return {
                title: 'Minhas Páginas',
                subtitle: (count: number) => `Gerencie seus links biolink (${count}/5)`,
                newPage: 'Nova Página',
                searchPlaceholder: 'Buscar páginas...',
                loading: 'Carregando...',
                empty: 'Nenhuma página encontrada.',
                untitled: 'Sem Título',
                edit: 'Editar',
                delete: 'Excluir',
                makePrimary: 'Tornar principal',
                settingPrimary: 'Salvando...',
                primaryBadge: 'Principal',
                primaryDeleteBlocked: 'Defina outra página como principal antes de excluir esta.',
                views: (count: number) => `${count} views`,
                domainVerifiedBadge: 'Domínio ok',
                domainPendingBadge: 'DNS pendente',
                domainEmptyBadge: 'Sem domínio',
                domainPremiumBadge: 'Premium',
                manageDomain: 'Abrir configurações de domínio',
                domainAction: 'Domínio',
                createModalTitle: 'Criar Nova Página',
                pageTitleLabel: 'Título da Página',
                pageTitlePlaceholder: 'Ex: Meu Portfolio',
                slugLabel: 'Link Personalizado (Slug)',
                slugPrefix: 'quack.com/',
                slugPlaceholder: 'seunome',
                slugPreviewPrefix: 'Link público:',
                slugChecking: 'Verificando...',
                slugAvailable: 'Disponível',
                slugInUse: 'Este link já está em uso.',
                slugInvalid: 'Escolha um link válido.',
                slugRequired: 'Informe um link.',
                slugTooShort: 'Use pelo menos 3 caracteres.',
                slugReserved: 'Este link não está disponível.',
                cancel: 'Cancelar',
                creating: 'Criando...',
                create: 'Criar',
                fillAll: 'Preencha todos os campos',
                pageCreated: 'Página criada!',
                createError: 'Erro ao criar',
                deleteConfirm: (title: string) => `Tem certeza que deseja excluir "${title}"?`,
                deleteModalTitle: 'Excluir página',
                deleted: 'Página excluída.',
                deleting: 'Excluindo...',
                confirmDelete: 'Excluir página',
                deleteError: 'Erro ao excluir.',
                primarySaved: 'Página principal atualizada.',
                primarySaveError: 'Não foi possível atualizar a página principal.',
                domainOpenError: 'Não foi possível abrir as configurações de domínio.',
            };
    }
});

const validatePageSlug = (value: string) => validatePublicHandle(value, {
    required: copy.value.slugRequired,
    tooShort: copy.value.slugTooShort,
    reserved: copy.value.slugReserved,
});

const resetSlugFeedback = () => {
    slugStatus.value = 'idle';
    slugValidationError.value = null;
    lastCheckedSlug = '';
    if (slugCheckTimer) clearTimeout(slugCheckTimer);
    slugCheckTimer = null;
};

const checkSlugAvailability = async (value: string) => {
    const normalized = normalizePublicHandle(value);
    const validationError = validatePageSlug(normalized);

    if (normalized !== value) {
        form.slug = normalized;
    }

    if (validationError) {
        slugStatus.value = normalized ? 'invalid' : 'idle';
        slugValidationError.value = validationError;
        return false;
    }

    if (lastCheckedSlug === normalized && slugStatus.value !== 'checking') {
        return slugStatus.value === 'available';
    }

    slugStatus.value = 'checking';
    slugValidationError.value = null;
    lastCheckedSlug = normalized;

    try {
        const isAvailable = await isPublicHandleAvailable(normalized);
        slugStatus.value = isAvailable ? 'available' : 'taken';
        return isAvailable;
    } catch {
        slugStatus.value = 'idle';
        return false;
    }
};

watch(() => form.slug, (value) => {
    const normalized = normalizePublicHandle(value);

    if (normalized !== value) {
        form.slug = normalized;
        return;
    }

    if (!normalized) {
        resetSlugFeedback();
        return;
    }

    const validationError = validatePageSlug(normalized);
    if (validationError) {
        slugStatus.value = 'invalid';
        slugValidationError.value = validationError;
        lastCheckedSlug = '';
        if (slugCheckTimer) clearTimeout(slugCheckTimer);
        slugCheckTimer = null;
        return;
    }

    if (slugCheckTimer) clearTimeout(slugCheckTimer);
    slugCheckTimer = setTimeout(() => {
        checkSlugAvailability(normalized);
    }, 350);
});

onMounted(() => {
    pageStore.fetchUserPages(1);
});

onUnmounted(() => {
    resetSlugFeedback();
});

const handleSearch = debounce(() => {
    currentPage.value = 1;
    pageStore.fetchUserPages(1, search.value);
}, 500);

function changePage(p: number) {
    currentPage.value = p;
    pageStore.fetchUserPages(p, search.value);
}

function openCreateModal() {
    form.title = '';
    form.slug = '';
    resetSlugFeedback();
    isCreateModalOpen.value = true;
}

async function createPage() {
    if (!form.slug || !form.title) return toast.warning(copy.value.fillAll);

    isCreating.value = true;
    try {
        const isAvailable = await checkSlugAvailability(form.slug);
        if (!isAvailable) {
            toast.error(
                slugStatus.value === 'taken'
                    ? copy.value.slugInUse
                    : slugValidationError.value || copy.value.slugInvalid,
            );
            return;
        }
        await pageStore.createNewPage(form);
        toast.success(copy.value.pageCreated);
        isCreateModalOpen.value = false;
    } catch (e: any) {
        const message = e.response?.data?.message || copy.value.createError;
        toast.error(/user(name)?|slug/i.test(message) ? copy.value.slugInUse : message);
    } finally {
        isCreating.value = false;
    }
}

async function editPage(page: any) {
    router.push({ name: 'appearance', query: { slug: page.slug } });
}

async function openDomainSettings(page: Page) {
    try {
        await pageStore.selectPageToEdit(page.slug);
        await router.push({ name: 'dashboard-settings' });
    } catch (e: any) {
        toast.error(e.message || copy.value.domainOpenError);
    }
}

async function handleSetPrimary(pageId: string) {
    isSettingPrimaryPageId.value = pageId;
    try {
        await pageStore.setPrimaryPage(pageId);
        toast.success(copy.value.primarySaved);
    } catch (e: any) {
        toast.error(e.message || copy.value.primarySaveError);
    } finally {
        isSettingPrimaryPageId.value = null;
    }
}

function confirmDelete(page: Page) {
    pagePendingDeletion.value = page;
    isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
    if (isDeleting.value) {
        return;
    }

    isDeleteModalOpen.value = false;
    pagePendingDeletion.value = null;
}

async function handleDeleteConfirmed() {
    if (!pagePendingDeletion.value) {
        return;
    }

    isDeleting.value = true;
    try {
        await pageStore.deleteUserPage(pagePendingDeletion.value.id);
        toast.success(copy.value.deleted);
        isDeleteModalOpen.value = false;
        pagePendingDeletion.value = null;
    } catch (e: any) {
        toast.error(e.message || copy.value.deleteError);
    } finally {
        isDeleting.value = false;
    }
}

function formatDate(value: string) {
    const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const;
    return new Date(value).toLocaleDateString(localeMap[locale.value]);
}
</script>
