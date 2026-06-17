<template>
    <button @click="handleUpgrade" :disabled="isLoading"
        class="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center ">
        <SparklesIcon class="w-6 h-6 text-white" />

        <span v-if="isLoading">{{ copy.loading }}</span>
        <span v-else>{{ copy.button }}</span>
    </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon } from '@heroicons/vue/24/solid';
import { toast } from 'vue-sonner';
import { useAppLanguage } from '@/composables/useAppLanguage';

const router = useRouter();
const isLoading = ref(false);
const { locale } = useAppLanguage();

const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                loading: 'Opening plans...',
                button: 'View Plans and Upgrade',
                error: 'Could not open the plans page. Please try again.',
            };
        case 'es':
            return {
                loading: 'Abriendo planes...',
                button: 'Ver Planes y Upgrade',
                error: 'No se pudo abrir la pantalla de planes. Intenta nuevamente.',
            };
        default:
            return {
                loading: 'Abrindo planos...',
                button: 'Ver Planos e Upgrade',
                error: 'Não foi possível abrir a tela de planos. Tente novamente.',
            };
    }
});

async function handleUpgrade() {
    isLoading.value = true;
    try {
        await router.push('/dashboard/plans');
    } catch (error) {
        toast.error(copy.value.error);
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
