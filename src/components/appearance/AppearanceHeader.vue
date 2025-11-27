<template>
    <header class="mb-8 flex-shrink-0">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div class="space-y-2">
                <div class="flex items-center gap-3">
                    <div
                        class="p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-xl border border-yellow-400/30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                    </div>
                    <h1 class="text-4xl font-bold text-white tracking-tight">Aparência</h1>
                </div>
                <p class="text-slate-400 text-lg">Personalize seu perfil e crie uma experiência única.</p>
            </div>
            <button @click="$emit('save')" :disabled="isSaving"
                class="flex-shrink-0 px-6 py-3 font-semibold text-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <span v-if="!isSaving">Salvar Alterações</span>
                <span v-else class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Salvando...
                </span>
            </button>
        </div>

        <div class="mt-8">
            <div
                class="flex items-center gap-1 bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl border border-slate-700/50 w-fit overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.id" @click="$emit('tab-change', tab.id)" :class="[
                    'relative px-6 py-2.5 font-semibold text-sm transition-all duration-300 rounded-lg whitespace-nowrap',
                    activeTab === tab.id
                        ? `text-slate-900 ${tab.gradient} shadow-lg ${tab.shadow}`
                        : 'text-slate-400 hover:text-slate-300'
                ]">
                    <component :is="tab.icon" class="w-4 h-4 inline mr-2" />
                    {{ tab.label }}
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { h } from 'vue'

defineProps<{
    activeTab: string
    isSaving: boolean
}>()

defineEmits<{
    save: []
    'tab-change': [tab: string]
}>()

const tabs = [
    {
        id: 'profile',
        label: 'Perfil',
        gradient: 'bg-gradient-to-r from-blue-400 to-blue-300',
        shadow: 'shadow-blue-400/30',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' })
        ])
    },
    {
        id: 'media',
        label: 'Mídia',
        gradient: 'bg-gradient-to-r from-amber-400 to-amber-300',
        shadow: 'shadow-amber-400/30',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' })
        ])
    },
    {
        id: 'colors',
        label: 'Cores',
        gradient: 'bg-gradient-to-r from-pink-400 to-pink-300',
        shadow: 'shadow-pink-400/30',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' })
        ])
    },
    {
        id: 'preview',
        label: 'Preview',
        gradient: 'bg-gradient-to-r from-emerald-400 to-emerald-300',
        shadow: 'shadow-emerald-400/30',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' }),
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
        ])
    }
]
</script>