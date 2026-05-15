<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto space-y-8" v-if="user && page">
      <div>
        <h1 class="text-3xl font-bold text-white">Account Settings</h1>
        <p class="mt-1 text-slate-400">Gerencie suas informações gerais e segurança.</p>
      </div>

      <SettingsSection title="General Information">
        <InfoRow label="Username" :value="user.name" is-editable @click="openUsernameModal" />
        <InfoRow label="Display Name" :value="page.title || 'Não definido'" is-editable @click="openDisplayNameModal" />
        <InfoRow label="Email" :value="user.email" />
      </SettingsSection>

      <CustomDomainCard />

      <SettingsSection title="Account Actions" description="Ações de segurança e acesso da sua conta.">
        <button @click="openEmailModal"
          class="w-full text-left p-3 font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
          Alterar e-mail
        </button>
        <button @click="openPasswordModal"
          class="w-full text-left p-3 font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
          Alterar senha
        </button>
        <div class="p-4 bg-slate-800/30 border border-slate-700 rounded-lg space-y-3">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-semibold text-white">Sessões ativas</h3>
              <p class="text-xs text-slate-400">Visualize suas sessões e encerre todas de uma vez.</p>
            </div>
            <button @click="loadSessions" :disabled="isLoadingSessions"
              class="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-60">
              {{ isLoadingSessions ? 'Atualizando...' : 'Atualizar' }}
            </button>
          </div>

          <div v-if="sessionsError" class="text-sm text-red-400">{{ sessionsError }}</div>

          <div v-if="authStore.sessions.length" class="space-y-2">
            <div v-for="session in authStore.sessions" :key="session.id"
              class="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-white">
                  {{ session.active ? 'Sessão ativa' : 'Sessão encerrada' }}
                </p>
                <p class="text-xs text-slate-400">
                  Criada em {{ formatDate(session.createdAt) }} e expira em {{ formatDate(session.expiresAt) }}
                </p>
              </div>
              <span :class="session.active ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-700/60'"
                class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
                {{ session.active ? 'ATIVA' : 'REVOGADA' }}
              </span>
            </div>
          </div>

          <p v-else-if="!isLoadingSessions" class="text-sm text-slate-400">
            Nenhuma sessão retornada pela API.
          </p>

          <button @click="handleLogoutAllSessions" :disabled="isLoggingOutAll || isLoadingSessions"
            class="w-full text-left p-3 font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors disabled:opacity-60">
            {{ isLoggingOutAll ? 'Encerrando sessões...' : 'Encerrar todas as sessões' }}
          </button>
        </div>
        <button @click="authStore.logout()"
          class="w-full text-left p-3 font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors">
          Logout
        </button>
      </SettingsSection>

    </div>

    <Modal :is-open="isUsernameModalOpen" @close="closeAllModals" title="Alterar Nome de Usuário">
      <form @submit.prevent="handleUpdateUsername" class="p-6 space-y-4">
        <input v-model="forms.username.name" class="w-full input-style" placeholder="Novo nome de usuário" />
        <p v-if="forms.username.error" class="error-text text-sm">{{ forms.username.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateUsername" :disabled="forms.username.isLoading"
          class="w-full btn-primary">
          {{ forms.username.isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isDisplayNameModalOpen" @close="closeAllModals" title="Alterar Nome de Exibição">
      <form @submit.prevent="handleUpdateDisplayName" class="p-6 space-y-4">
        <input v-model="forms.displayName.title" class="w-full input-style" placeholder="Novo nome de exibição" />
        <p v-if="forms.displayName.error" class="error-text text-sm">{{ forms.displayName.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateDisplayName" :disabled="forms.displayName.isLoading"
          class="w-full btn-primary">
          {{ forms.displayName.isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isEmailModalOpen" @close="closeAllModals" title="Alterar E-mail">
      <form @submit.prevent="handleUpdateEmail" class="p-6 space-y-4">
        <input v-model="forms.changeEmail.currentPassword" type="password" class="w-full input-style"
          placeholder="Senha atual" />
        <input v-model="forms.changeEmail.newEmail" type="email" class="w-full input-style" placeholder="Novo e-mail" />
        <input v-model="forms.changeEmail.confirmNewEmail" type="email" class="w-full input-style"
          placeholder="Confirmar novo e-mail" />
        <p class="text-xs text-slate-400">
          Ao concluir, suas sessoes serao encerradas e voce precisara entrar novamente.
        </p>
        <p v-if="forms.changeEmail.error" class="error-text text-sm">{{ forms.changeEmail.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateEmail" :disabled="forms.changeEmail.isLoading"
          class="w-full btn-primary">
          {{ forms.changeEmail.isLoading ? 'Salvando...' : 'Salvar novo e-mail' }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isPasswordModalOpen" @close="closeAllModals" title="Alterar Senha">
      <form @submit.prevent="handleUpdatePassword" class="p-6 space-y-4">
        <input v-model="forms.changePassword.currentPassword" type="password" class="w-full input-style"
          placeholder="Senha atual" />
        <input v-model="forms.changePassword.newPassword" type="password" class="w-full input-style"
          placeholder="Nova senha" />
        <input v-model="forms.changePassword.confirmNewPassword" type="password" class="w-full input-style"
          placeholder="Confirmar nova senha" />
        <p class="text-xs text-slate-400">
          Ao concluir, suas sessoes serao encerradas e voce precisara entrar novamente.
        </p>
        <p v-if="forms.changePassword.error" class="error-text text-sm">{{ forms.changePassword.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdatePassword" :disabled="forms.changePassword.isLoading"
          class="w-full btn-primary">
          {{ forms.changePassword.isLoading ? 'Salvando...' : 'Salvar nova senha' }}
        </button>
      </template>
    </Modal>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import SettingsSection from './SettingsSection.vue';
import InfoRow from '@/components/dashboard/InfoRow.vue';
import Modal from '@/components/dashboard/Modal.vue';
import CustomDomainCard from '@/components/dashboard/CustomDomainCard.vue';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const page = computed(() => pageStore.currentPage);
const isLoadingSessions = computed(() => authStore.isLoadingSessions);

const isUsernameModalOpen = ref(false);
const isDisplayNameModalOpen = ref(false);
const isEmailModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isLoggingOutAll = ref(false);
const sessionsError = ref<string | null>(null);

const forms = reactive({
  username: { name: '', isLoading: false, error: null as string | null },
  displayName: { title: '', isLoading: false, error: null as string | null },
  changeEmail: {
    currentPassword: '',
    newEmail: '',
    confirmNewEmail: '',
    isLoading: false,
    error: null as string | null,
  },
  changePassword: {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    isLoading: false,
    error: null as string | null,
  },
});

const openUsernameModal = () => { forms.username.name = user.value?.name || ''; isUsernameModalOpen.value = true; };
const openDisplayNameModal = () => { forms.displayName.title = page.value?.title || ''; isDisplayNameModalOpen.value = true; };
const openEmailModal = () => { isEmailModalOpen.value = true; };
const openPasswordModal = () => { isPasswordModalOpen.value = true; };

onMounted(() => {
  void loadSessions();
});

const closeAllModals = () => {
  isUsernameModalOpen.value = false;
  isDisplayNameModalOpen.value = false;
  isEmailModalOpen.value = false;
  isPasswordModalOpen.value = false;
  Object.values(forms).forEach(form => {
    Object.keys(form).forEach(key => {
      if (key !== 'isLoading') (form as any)[key] = (typeof (form as any)[key] === 'string') ? '' : null;
    });
  });
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR');
}

async function loadSessions() {
  sessionsError.value = null;
  try {
    await authStore.fetchSessions();
  } catch (e: any) {
    sessionsError.value = e.message;
  }
}

const handleUpdateUsername = async () => {
  forms.username.isLoading = true; forms.username.error = null;
  try {
    await userStore.updateUserProfile({ name: forms.username.name });
    closeAllModals();
  } catch (e: any) { forms.username.error = e.message; }
  finally { forms.username.isLoading = false; }
};

const handleUpdateDisplayName = async () => {
  forms.displayName.isLoading = true; forms.displayName.error = null;
  try {
    await pageStore.updateMyPage({ title: forms.displayName.title });
    closeAllModals();
  } catch (e: any) { forms.displayName.error = e.message; }
  finally { forms.displayName.isLoading = false; }
};

const handleUpdateEmail = async () => {
  forms.changeEmail.isLoading = true; forms.changeEmail.error = null;
  try {
    await userStore.updateEmail(forms.changeEmail);
    toast.success('E-mail alterado com sucesso. Entre novamente para continuar.');
    await authStore.logout();
  } catch (e: any) { forms.changeEmail.error = e.message; }
  finally { forms.changeEmail.isLoading = false; }
};

const handleUpdatePassword = async () => {
  forms.changePassword.isLoading = true; forms.changePassword.error = null;
  try {
    await userStore.updatePassword(forms.changePassword);
    toast.success('Senha alterada com sucesso. Entre novamente para continuar.');
    await authStore.logout();
  } catch (e: any) { forms.changePassword.error = e.message; }
  finally { forms.changePassword.isLoading = false; }
};

const handleLogoutAllSessions = async () => {
  sessionsError.value = null;
  isLoggingOutAll.value = true;
  try {
    await authStore.logoutAllSessions();
  } catch (e: any) {
    sessionsError.value = e.message;
  } finally {
    isLoggingOutAll.value = false;
  }
};
</script>

<style scoped>
.input-style {
  @apply w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500;
}

.btn-primary {
  @apply w-full px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed;
}

.error-text {
  @apply text-sm text-red-400 text-center;
}

.success-text {
  @apply text-sm text-green-400 text-center;
}
</style>
