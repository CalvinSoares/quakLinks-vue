<template>
  <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4">
    <!-- Elementos de fundo (consistentes com o original) -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- Card de Verificação com Animação de Entrada -->
    <div 
      class="relative w-full max-w-md transition-all duration-500 ease-in-out"
      :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
    >
      <div class="relative backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-2xl shadow-2xl p-8">
        <!-- Brilho superior -->
        <div class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        
        <div class="flex flex-col items-center text-center gap-6">
          <!-- Header Melhorado -->
          <div class="flex flex-col items-center gap-4">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 ring-1 ring-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="space-y-1">
              <h2 class="text-2xl font-bold text-white">Verifique seu E-mail</h2>
              <p class="text-slate-400 text-sm">
                Enviamos um código para <span class="font-semibold text-amber-400 break-all">{{ email }}</span>.
              </p>
            </div>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="handleVerify" class="w-full space-y-6">
            <!-- Input de Código (OTP) Dinâmico -->
            <div class="flex justify-center gap-2" @paste="handlePaste">
              <input
                v-for="i in 6"
                :key="i"
               :ref="setInputRef"
                v-model="code[i - 1]"
                type="text"
                maxlength="1"
                required
                :disabled="isLoading || !!success"
                @input="handleInput(i - 1)"
                @keydown="handleKeydown(i - 1, $event)"
                class="w-12 h-14 text-center text-2xl font-mono bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
              />
            </div>

            <!-- Mensagens de Feedback com Transição -->
            <Transition name="fade">
              <div v-if="error || success" class="flex items-center justify-center gap-2 text-sm text-center p-2 rounded-md" 
                :class="{ 'bg-red-500/10 text-red-400': error, 'bg-green-500/10 text-green-400': success }">
                <svg v-if="error" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                <svg v-if="success" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                <span>{{ error || success }}</span>
              </div>
            </Transition>
            
            <!-- Botão de Submissão com Estados Visuais -->
            <button 
              type="submit" 
              :disabled="isLoading || !!success || token.length !== 6"
              class="w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-if="success" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              {{ success ? 'Verificado!' : isLoading ? 'Verificando...' : 'Verificar Conta' }}
            </button>
          </form>

          <!-- Link para Login -->
          <p class="text-xs text-center text-slate-400">
            Já verificou? 
            <router-link to="/login" class="text-purple-400 hover:text-purple-300 font-medium">
              Faça login aqui
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// --- State ---
const code = ref<string[]>(new Array(6).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);
const email = ref('');
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);
const isMounted = ref(false);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// --- Computed ---
const token = computed(() => code.value.join(''));

// --- Hooks ---
onMounted(() => {
  // Animação de entrada
  setTimeout(() => isMounted.value = true, 100);

  if (route.query.email) {
    email.value = route.query.email as string;
  } else {
    router.push('/register');
  }
  // Foca no primeiro input ao carregar
  inputRefs.value[0]?.focus();
});

const setInputRef = (el: any) => {
  // Adicionamos ao array apenas se 'el' for um elemento válido (não nulo)
  if (el) {
    inputRefs.value.push(el);
  }
};

// --- Métodos ---
const handleVerify = async () => {
  if (token.value.length !== 6) return;
  
  error.value = null;
  success.value = null;
  isLoading.value = true;
  
  try {
    const response = await authStore.verifyEmail({ 
      email: email.value, 
      token: token.value 
    });
    success.value = 'Código verificado com sucesso! Redirecionando...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Código inválido ou expirado.';
    code.value.fill(''); // Limpa os campos em caso de erro
    inputRefs.value[0]?.focus();
  } finally {
    isLoading.value = false;
  }
};

// Lógica para os inputs de OTP
const handleInput = (index: number) => {
  // Limpa mensagens de erro ao começar a digitar
  error.value = null;
  const currentInput = inputRefs.value[index];
  const nextInput = inputRefs.value[index + 1];

  // Se o valor for um número, move para o próximo input
  if (currentInput?.value.match(/^[0-9]$/) && nextInput) {
    nextInput.focus();
  }
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
  const prevInput = inputRefs.value[index - 1];
  
  // Se Backspace for pressionado e o campo estiver vazio, move para o anterior
  if (event.key === 'Backspace' && !code.value[index] && prevInput) {
    prevInput.focus();
  }
};

const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text').trim().slice(0, 6);
  
  if (pastedData && /^\d{6}$/.test(pastedData)) {
    pastedData.split('').forEach((char, index) => {
      code.value[index] = char;
    });
    // Aguarda o DOM atualizar e foca no último campo ou dispara a verificação
    await nextTick();
    inputRefs.value[5]?.focus();
    handleVerify();
  }
};
</script>

<style scoped>
/* Animação de Fade para as mensagens de erro/sucesso */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>