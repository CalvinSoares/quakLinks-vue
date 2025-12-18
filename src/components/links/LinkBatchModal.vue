<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">

                <div :class="isEditing ? 'max-w-md' : 'max-w-2xl'"
                    class="w-full bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300">

                    <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <h2 class="text-lg font-bold text-white flex items-center gap-2">
                            <span class="p-1.5 bg-yellow-500/20 rounded-lg text-yellow-400">
                                <LinkIcon class="w-5 h-5" />
                            </span>
                            {{ isEditing ? 'Editar Link' : 'Adicionar Links' }}
                        </h2>
                        <button @click="close" class="text-slate-400 hover:text-white transition">
                            <XIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="flex-1 overflow-hidden flex flex-col md:flex-row">

                        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0F172A]">

                            <div v-if="!currentSelection" class="space-y-4">
                                <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Escolha o tipo
                                </h3>
                                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    <button @click="selectType(customLinkSocial)" class="icon-grid-btn group">
                                        <div class="icon-wrapper group-hover:scale-110">
                                            <component :is="customLinkSocial.icon" class="w-5 h-5 text-white" />
                                        </div>
                                        <span class="text-xs text-slate-300 font-medium">Custom</span>
                                    </button>
                                    <button v-for="social in socialProfiles" :key="social.name"
                                        @click="selectType(social)" class="icon-grid-btn group">
                                        <div class="icon-wrapper group-hover:scale-110">
                                            <component :is="social.icon" class="w-5 h-5 text-white" />
                                        </div>
                                        <span class="text-xs text-slate-300 font-medium truncate w-full text-center">{{
                                            social.name }}</span>
                                    </button>
                                </div>
                            </div>

                            <div v-else class="space-y-5 animate-fade-in">
                                <div class="flex items-center gap-3 mb-4">
                                    <button @click="currentSelection = null"
                                        class="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                                        <ArrowLeftIcon class="w-3 h-3" /> {{ isEditing ? 'Trocar Ícone' : 'Voltar' }}
                                    </button>
                                    <div class="h-4 w-px bg-slate-700"></div>
                                    <div class="flex items-center gap-2">
                                        <component :is="currentSelection.icon" class="w-5 h-5 text-yellow-400" />
                                        <span class="font-bold text-white">{{ currentSelection.name }}</span>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-slate-400 mb-1.5">Título do
                                        Botão</label>
                                    <input v-model="form.title" type="text" class="input-modern"
                                        placeholder="Ex: Meu Instagram" />
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-slate-400 mb-1.5">URL de
                                        Destino</label>
                                    <div class="relative">
                                        <input v-model="form.url" type="text" class="input-modern pr-10"
                                            :placeholder="currentSelection.placeholder" />
                                        <div class="absolute right-3 top-2.5 text-slate-500">
                                            <LinkIcon class="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="authStore.isPremium"
                                    class="pt-4 mt-2 border-t border-slate-800/60 space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <ClockIcon class="w-4 h-4 text-sky-400" />
                                            <h3 class="text-sm font-semibold text-white">Agendamento</h3>
                                            <span
                                                class="px-1.5 py-0.5 text-[10px] font-bold text-sky-950 bg-sky-400 rounded">PRO</span>
                                        </div>
                                        <button v-if="form.scheduledAt || form.expiresAt" @click="clearSchedule"
                                            type="button" class="text-xs text-slate-400 hover:text-red-400 transition">
                                            Limpar Datas
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-[10px] font-medium text-slate-400 mb-1">Início
                                                (Aparecer)</label>
                                            <input v-model="form.scheduledAt" type="datetime-local"
                                                class="input-modern text-xs" />
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-medium text-slate-400 mb-1">Fim
                                                (Sumir)</label>
                                            <input v-model="form.expiresAt" type="datetime-local"
                                                class="input-modern text-xs" />
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-4 border-t border-slate-800/50 mt-4 flex justify-end gap-2">
                                    <button @click="close"
                                        class="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>

                                    <button v-if="!isEditing" @click="addToQueue" :disabled="!form.url"
                                        class="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50">
                                        Adicionar à Lista +
                                    </button>

                                    <button v-else @click="saveEdit" :disabled="!form.url"
                                        class="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold text-sm transition shadow-lg shadow-yellow-500/20">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="!isEditing"
                            class="w-full md:w-[280px] bg-slate-900/50 flex flex-col border-t md:border-t-0 md:border-l border-slate-800">
                            <div class="p-4 border-b border-slate-800/50 bg-slate-900">
                                <h3
                                    class="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                                    Fila de Criação
                                    <span class="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{
                                        pendingLinks.length }}</span>
                                </h3>
                            </div>

                            <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 min-h-[150px] md:min-h-0">
                                <div v-if="pendingLinks.length === 0"
                                    class="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                                    <PlaylistAddIcon class="w-8 h-8 opacity-50" />
                                    <span class="text-xs text-center px-4">Adicione links para salvar em lote.</span>
                                </div>

                                <transition-group name="list">
                                    <div v-for="(link, index) in pendingLinks" :key="index"
                                        class="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-3 group relative">
                                        <div class="p-1.5 bg-slate-700 rounded-md text-slate-300">
                                            <component :is="link.iconComponent" class="w-4 h-4" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-white truncate">{{ link.title }}</p>
                                            <div v-if="link.scheduledAt || link.expiresAt"
                                                class="flex items-center gap-1 mt-0.5">
                                                <ClockIcon class="w-3 h-3 text-sky-500" />
                                                <span class="text-[10px] text-sky-500">Agendado</span>
                                            </div>
                                        </div>
                                        <button @click="removeFromQueue(index)"
                                            class="text-slate-500 hover:text-red-400 transition p-1">
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                </transition-group>
                            </div>

                            <div class="p-4 border-t border-slate-800 bg-slate-900">
                                <button @click="saveAllBatch" :disabled="pendingLinks.length === 0"
                                    class="w-full py-3 bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-500 hover:to-yellow-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                    Criar Blocos ({{ pendingLinks.length }})
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { socialProfiles, customLinkSocial, type Social } from './social';
import { useAuthStore } from '@/store/auth';
import { XIcon, LinkIcon, ArrowLeftIcon, TrashIcon, PlaylistAddIcon, ClockIcon } from 'vue-tabler-icons';

const props = defineProps<{
    isOpen: boolean;
    initialData?: any | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save-batch', links: Array<any>): void;
    (e: 'update-single', data: any): void;
}>();

const authStore = useAuthStore();
const currentSelection = ref<Social | null>(null);
const pendingLinks = ref<Array<any>>([]);
const isEditing = computed(() => !!props.initialData);

const form = reactive({
    title: '',
    url: '',
    scheduledAt: null as string | null,
    expiresAt: null as string | null
});

const formatToLocalInput = (isoString: string | null | undefined) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
};

const clearSchedule = () => {
    form.scheduledAt = null;
    form.expiresAt = null;
};

watch(() => props.isOpen, (val) => {
    if (val) {
        if (props.initialData) {
            form.title = props.initialData.content.title;
            form.url = props.initialData.content.url;
            form.scheduledAt = formatToLocalInput(props.initialData.content.scheduledAt);
            form.expiresAt = formatToLocalInput(props.initialData.content.expiresAt);

            currentSelection.value = customLinkSocial;
            const foundSocial = socialProfiles.find(s => s.name === props.initialData.content.title);
            if (foundSocial) currentSelection.value = foundSocial;

        } else {
            currentSelection.value = null;
            pendingLinks.value = [];
            resetForm();
        }
    }
});

function resetForm() {
    form.title = '';
    form.url = '';
    form.scheduledAt = null;
    form.expiresAt = null;
}

function selectType(social: Social) {
    currentSelection.value = social;
    form.title = social.name === 'URL Customizada' ? (isEditing.value ? form.title : '') : social.name;
    if (!isEditing.value) form.url = '';
}

const processUrl = (url: string) => {
    if (!url) return '';
    return !/^https?:\/\//i.test(url) ? 'https://' + url : url;
};

function addToQueue() {
    if (!form.url || !currentSelection.value) return;

    const scheduleData = {};
    if (form.scheduledAt) Object.assign(scheduleData, { scheduledAt: new Date(form.scheduledAt).toISOString() });
    if (form.expiresAt) Object.assign(scheduleData, { expiresAt: new Date(form.expiresAt).toISOString() });

    pendingLinks.value.push({
        title: form.title || currentSelection.value.name,
        url: processUrl(form.url),
        iconComponent: currentSelection.value.icon,
        type: 'LINK',
        ...scheduleData
    });

    currentSelection.value = null;
    resetForm();
}

function saveAllBatch() {
    emit('save-batch', pendingLinks.value.map(({ iconComponent, ...rest }) => rest));
    close();
}

function saveEdit() {
    const scheduleData = { scheduledAt: null as string | null, expiresAt: null as string | null };
    if (form.scheduledAt) scheduleData.scheduledAt = new Date(form.scheduledAt).toISOString();
    if (form.expiresAt) scheduleData.expiresAt = new Date(form.expiresAt).toISOString();

    emit('update-single', {
        title: form.title,
        url: processUrl(form.url),
        ...scheduleData
    });
    close();
}

function removeFromQueue(index: number) {
    pendingLinks.value.splice(index, 1);
}

function close() {
    emit('close');
}
</script>

<style scoped>
.input-modern {
    @apply w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all;
    color-scheme: dark;
}

.icon-grid-btn {
    @apply flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-yellow-500 hover:bg-slate-800 transition;
}

.icon-wrapper {
    @apply w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center transition-transform;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #334155;
    border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>