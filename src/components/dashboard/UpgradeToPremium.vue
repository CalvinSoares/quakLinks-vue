<template>
    <button @click="handleUpgrade" :disabled="isLoading"
        class="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center ">
        <SparklesIcon class="w-6 h-6 text-white" />

        <span v-if="isLoading">Aguarde...</span>
        <span v-else>Fazer Upgrade Agora</span>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { SparklesIcon } from '@heroicons/vue/24/solid';

const userStore = useUserStore();
const isLoading = ref(false);

async function handleUpgrade() {
    isLoading.value = true;
    try {
        await userStore.redirectToCheckout();
    } catch (error) {
        alert('Não foi possível iniciar o pagamento. Tente novamente.');
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}
</script>