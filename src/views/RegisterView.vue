<template>
  <div
    class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4 font-sans">
    <div class="absolute right-4 top-4 z-20">
      <LanguageMenuButton />
    </div>
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"></div>
    </div>

    <div class="relative w-full max-w-sm transition-all duration-500 ease-in-out"
      :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'">
      <div class="relative backdrop-blur-xl bg-slate-900/60 border border-slate-800/50 rounded-2xl shadow-2xl p-8">
        <div
          class="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent">
        </div>

        <div class="flex flex-col items-center text-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 ring-1 ring-slate-700">
              <img src="/duckbio.png" alt="QuackLinks Logo" class="w-9 h-7" />
            </div>
            <h1 class="text-2xl font-bold text-white">{{ copy.title }}</h1>
            <p class="text-sm text-slate-400">{{ copy.subtitle }}</p>
          </div>

          <form @submit.prevent="handleRegister" class="w-full space-y-4">
            <div class="relative">
              <input v-model="name" id="name" type="text" required :disabled="isLoading" autocomplete="username"
                class="peer w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.nameLabel" />
              <label for="name"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.nameLabel }}
              </label>
              <div class="mt-2 flex items-center justify-between gap-3 text-xs">
                <p class="text-slate-500 truncate">
                  {{ copy.usernamePreviewPrefix }} <span class="text-slate-300 font-semibold">/{{ name || '...'
                    }}</span>
                </p>
                <p v-if="usernameStatus === 'checking'" class="text-slate-400">{{ copy.usernameChecking }}</p>
                <p v-else-if="usernameStatus === 'available'" class="text-emerald-400">{{ copy.usernameAvailable }}</p>
                <p v-else-if="usernameStatus === 'taken'" class="text-red-400">{{ copy.usernameInUse }}</p>
                <p v-else-if="usernameStatus === 'invalid'" class="text-red-400">{{ usernameError }}</p>
              </div>
            </div>

            <div class="relative">
              <input v-model="email" id="email" type="email" required :disabled="isLoading"
                class="peer w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.emailLabel" />
              <label for="email"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.emailLabel }}
              </label>
            </div>

            <div class="relative">
              <input v-model="password" id="password" :type="passwordFieldType" required :disabled="isLoading"
                class="peer w-full pl-4 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.passwordLabel" />
              <label for="password"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.passwordLabel }}
              </label>
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

            <Transition name="fade">
              <div v-if="success"
                class="flex items-center gap-2 text-sm text-center p-2 rounded-md bg-green-500/10 text-green-400">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <span>{{ success }}</span>
              </div>
            </Transition>

            <div v-if="hasTurnstile" class="space-y-2">
              <p class="text-center text-xs text-amber-300">{{ copy.turnstilePrompt }}</p>
              <TurnstileWidget v-model="turnstileToken" :reset-key="turnstileResetKey" />
            </div>

            <button type="submit" :disabled="isLoading || !!success" class="ui-btn-primary w-full py-3">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isLoading ? copy.creating : copy.submit }}</span>
            </button>
          </form>

          <p class="text-sm text-slate-400">
            {{ copy.hasAccount }}
            <router-link to="/login" class="hover:text-purple-400 transition-colors">
              {{ copy.loginLink }}
            </router-link>
          </p>
        </div>
      </div>
      <div
        class="absolute -z-10 -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import LanguageMenuButton from '@/components/LanguageMenuButton.vue';
import TurnstileWidget from '@/components/auth/TurnstileWidget.vue';
import { useAppLanguage } from '@/composables/useAppLanguage';
import {
  isPublicHandleAvailable,
  normalizePublicHandle,
  validatePublicHandle,
} from '@/utils/publicHandle';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);
const isMounted = ref(false);
const turnstileToken = ref<string | null>(null);
const turnstileResetKey = ref(0);
const hasTurnstile = computed(
  () => Boolean((import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim()),
);

const router = useRouter();
const authStore = useAuthStore();
const { locale } = useAppLanguage();

const translations = {
  pt: {
    title: 'Criar Conta',
    subtitle: 'Crie sua conta para continuar.',
    nameLabel: 'Nome de usuário',
    usernamePreviewPrefix: 'Seu link:',
    usernameChecking: 'Verificando...',
    usernameAvailable: 'Disponível',
    usernameInUse: 'Este nome de usuário já está em uso.',
    usernameInvalid: 'Escolha um nome de usuário válido.',
    usernameRequired: 'Informe um nome de usuário.',
    usernameTooShort: 'Use pelo menos 3 caracteres.',
    usernameReserved: 'Este nome de usuário não está disponível.',
    emailLabel: 'E-mail',
    passwordLabel: 'Senha',
    creating: 'Criando...',
    submit: 'Criar Conta',
    hasAccount: 'Já tem uma conta?',
    loginLink: 'Faça login',
    successMessage: 'Conta criada com sucesso! Redirecionando para verificacao...',
    emailInUse: 'Este email já está em uso. Tente outro.',
    genericError: 'Ocorreu um erro ao criar a conta.',
    turnstilePrompt: 'Confirme o desafio anti-bot para criar sua conta.',
  },
  en: {
    title: 'Create Account',
    subtitle: 'Create your account to continue.',
    nameLabel: 'Username',
    usernamePreviewPrefix: 'Your link:',
    usernameChecking: 'Checking...',
    usernameAvailable: 'Available',
    usernameInUse: 'This username is already taken.',
    usernameInvalid: 'Choose a valid username.',
    usernameRequired: 'Enter a username.',
    usernameTooShort: 'Use at least 3 characters.',
    usernameReserved: 'This username is not available.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    creating: 'Creating...',
    submit: 'Create Account',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign in',
    successMessage: 'Account created successfully! Redirecting to verification...',
    emailInUse: 'This email is already in use. Try another one.',
    genericError: 'An error occurred while creating the account.',
    turnstilePrompt: 'Complete the anti-bot challenge to create your account.',
  },
  es: {
    title: 'Crear Cuenta',
    subtitle: 'Crea tu cuenta para continuar.',
    nameLabel: 'Nombre de usuario',
    usernamePreviewPrefix: 'Tu link:',
    usernameChecking: 'Verificando...',
    usernameAvailable: 'Disponible',
    usernameInUse: 'Este nombre de usuario ya está en uso.',
    usernameInvalid: 'Elige un nombre de usuario válido.',
    usernameRequired: 'Ingresa un nombre de usuario.',
    usernameTooShort: 'Usa al menos 3 caracteres.',
    usernameReserved: 'Este nombre de usuario no está disponible.',
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    creating: 'Creando...',
    submit: 'Crear Cuenta',
    hasAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Inicia sesión',
    successMessage: '¡Cuenta creada con éxito! Redirigiendo a verificación...',
    emailInUse: 'Este email ya está en uso. Prueba otro.',
    genericError: 'Ocurrió un error al crear la cuenta.',
    turnstilePrompt: 'Completa el desafio anti-bot para crear tu cuenta.',
  },
} as const;

const copy = computed(() => translations[locale.value]);
const isPasswordVisible = ref(false);
const usernameStatus = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
const usernameError = ref<string | null>(null);
let usernameCheckTimer: number | null = null;
let lastCheckedUsername = '';

const checkUsernameAvailability = async (value: string) => {
  const normalized = normalizePublicHandle(value);
  const validationError = validatePublicHandle(normalized, {
    required: copy.value.usernameRequired,
    tooShort: copy.value.usernameTooShort,
    reserved: copy.value.usernameReserved,
  });

  if (normalized !== value) {
    name.value = normalized;
  }

  if (validationError) {
    usernameStatus.value = normalized ? 'invalid' : 'idle';
    usernameError.value = validationError;
    return false;
  }

  if (lastCheckedUsername === normalized && usernameStatus.value !== 'checking') {
    return usernameStatus.value === 'available';
  }

  usernameStatus.value = 'checking';
  usernameError.value = null;
  lastCheckedUsername = normalized;

  try {
    const isAvailable = await isPublicHandleAvailable(normalized);
    usernameStatus.value = isAvailable ? 'available' : 'taken';
    return isAvailable;
  } catch {
    usernameStatus.value = 'idle';
    return false;
  }
};

watch(name, (value) => {
  const normalized = normalizePublicHandle(value);
  if (normalized !== value) {
    name.value = normalized;
    return;
  }

  if (!normalized) {
    usernameStatus.value = 'idle';
    usernameError.value = null;
    lastCheckedUsername = '';
    if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
    usernameCheckTimer = null;
    return;
  }

  const validationError = validatePublicHandle(normalized, {
    required: copy.value.usernameRequired,
    tooShort: copy.value.usernameTooShort,
    reserved: copy.value.usernameReserved,
  });
  if (validationError) {
    usernameStatus.value = 'invalid';
    usernameError.value = validationError;
    lastCheckedUsername = '';
    if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
    usernameCheckTimer = null;
    return;
  }

  if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
  usernameCheckTimer = window.setTimeout(() => {
    checkUsernameAvailability(normalized);
  }, 350);
});

onUnmounted(() => {
  if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
});

onMounted(() => {
  setTimeout(() => isMounted.value = true, 100);
});

const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const resolveErrorMessage = (err: any, fallback: string) => {
  if (typeof err?.response?.data === 'string' && err.response.data.trim()) {
    return err.response.data;
  }
  return err?.response?.data?.message || err?.message || fallback;
};

const handleRegister = async () => {
  error.value = null;
  success.value = null;
  isLoading.value = true;
  try {
    const isAvailable = await checkUsernameAvailability(name.value);
    if (!isAvailable) {
      error.value =
        usernameStatus.value === 'taken'
          ? copy.value.usernameInUse
          : usernameError.value || copy.value.usernameInvalid;
      return;
    }

    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      turnstileToken: turnstileToken.value,
    });
    success.value = copy.value.successMessage;
    setTimeout(() => {
      router.push({
        path: '/verify-email',
        query: {
          email: email.value,
        },
      });
    }, 2000);

  } catch (err: any) {
    if (
      err?.response?.data?.code === 'TURNSTILE_REQUIRED' ||
      err?.response?.data?.code === 'TURNSTILE_INVALID' ||
      err?.response?.data?.code === 'TURNSTILE_UNAVAILABLE'
    ) {
      turnstileToken.value = null;
      turnstileResetKey.value += 1;
    }
    if (err.response && err.response.status === 409) {
      const resolved = resolveErrorMessage(err, '');
      if (/user(name)?|slug/i.test(resolved)) {
        error.value = copy.value.usernameInUse;
      } else {
        error.value = copy.value.emailInUse;
      }
    } else {
      error.value = resolveErrorMessage(err, copy.value.genericError);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
