<template>
    <div class="space-y-6">
        <div class="flex p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto custom-scrollbar">
            <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
                class="flex-1 min-w-[80px] py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap px-2"
                :class="activeCategory === cat.id ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'">
                {{ cat.label }}
            </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <button v-for="item in filteredBlockTypes" :key="item.type" @click="initiateAddBlock(item.type)"
                class="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-yellow-500 hover:bg-slate-800 transition-all group">
                <component :is="item.icon"
                    class="w-6 h-6 text-slate-400 group-hover:text-yellow-500 transition-colors" />
                <span class="text-xs font-medium text-slate-300 group-hover:text-white">{{ item.label }}</span>
            </button>
        </div>

        <div class="border-t border-slate-800 my-4"></div>

        <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Seus Blocos</h3>
            <p class="text-[11px] text-slate-500 mb-3">Segure o ícone ⠿ e arraste para reordenar.</p>

            <div v-if="!localBlocks || localBlocks.length === 0" class="text-center py-8 text-slate-500 text-sm">
                Nenhum bloco adicionado ainda.
            </div>

            <draggable v-else v-model="localBlocks" item-key="id" v-bind="dragOptions" class="block-list"
                @start="onDragStart" @end="onDragEnd">
                <template #item="{ element: block }">
                    <div
                        class="block-row flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg group hover:border-slate-600 transition-colors select-none">

                        <div
                            class="drag-handle shrink-0 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/80"
                            title="Arrastar para reordenar">
                            <GripVerticalIcon class="w-4 h-4" />
                        </div>

                        <div class="p-2 bg-slate-800 rounded text-slate-400 shrink-0">
                            <component :is="getIconForType(block.type)" class="w-4 h-4" />
                        </div>

                        <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('edit', block)">
                            <p class="text-xs font-bold text-white truncate hover:text-yellow-500">
                                {{ getBlockLabel(block) }}
                            </p>
                            <p class="text-[10px] text-slate-500 truncate">{{ getBlockSubtitle(block) }}</p>
                        </div>

                        <div class="flex items-center gap-1 shrink-0 no-drag">
                            <button type="button" @click="$emit('edit', block)"
                                class="no-drag p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800" title="Editar">
                                <PencilIcon class="w-4 h-4" />
                            </button>
                            <button type="button" @click="deleteBlock(block.id)"
                                class="no-drag p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-800"
                                title="Excluir">
                                <TrashIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl animate-fade-in-up">

                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-white">Novo Bloco: {{ getLabelForType(selectedType) }}</h3>
                    <button @click="closeModal" class="text-slate-400 hover:text-white">✕</button>
                </div>

                <div class="space-y-4">

                    <div v-if="selectedType === 'LINK'" class="space-y-3">
                        <div>
                            <label class="input-label">Título do Botão</label>
                            <input v-model="tempContent.title" class="input-modern" placeholder="Ex: Meu Portfolio"
                                autofocus />
                        </div>
                        <div>
                            <label class="input-label">URL</label>
                            <input v-model="tempContent.url" class="input-modern" placeholder="https://" />
                        </div>
                    </div>

                    <div v-else-if="selectedType === 'HEADER' || selectedType === 'TEXT'" class="space-y-3">
                        <label class="input-label">Conteúdo</label>
                        <textarea v-model="headerOrTextContent" class="input-modern resize-none" rows="3"
                            placeholder="Digite aqui..."></textarea>
                    </div>

                    <div v-else-if="selectedType === 'YOUTUBE_SUBSCRIBE'" class="space-y-3">
                        <label class="input-label">ID do Canal (Channel ID)</label>
                        <input v-model="tempContent.channelId" class="input-modern"
                            placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw" />
                        <p class="text-[10px] text-slate-500 bg-slate-800 p-2 rounded">
                            Acesse seu canal no YouTube > Sobre > Compartilhar > Copiar ID do Canal.
                        </p>
                    </div>

                    <div v-else-if="selectedType === 'PINTEREST'" class="space-y-3">
                        <label class="input-label">Link do Pin</label>
                        <input v-model="tempContent.url" class="input-modern"
                            placeholder="Ex: https://br.pinterest.com/pin/..." />
                    </div>

                    <div v-else-if="selectedType === 'VIDEO'" class="space-y-3">
                        <label class="input-label">Link do Vídeo</label>
                        <input v-model="tempContent.url" class="input-modern" placeholder="YouTube URL ou MP4 Direto" />
                    </div>

                    <div v-if="selectedType === 'COUNTDOWN'" class="space-y-4">

                        <div>
                            <label class="input-label flex justify-between">
                                Título
                                <span class="text-[10px] text-slate-500">{{ tempContent.title?.length || 0 }}/25</span>
                            </label>
                            <input v-model="tempContent.title" class="input-modern" maxlength="25"
                                placeholder="Ex: Meu Próximo Evento" />
                        </div>

                        <div>
                            <label class="input-label">Data e Hora</label>
                            <input type="datetime-local" v-model="tempContent.date" class="input-modern"
                                style="color-scheme: dark;" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="input-label">Texto do Botão <span class="text-[10px] text-slate-500">{{
                                    tempContent.buttonText?.length || 0 }}/15</span>
                                </label>
                                <input v-model="tempContent.buttonText" class="input-modern"
                                    placeholder="Ex: Comprar Ingresso" maxlength="15" />
                            </div>
                            <div>
                                <label class="input-label">URL do Link</label>
                                <input v-model="tempContent.url" class="input-modern" placeholder="https://" />
                            </div>
                        </div>

                        <div>
                            <label class="input-label flex justify-between">
                                Descrição
                                <span class="text-[10px] text-slate-500">{{ tempContent.description?.length || 0
                                }}/110</span>
                            </label>
                            <textarea v-model="tempContent.description" class="input-modern resize-none" rows="2"
                                maxlength="110" placeholder="Detalhes do evento..."></textarea>
                        </div>

                        <div class="space-y-2 pt-2 border-t border-slate-800">
                            <label class="input-label">Quando o contador terminar:</label>
                            <div class="flex gap-4">
                                <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="radio" value="none" v-model="tempContent.endBehavior"
                                        class="accent-indigo-500">
                                    Não fazer nada
                                </label>
                                <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="radio" value="message" v-model="tempContent.endBehavior"
                                        class="accent-indigo-500">
                                    Mostrar mensagem
                                </label>
                            </div>
                        </div>

                        <transition name="fade">
                            <div v-if="tempContent.endBehavior === 'message'">
                                <label class="input-label">Mensagem Final</label>
                                <input v-model="tempContent.endMessage" class="input-modern"
                                    placeholder="Ex: Inscrições Encerradas!" />
                            </div>
                        </transition>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
                            <div>
                                <span class="text-sm font-medium text-white block">Ativar Lembretes</span>
                                <span class="text-[10px] text-slate-500">Permite adicionar ao Google Calendar</span>
                            </div>
                            <SwitchToggle v-model="tempContent.reminders" />
                        </div>

                    </div>

                </div>

                <div class="flex gap-3 pt-2">
                    <button @click="closeModal"
                        class="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-all">
                        Cancelar
                    </button>
                    <button @click="confirmCreateBlock"
                        class="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
                        Adicionar
                    </button>
                </div>

            </div>
        </div>

        <ConfirmationModal :is-open="isDeleteModalOpen" title="Excluir bloco"
            description="Tem certeza que deseja excluir este bloco?" cancel-label="Cancelar"
            confirm-label="Excluir bloco" loading-label="Excluindo..." :is-loading="isDeletingBlock"
            @close="closeDeleteModal" @confirm="confirmDeleteBlock" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { usePageStore, type Block } from '@/store/page';
import {
    LinkIcon, H1Icon, FileTextIcon, MinusIcon,
    VideoIcon, BrandYoutubeIcon, BrandPinterestIcon,
    TrashIcon, PencilIcon, ShareIcon,
    ClockIcon, GripVerticalIcon
} from 'vue-tabler-icons';
import { toast } from 'vue-sonner';
import SwitchToggle from './SwitchToggle.vue';
import draggable from 'vuedraggable';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';

const emit = defineEmits(['edit', 'order-change']);

const props = defineProps<{
    orderedBlocks?: Block[];
}>();

const pageStore = usePageStore();
const activeCategory = ref('basic');

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDeletingBlock = ref(false);
const selectedType = ref<string>('');
const blockIdPendingDeletion = ref<string | null>(null);
const tempContent = reactive<any>({});

const localBlocks = ref<Block[]>([]);
const isDragging = ref(false);

const dragOptions = {
    animation: 200,
    handle: '.drag-handle',
    ghostClass: 'ghost-card',
    chosenClass: 'chosen-card',
    dragClass: 'drag-card',
    forceFallback: true,
    fallbackOnBody: true,
    scroll: true,
    bubbleScroll: true,
    scrollSensitivity: 80,
};

function syncLocalBlocks(blocks: Block[]) {
    localBlocks.value = [...blocks].sort((a, b) => a.order - b.order);
}

watch(
    () => props.orderedBlocks,
    (blocks) => {
        if (isDragging.value || !blocks) {
            return;
        }

        syncLocalBlocks(blocks);
    },
    { immediate: true, deep: true },
);

function onDragStart() {
    isDragging.value = true;
}

function onDragEnd(event: { oldIndex?: number; newIndex?: number }) {
    isDragging.value = false;

    if (
        event.oldIndex === undefined
        || event.newIndex === undefined
        || event.oldIndex === event.newIndex
        || localBlocks.value.length === 0
    ) {
        return;
    }

    const updatedBlocks = localBlocks.value.map((block, index) => ({
        ...block,
        order: index,
    }));

    localBlocks.value = updatedBlocks;
    emit('order-change', updatedBlocks);
}

const categories = [
    { id: 'basic', label: 'Básico' },
    { id: 'media', label: 'Mídia' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'events', label: 'Eventos' }
];

const blockTypes = [
    { type: 'LINK', label: 'Link', icon: LinkIcon, category: 'basic' },
    { type: 'HEADER', label: 'Cabeçalho', icon: H1Icon, category: 'basic' },
    { type: 'TEXT', label: 'Texto', icon: FileTextIcon, category: 'basic' },
    { type: 'DIVIDER', label: 'Divisor', icon: MinusIcon, category: 'basic' },
    { type: 'VIDEO', label: 'Vídeo (MP4)', icon: VideoIcon, category: 'media' },
    { type: 'VIDEO', label: 'YouTube Vídeo', icon: BrandYoutubeIcon, category: 'integrations' },
    { type: 'YOUTUBE_SUBSCRIBE', label: 'Inscrever YT', icon: ShareIcon, category: 'integrations' },
    { type: 'PINTEREST', label: 'Pinterest', icon: BrandPinterestIcon, category: 'integrations' },
    { type: 'COUNTDOWN', label: 'Contador', icon: ClockIcon, category: 'events' },
];

const filteredBlockTypes = computed(() => {
    return blockTypes.filter(b => b.category === activeCategory.value);
});

function initiateAddBlock(type: string) {
    if (type === 'DIVIDER') {
        createDirectly(type, {});
        return;
    }

    selectedType.value = type;
    Object.keys(tempContent).forEach(key => delete tempContent[key]);

    if (type === 'LINK') { tempContent.title = ''; tempContent.url = ''; }
    if (type === 'HEADER') tempContent.title = '';
    if (type === 'TEXT') tempContent.text = '';
    if (type === 'YOUTUBE_SUBSCRIBE') tempContent.channelId = '';
    if (type === 'PINTEREST') tempContent.url = '';
    if (type === 'VIDEO') tempContent.url = '';

    if (type === 'COUNTDOWN') {
        tempContent.title = '';
        tempContent.date = '';
        tempContent.buttonText = '';
        tempContent.url = '';
        tempContent.description = '';
        tempContent.endBehavior = 'none';
        tempContent.endMessage = '';
        tempContent.reminders = true;
    }

    isModalOpen.value = true;
}

async function confirmCreateBlock() {
    if (selectedType.value === 'LINK' && !tempContent.url) return toast.warning('A URL é obrigatória');
    if (selectedType.value === 'YOUTUBE_SUBSCRIBE' && !tempContent.channelId) return toast.warning('ID do canal é obrigatório');
    if ((selectedType.value === 'PINTEREST' || selectedType.value === 'VIDEO') && !tempContent.url) return toast.warning('A URL é obrigatória');

    if (selectedType.value === 'COUNTDOWN') {
        if (!tempContent.date) return toast.warning('Defina uma data e hora.');
        if (!tempContent.title) return toast.warning('Defina um título.');
    }

    try {
        await pageStore.createBlock({
            type: selectedType.value as any,
            content: { ...tempContent }
        });
        toast.success('Bloco adicionado!');
        closeModal();
    } catch (error) {
        toast.error('Erro ao adicionar bloco.');
    }
}

async function createDirectly(type: string, content: any) {
    try {
        await pageStore.createBlock({ type: type as any, content });
        toast.success('Divisor adicionado!');
    } catch (error) { toast.error('Erro ao adicionar.'); }
}

function closeModal() {
    isModalOpen.value = false;
    selectedType.value = '';
}

function deleteBlock(id: string) {
    blockIdPendingDeletion.value = id;
    isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
    if (isDeletingBlock.value) return;
    isDeleteModalOpen.value = false;
    blockIdPendingDeletion.value = null;
}

async function confirmDeleteBlock() {
    if (!blockIdPendingDeletion.value) return;

    isDeletingBlock.value = true;
    try {
        await pageStore.deleteBlock(blockIdPendingDeletion.value);
        toast.success('Bloco removido.');
        isDeleteModalOpen.value = false;
        blockIdPendingDeletion.value = null;
    } catch (e) { toast.error('Erro ao remover.'); }
    finally { isDeletingBlock.value = false; }
}

function getIconForType(type: string) {
    const found = blockTypes.find(b => b.type === type);
    if (type === 'YOUTUBE_SUBSCRIBE') return BrandYoutubeIcon;
    if (type === 'PINTEREST') return BrandPinterestIcon;
    return found?.icon || LinkIcon;
}

function getLabelForType(type: string) {
    const found = blockTypes.find(b => b.type === type);
    return found?.label || type;
}

function getBlockLabel(block: any) {
    if (block.type === 'LINK') return block.content.title || 'Link sem título';
    if (block.type === 'HEADER') return 'Cabeçalho';
    if (block.type === 'TEXT') return 'Texto';
    if (block.type === 'YOUTUBE_SUBSCRIBE') return 'Botão Inscrever-se';
    if (block.type === 'PINTEREST') return 'Pinterest Embed';
    if (block.type === 'VIDEO') return 'Vídeo';
    return block.type;
}

function getBlockSubtitle(block: any) {
    if (block.content.url) return block.content.url;
    if (block.content.title) return block.content.title;
    if (block.content.textContent) return block.content.textContent;
    if (block.content.text) return block.content.text;
    if (block.content.channelId) return `Canal: ${block.content.channelId}`;
    return '';
}

const headerOrTextContent = computed({
    get: () => selectedType.value === 'HEADER'
        ? (tempContent.title || '')
        : (tempContent.text || ''),
    set: (value: string) => {
        if (selectedType.value === 'HEADER') {
            tempContent.title = value;
            delete tempContent.text;
            delete tempContent.textContent;
            return;
        }

        tempContent.text = value;
    }
});
</script>

<style scoped>
.input-label {
    @apply block text-xs font-semibold text-slate-400 mb-1.5 ml-1;
}

.input-modern {
    @apply w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #334155;
    border-radius: 10px;
}

.block-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.block-row {
    touch-action: none;
}

:deep(.ghost-card) {
    opacity: 0.45;
    background: #1e293b;
    border: 1px dashed #6366f1;
    border-radius: 0.5rem;
}

:deep(.chosen-card) {
    border-color: #6366f1;
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35), 0 12px 30px rgba(15, 23, 42, 0.45);
}

:deep(.drag-card) {
    opacity: 0.95;
    cursor: grabbing;
}
</style>
