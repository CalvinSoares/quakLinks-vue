<template>
    <div class="bg-slate-900/50 border border-slate-700/50 rounded-2xl">
        <div class="p-6 border-b border-slate-700/50">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <GlobeAltIcon class="w-6 h-6 text-sky-400" />
                Domínio Personalizado
                <span class="px-2 py-0.5 text-xs font-bold text-sky-900 bg-sky-400 rounded-full">PREMIUM</span>
            </h3>
            <p class="text-sm text-slate-400 mt-1">
                Use seu próprio domínio para a sua página (ex: links.meusite.com).
            </p>
        </div>

        <div class="p-6">
            <div v-if="!auth.isPremium" class="text-center">
                <p class="text-slate-400">Esta funcionalidade está disponível no plano Premium.</p>
                <UpgradeToPremium class="max-w-xs mx-auto mt-4" />
            </div>

            <div v-else-if="!currentPage" class="text-center text-slate-400">
                Selecione uma página para configurar um domínio customizado.
            </div>

            <div v-else class="space-y-4">
                <form @submit.prevent="handleAddDomain" v-if="!customDomain" class="flex items-start gap-3">
                    <div class="flex-grow">
                        <input v-model="domainInput" type="text" placeholder="links.meusite.com"
                            class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            :disabled="isLoading" />
                    </div>
                    <button type="submit" :disabled="isLoading"
                        class="px-5 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg disabled:bg-slate-600 shrink-0">
                        <span v-if="isLoading">Adicionando...</span>
                        <span v-else>Adicionar</span>
                    </button>
                </form>

                <div v-else class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg gap-4">
                        <span class="font-mono text-lg text-white truncate">{{ customDomain.domain }}</span>
                        <div class="flex items-center gap-3 shrink-0">
                            <span
                                :class="customDomain.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
                                class="px-3 py-1 text-xs font-bold rounded-full">
                                {{ customDomain.verified ? 'Verificado' : 'Pendente' }}
                            </span>
                            <button @click="handleRemoveDomain" :disabled="isLoading" title="Remover Domínio"
                                class="p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                                <TrashIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div v-if="!customDomain.verified"
                        class="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg space-y-3 text-sm">
                        <p class="font-semibold text-amber-300">Ação necessária:</p>
                        <p class="text-slate-300">
                            Para verificar seu domínio, acesse as configurações de DNS do seu provedor e adicione o
                            seguinte registro:
                        </p>
                        <div class="p-3 bg-slate-900 rounded-md font-mono text-slate-400 space-y-1">
                            <p><strong>Tipo:</strong> CNAME</p>
                            <p><strong>Host/Nome:</strong> @ (ou o subdomínio que você inseriu, ex: 'links')</p>
                            <p><strong>Valor/Aponta para:</strong> {{ appDomain }}</p>
                        </div>
                        <p class="text-xs text-slate-500">Pode levar algumas horas para as alterações de DNS se
                            propagarem.</p>
                        <button @click="handleVerifyDomain" :disabled="isLoading"
                            class="mt-2 px-5 py-2 font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg disabled:bg-slate-600">
                            Verificar Agora
                        </button>
                    </div>
                </div>
                <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';
import UpgradeToPremium from '../dashboard/UpgradeToPremium.vue';
import { TrashIcon } from 'vue-tabler-icons';
import { toast } from 'vue-sonner';

const auth = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();

const domainInput = ref('');
const isLoading = ref(false);
const isVerifying = ref(false);
const error = ref<string | null>(null);
const customDomain = ref<{
    id: string;
    pageId: string;
    domain: string;
    verified: boolean;
} | null>(null);

const currentPage = computed(() => pageStore.currentPage);
const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.host;

async function loadDomain() {
    if (!auth.isPremium || !currentPage.value?.id) {
        customDomain.value = null;
        return;
    }

    try {
        customDomain.value = await userStore.fetchCustomDomain(currentPage.value.id);
    } catch (e: any) {
        error.value = e.message;
    }
}

onMounted(loadDomain);
watch(() => currentPage.value?.id, () => {
    error.value = null;
    void loadDomain();
});

async function handleAddDomain() {
    if (!domainInput.value || !currentPage.value?.id) return;
    isLoading.value = true;
    error.value = null;
    try {
        customDomain.value = await userStore.addCustomDomain(currentPage.value.id, domainInput.value);
        domainInput.value = '';
    } catch (e: any) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
}

async function handleRemoveDomain() {
    if (!currentPage.value?.id) {
        return;
    }
    if (!window.confirm(`Tem certeza que deseja remover o domínio "${customDomain.value?.domain}"?`)) {
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
        await userStore.removeCustomDomain(currentPage.value.id);
        customDomain.value = null;
    } catch (e: any) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
}


async function handleVerifyDomain() {
    if (!currentPage.value?.id) {
        return;
    }
    isVerifying.value = true;
    error.value = null;
    try {
        const result = await userStore.verifyCustomDomain(currentPage.value.id);

        toast.success(result.message);
        customDomain.value = result.domain;

    } catch (e: any) {
        error.value = e.message;
    } finally {
        isVerifying.value = false;
    }
}
</script>
