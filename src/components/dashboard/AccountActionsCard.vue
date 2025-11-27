<!-- src/components/dashboard/overview/AccountActionsCard.vue -->
<template>
    <div
        class="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl space-y-6 h-full">
        <!-- Seção de Gerenciamento -->
        <div>
            <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Cog6ToothIcon class="w-6 h-6 text-yellow-400" />
                Manage Account
            </h2>
            <p class="text-sm text-slate-400 mb-4">Altere seu e-mail, nome de usuário e mais.</p>
            <div class="space-y-2">
                <button @click="$emit('changeUsername')" class="action-button group">
                    <div class="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <PencilSquareIcon class="w-5 h-5 text-yellow-400" />
                    </div>
                    <span class="text-white font-medium">Change Username</span>
                    <ChevronRightIcon
                        class="w-5 h-5 ml-auto text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </button>
                <button @click="$emit('changeDisplayName')" class="action-button group">
                    <div class="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <UserCircleIcon class="w-5 h-5 text-yellow-400" />
                    </div>
                    <span class="text-white font-medium">Change Display Name</span>
                    <ChevronRightIcon
                        class="w-5 h-5 ml-auto text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </button>
            </div>
        </div>

        <!-- Divisor -->
        <hr class="border-slate-700/50">

        <!-- Seção de Conexões -->
        <div>
            <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <LinkIcon class="w-6 h-6 text-yellow-400" />
                Connections
            </h3>
            <p class="text-sm text-slate-400 mb-4">Vincule sua conta do Discord.</p>

            <!-- Estado Conectado -->
            <div v-if="isDiscordConnected" class="flex items-center gap-2">
                <div
                    class="flex-grow flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl text-white font-semibold shadow-lg">
                    <component :is="BrandDiscordIcon" class="w-5 h-5" />
                    <span>Discord Connected</span>
                </div>
                <button @click="$emit('disconnectDiscord')" title="Desconectar"
                    class="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    <XMarkIcon class="w-6 h-6 text-white" />
                </button>
            </div>

            <!-- Estado Desconectado -->
            <button v-else @click="$emit('connectDiscord')"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <component :is="BrandDiscordIcon" class="w-5 h-5" />
                <span>Connect Discord</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Cog6ToothIcon, LinkIcon, PencilSquareIcon, UserCircleIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { BrandDiscordIcon } from 'vue-tabler-icons';

defineProps<{
    isDiscordConnected: boolean;
}>();

defineEmits(['changeUsername', 'changeDisplayName', 'connectDiscord', 'disconnectDiscord']);
</script>

<style scoped>
.action-button {
    @apply w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-indigo-500/20 border border-slate-700 hover:border-yellow-500/50 rounded-xl transition-all duration-300;
}
</style>