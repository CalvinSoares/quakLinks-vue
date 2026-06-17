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
            <div class="flex items-center justify-center w-16 h-16 rounded-full ring-1 transition-colors"
              :class="isCodeStepConfirmed ? 'bg-emerald-500/10 ring-emerald-500/20' : 'bg-purple-500/10 ring-purple-500/20'">
              <svg v-if="!isCodeStepConfirmed" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zm0 0c-2.761 0-5 2.015-5 4.5V18h10v-2.5c0-2.485-2.239-4.5-5-4.5zm6-1h1a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h1" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
              </svg>
            </div>
            <div class="space-y-2">
              <h1 class="text-2xl font-bold text-white">{{ copy.title }}</h1>
              <p class="text-sm text-slate-400">{{ copy.subtitle }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="w-full space-y-4">
            <div v-if="!isCodeStepConfirmed" class="relative">
              <input v-model="email" id="email" type="email" required :disabled="isLoading || !!success"
                class="peer w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.emailLabel" />
              <label for="email"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.emailLabel }}
              </label>
            </div>

            <div v-if="!isCodeStepConfirmed" class="space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">{{ copy.codeLabel }}</p>
              <div class="flex justify-center gap-2" @paste="handlePaste">
                <input v-for="i in 6" :key="i" :ref="(el) => setInputRef(el, i - 1)" v-model="code[i - 1]" type="text"
                  maxlength="1" required :disabled="isLoading || !!success || isCodeStepConfirmed"
                  @input="handleInput(i - 1)" @keydown="handleKeydown(i - 1, $event)"
                  class="h-12 w-11 text-center text-xl font-mono bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>
            </div>

            <div v-if="isCodeStepConfirmed" class="flex justify-end">
              <button type="button" @click="unlockCodeStep"
                class="inline-flex items-center text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200">
                {{ copy.editCode }}
              </button>
            </div>

            <div v-if="isCodeStepConfirmed" class="relative">
              <input v-model="newPassword" id="new-password" :type="newPasswordFieldType" required
                :disabled="isLoading || !!success"
                class="peer w-full pl-4 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.newPasswordLabel" />
              <label for="new-password"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.newPasswordLabel }}
              </label>
              <button type="button" @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-purple-400">
                <svg v-if="!showNewPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
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

            <div v-if="isCodeStepConfirmed" class="relative">
              <input v-model="confirmPassword" id="confirm-password" :type="confirmPasswordFieldType" required
                :disabled="isLoading || !!success"
                class="peer w-full pl-4 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50"
                :placeholder="copy.confirmPasswordLabel" />
              <label for="confirm-password"
                class="absolute left-4 -top-2.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-400 peer-focus:text-sm pointer-events-none bg-slate-900 px-1">
                {{ copy.confirmPasswordLabel }}
              </label>
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-purple-400">
                <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
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

            <button type="submit" :disabled="isLoading || !!success" class="ui-btn-primary w-full py-3">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ isLoading ? copy.submitting : submitLabel }}</span>
            </button>
          </form>

          <div class="flex items-center justify-between gap-4 w-full text-sm text-slate-400">
            <router-link to="/esqueci-senha" class="hover:text-purple-400 transition-colors">
              {{ copy.requestNewCode }}
            </router-link>
            <router-link to="/login" class="hover:text-purple-400 transition-colors">
              {{ copy.backToLogin }}
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="absolute -z-10 -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, type ComponentPublicInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import LanguageMenuButton from "@/components/LanguageMenuButton.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { locale } = useAppLanguage();

const email = ref("");
const code = ref<string[]>(new Array(6).fill(""));
const inputRefs = ref<Array<HTMLInputElement | null>>(Array(6).fill(null));
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);
const isMounted = ref(false);
const isCodeStepConfirmed = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const translations = {
  pt: {
    title: "Redefinir senha",
    subtitle: "Confirme o código recebido por e-mail para liberar a criação da nova senha.",
    emailLabel: "E-mail",
    codeLabel: "Código",
    confirmCodeCta: "Confirmar código",
    newPasswordLabel: "Nova senha",
    confirmPasswordLabel: "Confirmar nova senha",
    submit: "Salvar nova senha",
    submitting: "Salvando...",
    successMessage: "Senha redefinida com sucesso! Redirecionando...",
    invalidCode: "Código inválido ou expirado.",
    incompleteCode: "Digite o código completo de 6 dígitos.",
    passwordMismatch: "As senhas não coincidem.",
    codeConfirmedTitle: "Código confirmado",
    codeConfirmedDescription: "Agora escolha a nova senha para concluir a redefinição.",
    editCode: "Alterar código",
    genericError: "Não foi possível redefinir a senha agora.",
    requestNewCode: "Solicitar novo código",
    backToLogin: "Voltar para login",
  },
  en: {
    title: "Reset password",
    subtitle: "Confirm the code sent by email to unlock the new password step.",
    emailLabel: "Email",
    codeLabel: "Code",
    confirmCodeCta: "Confirm code",
    newPasswordLabel: "New password",
    confirmPasswordLabel: "Confirm new password",
    submit: "Save new password",
    submitting: "Saving...",
    successMessage: "Password reset successfully! Redirecting...",
    invalidCode: "Invalid or expired code.",
    incompleteCode: "Enter the full 6-digit code.",
    passwordMismatch: "Passwords do not match.",
    codeConfirmedTitle: "Code confirmed",
    codeConfirmedDescription: "Now choose your new password to finish the reset.",
    editCode: "Edit code",
    genericError: "Could not reset the password right now.",
    requestNewCode: "Request new code",
    backToLogin: "Back to login",
  },
  es: {
    title: "Restablecer contraseña",
    subtitle: "Confirma el código recibido por email para desbloquear la nueva contraseña.",
    emailLabel: "Email",
    codeLabel: "Código",
    confirmCodeCta: "Confirmar código",
    newPasswordLabel: "Nueva contraseña",
    confirmPasswordLabel: "Confirmar nueva contraseña",
    submit: "Guardar nueva contraseña",
    submitting: "Guardando...",
    successMessage: "¡Contraseña restablecida con éxito! Redirigiendo...",
    invalidCode: "Código inválido o expirado.",
    incompleteCode: "Ingresa el código completo de 6 dígitos.",
    passwordMismatch: "Las contraseñas no coinciden.",
    codeConfirmedTitle: "Código confirmado",
    codeConfirmedDescription: "Ahora elige la nueva contraseña para terminar el proceso.",
    editCode: "Cambiar código",
    genericError: "No se pudo restablecer la contraseña ahora.",
    requestNewCode: "Solicitar nuevo código",
    backToLogin: "Volver al login",
  },
} as const;

const copy = computed(() => translations[locale.value]);
const token = computed(() => code.value.join(""));
const submitLabel = computed(() => isCodeStepConfirmed.value ? copy.value.submit : copy.value.confirmCodeCta);
const newPasswordFieldType = computed(() => showNewPassword.value ? "text" : "password");
const confirmPasswordFieldType = computed(() => showConfirmPassword.value ? "text" : "password");

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 100);

  if (typeof route.query.email === "string") {
    email.value = route.query.email;
  }

  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
});

const setInputRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  inputRefs.value[index] = el instanceof HTMLInputElement ? el : null;
};

const resolveErrorMessage = (err: any, fallback: string) => {
  if (typeof err?.response?.data === "string" && err.response.data.trim()) {
    return err.response.data;
  }
  return err?.response?.data?.message || err?.message || fallback;
};

const handleSubmit = async () => {
  error.value = null;

  if (!isCodeStepConfirmed.value) {
    if (!/^\d{6}$/.test(token.value)) {
      error.value = copy.value.incompleteCode;
      return;
    }

    isCodeStepConfirmed.value = true;
    await nextTick();
    document.getElementById("new-password")?.focus();
    return;
  }

  success.value = null;

  if (newPassword.value !== confirmPassword.value) {
    error.value = copy.value.passwordMismatch;
    return;
  }

  isLoading.value = true;
  try {
    await authStore.resetPassword({
      email: email.value,
      token: token.value,
      newPassword: newPassword.value,
    });
    success.value = copy.value.successMessage;
    setTimeout(() => {
      router.push("/login");
    }, 1800);
  } catch (err: any) {
    error.value = resolveErrorMessage(err, copy.value.invalidCode);
  } finally {
    isLoading.value = false;
  }
};

const unlockCodeStep = async () => {
  isCodeStepConfirmed.value = false;
  newPassword.value = "";
  confirmPassword.value = "";
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  error.value = null;
  success.value = null;
  await nextTick();
  inputRefs.value[0]?.focus();
};

const handleInput = (index: number) => {
  error.value = null;
  const currentInput = inputRefs.value[index];
  const nextInput = inputRefs.value[index + 1];

  if (currentInput?.value.match(/^[0-9]$/) && nextInput) {
    nextInput.focus();
  }
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
  const prevInput = inputRefs.value[index - 1];
  if (event.key === "Backspace" && !code.value[index] && prevInput) {
    prevInput.focus();
  }
};

const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text").trim().slice(0, 6);

  if (pastedData && /^\d{6}$/.test(pastedData)) {
    pastedData.split("").forEach((char, index) => {
      code.value[index] = char;
    });
    await nextTick();
    inputRefs.value[5]?.focus();
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
