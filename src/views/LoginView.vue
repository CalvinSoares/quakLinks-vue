<template>
  <div
    class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4 font-sans">
    <!-- Elementos de fundo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"></div>
    </div>

    <!-- Card de Login com Animação de Entrada -->
    <div class="relative w-full max-w-sm transition-all duration-500 ease-in-out"
      :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
      <div class="relative backdrop-blur-xl bg-slate-900/60 border border-slate-800/50 rounded-2xl shadow-2xl p-8">
        <!-- Brilho superior -->
        <div
          class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent">
        </div>

        <div class="flex flex-col items-center text-center gap-6">

          <!-- Seção de Logo (Estilo QuackLinks) -->
          <div class="flex flex-col items-center gap-2">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 ring-1 ring-slate-700">
              <!-- SVG de Pato (Exemplo para QuackLinks) -->
              <img src="/duckbio.png" alt="QuackLinks Logo" class="w-9 h-7" />

            </div>
            <h1 class="text-2xl font-bold text-white">Bem-vindo(a)</h1>
            <p class="text-sm text-slate-400">Faça login para continuar.</p>
          </div>

          <!-- Botões de Login Social Aprimorados -->
          <div class="w-full space-y-3">
            <button
              class="flex items-center justify-center gap-3 w-full py-3 text-sm font-semibold text-slate-800 bg-white rounded-lg hover:bg-slate-200 transition-colors base">
              <svg class="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                </path>
                <path fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                </path>
                <path fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                </path>
                <path fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                </path>
              </svg>
              Continuar com Google
            </button>
            <a :href="discordLoginUrl"
              class="flex items-center justify-center gap-3 w-full py-3 text-sm font-semibold text-white bg-[#24292F] rounded-lg hover:bg-[#30363d] transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.034c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span class="ml-2">Entrar com Discord</span>
            </a>
          </div>

          <!-- Divisor -->
          <div class="relative w-full">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-700/50"></div>
            </div>
            <div class="relative flex justify-center text-xs"><span class="px-2 bg-slate-900 text-slate-500">ou</span>
            </div>
          </div>

          <!-- Formulário com E-mail e Senha -->
          <form @submit.prevent="handleLogin" class="w-full space-y-4">
            <!-- Inputs com Floating Label mantidos -->
            <div class="relative">
              <input v-model="email" id="email" type="email" required :disabled="isLoading"
                class="peer w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                placeholder="E-mail" />
              <label for="email"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">E-mail</label>
            </div>
            <div class="relative">
              <input v-model="password" id="password" :type="passwordFieldType" required :disabled="isLoading"
                class="peer w-full pl-4 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                placeholder="Senha" />
              <label for="password"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">Senha</label>
              <button type="button" @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-purple-400">
                <svg v-if="!isPasswordVisible" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  stroke-width="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>

            <Transition name="fade">
              <div v-if="error"
                class="flex items-center gap-2 text-sm text-center p-2 rounded-md bg-red-500/10 text-red-400">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
                </svg>
                <span>{{ error }}</span>
              </div>
            </Transition>

            <button type="submit" :disabled="isLoading"
              class="w-full flex items-center justify-center py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-60">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isLoading ? 'Entrando...' : 'Entrar com E-mail' }}</span>
            </button>
          </form>

          <div class="text-sm text-slate-400 flex items-center justify-between w-full">
            <router-link to="/register" class="hover:text-purple-400 transition-colors">Criar conta</router-link>
            <router-link to="/esqueci-senha" class="hover:text-purple-400 transition-colors">Esqueci a
              senha</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// O SCRIPT PERMANECE O MESMO, APENAS COPIADO ABAIXO PARA COMPLETUDE
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const isLoading = ref(false);
const isMounted = ref(false);
const isPasswordVisible = ref(false);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const discordLoginUrl = `${apiUrl}/auth/discord`;

onMounted(() => {
  setTimeout(() => isMounted.value = true, 100);
});

const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleLogin = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    await router.push('/dashboard/overview');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Email ou senha inválidos.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* A animação de fade para o erro permanece útil */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>