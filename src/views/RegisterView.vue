<template>
  <div
    class="relative flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl">
      </div>
    </div>
    <div
      class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]">
    </div>

    <div class="relative w-full max-w-sm">
      <div
        class="relative backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-2xl shadow-2xl p-6 space-y-4">
        <div
          class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent">
        </div>

        <div class="text-center">
          <h2 class="flex items-center justify-center gap-3 text-2xl font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Criar Conta
          </h2>
          <p class="text-slate-400 text-xs mt-1">Rápido e fácil para começar.</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input v-model="name" type="text" placeholder="Nome completo" required :disabled="isLoading"
              class="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50" />
          </div>

          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input v-model="email" type="email" placeholder="Email" required :disabled="isLoading"
              class="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50" />
          </div>

          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input v-model="password" type="password" placeholder="Senha" required :disabled="isLoading"
              class="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50" />
          </div>

          <div v-if="error" class="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 flex-shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <div v-if="success"
            class="flex items-center gap-2 p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400 flex-shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-green-400">{{ success }}</p>
          </div>

          <button type="submit" :disabled="isLoading || !!success"
            class="relative w-full px-4 py-2.5 font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100">
            <span class="relative z-10">{{ isLoading ? 'Criando...' : 'Criar Conta' }}</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
          </button>
        </form>

        <p class="text-xs text-center text-slate-400">
          Já tem uma conta?
          <router-link to="/login" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Faça login
          </router-link>
        </p>
      </div>
      <div
        class="absolute -z-10 -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const handleRegister = async () => {
  error.value = null;
  success.value = null;
  isLoading.value = true;
  try {
    const response = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });
    success.value = 'Conta criada com sucesso! Redirecionando...';
    setTimeout(() => {
      router.push({
        name: 'verify-email',
        query: { email: email.value }
      });
    }, 2000);

  } catch (err: any) {
    if (err.response && err.response.status === 409) {
      error.value = 'Este email já está em uso. Tente outro.';
    } else {
      error.value = err.response?.data?.message || 'Ocorreu um erro ao criar a conta.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>