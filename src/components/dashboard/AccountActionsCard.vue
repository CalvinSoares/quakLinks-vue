<template>
    <div
        class="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-xl space-y-6 h-full">
        <div>
            <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Cog6ToothIcon class="w-6 h-6 text-yellow-400" />
                {{ copy.manageAccount }}
            </h2>
            <p class="text-sm text-slate-400 mb-4">{{ copy.accountDescription }}</p>
            <div class="space-y-2">
                <button @click="$emit('changeUsername')" class="action-button group">
                    <div class="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <PencilSquareIcon class="w-5 h-5 text-yellow-400" />
                    </div>
                    <span class="text-white font-medium">{{ copy.changeUsername }}</span>
                    <ChevronRightIcon
                        class="w-5 h-5 ml-auto text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </button>
                <button @click="$emit('changeDisplayName')" class="action-button group">
                    <div class="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <UserCircleIcon class="w-5 h-5 text-yellow-400" />
                    </div>
                    <span class="text-white font-medium">{{ copy.changeDisplayName }}</span>
                    <ChevronRightIcon
                        class="w-5 h-5 ml-auto text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </button>
            </div>
        </div>

        <hr class="border-slate-700/50">

        <div>
            <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <LinkIcon class="w-6 h-6 text-yellow-400" />
                {{ copy.connections }}
            </h3>
            <p class="text-sm text-slate-400 mb-4">{{ copy.connectionsDescription }}</p>

            <div v-if="isDiscordConnected" class="flex items-center gap-2">
                <div
                    class="flex-grow flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-semibold">
                    <component :is="BrandDiscordIcon" class="w-5 h-5" />
                    <span>{{ copy.discordConnected }}</span>
                </div>
                <button @click="$emit('disconnectDiscord')" :title="copy.disconnect"
                    class="ui-btn-danger w-11 h-11 flex-shrink-0 p-0">
                    <XMarkIcon class="w-6 h-6 text-white" />
                </button>
            </div>

            <button v-else @click="$emit('connectDiscord')"
                class="ui-btn-primary w-full">
                <component :is="BrandDiscordIcon" class="w-5 h-5" />
                <span>{{ copy.connectDiscord }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Cog6ToothIcon, LinkIcon, PencilSquareIcon, UserCircleIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { BrandDiscordIcon } from 'vue-tabler-icons';
import { useAppLanguage } from '@/composables/useAppLanguage';

defineProps<{
    isDiscordConnected: boolean;
}>();

defineEmits(['changeUsername', 'changeDisplayName', 'connectDiscord', 'disconnectDiscord']);

const { locale } = useAppLanguage();

const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                manageAccount: 'Manage Account',
                accountDescription: 'Change your email, username, and more.',
                changeUsername: 'Change Username',
                changeDisplayName: 'Change Display Name',
                connections: 'Connections',
                connectionsDescription: 'Link your Discord account.',
                discordConnected: 'Discord Connected',
                disconnect: 'Disconnect',
                connectDiscord: 'Connect Discord',
            };
        case 'es':
            return {
                manageAccount: 'Administrar Cuenta',
                accountDescription: 'Cambia tu email, nombre de usuario y más.',
                changeUsername: 'Cambiar Usuario',
                changeDisplayName: 'Cambiar Nombre Visible',
                connections: 'Conexiones',
                connectionsDescription: 'Vincula tu cuenta de Discord.',
                discordConnected: 'Discord Conectado',
                disconnect: 'Desconectar',
                connectDiscord: 'Conectar Discord',
            };
        default:
            return {
                manageAccount: 'Manage Account',
                accountDescription: 'Altere seu e-mail, nome de usuário e mais.',
                changeUsername: 'Change Username',
                changeDisplayName: 'Change Display Name',
                connections: 'Connections',
                connectionsDescription: 'Vincule sua conta do Discord.',
                discordConnected: 'Discord Connected',
                disconnect: 'Desconectar',
                connectDiscord: 'Connect Discord',
            };
    }
});
</script>

<style scoped>
.action-button {
    @apply w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-yellow-500/50 rounded-xl transition-all duration-300;
}
</style>
