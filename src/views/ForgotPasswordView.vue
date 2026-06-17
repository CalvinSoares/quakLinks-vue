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
          <div class="flex flex-col items-center gap-3">
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 ring-1 ring-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">{{ copy.title }}</h1>
              <p class="text-sm text-slate-400">{{ copy.subtitle }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="w-full space-y-4">
            <div class="relative">
              <input v-model="email" id="email" type="email" required :disabled="isLoading || !!success"
                class="peer w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.emailLabel" />
              <label for="email"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.emailLabel }}
              </label>
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

            <button type="submit" :disabled="isLoading || !!success" class="ui-btn-primary w-full py-3">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isLoading ? copy.submitting : copy.submit }}</span>
            </button>
          </form>

          <p class="text-sm text-slate-400">
            <router-link to="/login" class="hover:text-purple-400 transition-colors">
              {{ copy.backToLogin }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import LanguageMenuButton from "@/components/LanguageMenuButton.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const authStore = useAuthStore();
const router = useRouter();
const { locale } = useAppLanguage();

const email = ref("");
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);
const isMounted = ref(false);

const translations = {
  pt: {
    title: "Esqueci a senha",
    subtitle: "Informe seu e-mail para receber o código de redefinição.",
    emailLabel: "E-mail",
    submit: "Enviar código",
    submitting: "Enviando...",
    successMessage: "Se o e-mail existir, o código foi enviado. Redirecionando...",
    genericError: "Não foi possível solicitar a redefinição agora.",
    backToLogin: "Voltar para login",
  },
  en: {
    title: "Forgot password",
    subtitle: "Enter your email to receive the reset code.",
    emailLabel: "Email",
    submit: "Send code",
    submitting: "Sending...",
    successMessage: "If the email exists, the code was sent. Redirecting...",
    genericError: "Could not request a password reset right now.",
    backToLogin: "Back to login",
  },
  es: {
    title: "Olvidé mi contraseña",
    subtitle: "Ingresa tu email para recibir el código de recuperación.",
    emailLabel: "Email",
    submit: "Enviar código",
    submitting: "Enviando...",
    successMessage: "Si el email existe, el código fue enviado. Redirigiendo...",
    genericError: "No se pudo solicitar la recuperación ahora.",
    backToLogin: "Volver al login",
  },
} as const;

const copy = computed(() => translations[locale.value]);

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

const resolveErrorMessage = (err: any, fallback: string) => {
  if (typeof err?.response?.data === "string" && err.response.data.trim()) {
    return err.response.data;
  }
  return err?.response?.data?.message || err?.message || fallback;
};

const handleSubmit = async () => {
  error.value = null;
  success.value = null;
  isLoading.value = true;

  try {
    await authStore.requestPasswordReset(email.value);
    success.value = copy.value.successMessage;
    setTimeout(() => {
      router.push({
        path: "/reset-password",
        query: { email: email.value },
      });
    }, 1400);
  } catch (err: any) {
    error.value = resolveErrorMessage(err, copy.value.genericError);
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
