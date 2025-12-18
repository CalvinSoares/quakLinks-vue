<template>
    <DashboardLayout>
        <div class="p-6 max-w-5xl mx-auto space-y-6">

            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-white">Minhas Páginas</h1>
                    <p class="text-slate-400 text-sm">Gerencie seus links biolink ({{ pageStore.userPages.length }}/5)
                    </p>
                </div>
                <button @click="openCreateModal" :disabled="pageStore.userPages.length >= 5"
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center gap-2">
                    <PlusIcon class="w-5 h-5" /> Nova Página
                </button>
            </div>

            <div class="relative">
                <input v-model="search" @input="handleSearch" type="text" placeholder="Buscar páginas..."
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                <MagnifyingGlassIcon class="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>

            <div v-if="pageStore.isLoading" class="text-center py-10 text-slate-500">Carregando...</div>

            <div v-else-if="pageStore.userPages.length === 0"
                class="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                <DocumentIcon class="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p class="text-slate-400">Nenhuma página encontrada.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="page in pageStore.userPages" :key="page.id"
                    class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-all group relative flex flex-col">

                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <span class="text-lg">{{ page.title?.charAt(0).toUpperCase() || '?' }}</span>
                            </div>
                            <div class="overflow-hidden">
                                <h3 class="font-bold text-white truncate w-32">{{ page.title || 'Sem Título' }}</h3>
                                <a :href="`/${page.slug}`" target="_blank"
                                    class="text-xs text-indigo-400 hover:underline truncate block">/{{ page.slug }}</a>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button @click="editPage(page)"
                                class="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors"
                                title="Editar">
                                <PencilIcon class="w-4 h-4" />
                            </button>
                            <button @click="confirmDelete(page)"
                                class="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-red-600 rounded-lg transition-colors"
                                title="Excluir">
                                <TrashIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div class="mt-auto pt-3 border-t border-slate-800/50 flex justify-between text-xs text-slate-500">
                        <span>{{ new Date(page.updatedAt).toLocaleDateString() }}</span>
                        <span class="flex items-center gap-1">
                            <EyeIcon class="w-3 h-3" /> {{ page.viewCount }} views
                        </span>
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
                    <h3 class="text-lg font-bold text-white">Criar Nova Página</h3>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Título da Página</label>
                            <input v-model="form.title"
                                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                placeholder="Ex: Meu Portfolio" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Link Personalizado (Slug)</label>
                            <div class="flex items-center">
                                <span
                                    class="bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg px-3 py-2 text-slate-400 text-sm">quack.com/</span>
                                <input v-model="form.slug"
                                    class="w-full bg-slate-950 border border-slate-700 rounded-r-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                                    placeholder="seunome" />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button @click="isCreateModalOpen = false"
                            class="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white">Cancelar</button>
                        <button @click="createPage" :disabled="isCreating"
                            class="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50">
                            {{ isCreating ? 'Criando...' : 'Criar' }}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </DashboardLayout>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { usePageStore } from '@/store/page';
import { useRouter } from 'vue-router';
import { PlusIcon, MagnifyingGlassIcon, DocumentIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';
import debounce from 'lodash/debounce';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

const pageStore = usePageStore();
const router = useRouter();

const search = ref('');
const currentPage = ref(1);
const isCreateModalOpen = ref(false);
const isCreating = ref(false);

const form = reactive({ title: '', slug: '' });

onMounted(() => {
    pageStore.fetchUserPages(1);
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
    isCreateModalOpen.value = true;
}

async function createPage() {
    if (!form.slug || !form.title) return toast.warning("Preencha todos os campos");

    isCreating.value = true;
    try {
        await pageStore.createNewPage(form);
        toast.success("Página criada!");
        isCreateModalOpen.value = false;
    } catch (e: any) {
        toast.error(e.response?.data?.message || "Erro ao criar");
    } finally {
        isCreating.value = false;
    }
}

async function editPage(page: any) {

    router.push({ name: 'DashboardAppearance', query: { slug: page.slug } });
}

async function confirmDelete(page: any) {
    if (confirm(`Tem certeza que deseja excluir "${page.title}"?`)) {
        try {
            await pageStore.deleteUserPage(page.id);
            toast.success("Página excluída.");
        } catch (e) {
            toast.error("Erro ao excluir.");
        }
    }
}
</script>