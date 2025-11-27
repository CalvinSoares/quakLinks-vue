<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto space-y-8" v-if="user && page">
      <!-- Título -->
      <div>
        <h1 class="text-3xl font-bold text-white">Account Settings</h1>
        <p class="mt-1 text-slate-400">Gerencie suas informações gerais e segurança.</p>
      </div>

      <!-- Seção: General Information -->
      <SettingsSection title="General Information">
        <InfoRow label="Username" :value="user.name" is-editable @click="openUsernameModal" />
        <InfoRow label="Display Name" :value="page.title || 'Não definido'" is-editable @click="openDisplayNameModal" />
        <InfoRow label="Email" :value="user.email" />
      </SettingsSection>

      <CustomDomainCard />

      <!-- Seção: Account Actions -->
      <SettingsSection title="Account Actions" description="Ações de segurança para sua conta.">
        <button @click="openChangeEmailModal"
          class="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors">
          Change Email
        </button>
        <button @click="openChangePasswordModal"
          class="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors">
          Change Password
        </button>
        <button @click="authStore.logout()"
          class="w-full text-left p-3 font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors">
          Logout
        </button>
      </SettingsSection>

    </div>

    <!-- #region MODAIS -->

    <!-- Modal para Username (Reutilizado do Overview) -->
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

    <!-- Modal para Change Email -->
    <Modal :is-open="isChangeEmailModalOpen" @close="closeAllModals" title="Alterar Email">
      <form @submit.prevent="handleUpdateEmail" class="p-6 space-y-4">
        <input v-model="forms.changeEmail.currentPassword" type="password" placeholder="Senha Atual"
          class="w-full input-style" required />
        <input v-model="forms.changeEmail.newEmail" type="email" placeholder="Novo Email" class="w-full input-style"
          required />
        <input v-model="forms.changeEmail.confirmNewEmail" type="email" placeholder="Confirme o Novo Email"
          class="w-full input-style" required />

        <p v-if="forms.changeEmail.error" class="error-text text-sm">{{ forms.changeEmail.error }}</p>
        <p v-if="forms.changeEmail.success" class="success-text text-sm">{{ forms.changeEmail.success }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateEmail" :disabled="forms.changeEmail.isLoading"
          class="w-full btn-primary">
          {{ forms.changeEmail.isLoading ? 'Atualizando...' : 'Atualizar Email' }}
        </button>
      </template>
    </Modal>

    <!-- Modal para Change Password -->
    <Modal :is-open="isChangePasswordModalOpen" @close="closeAllModals" title="Alterar Senha">
      <form @submit.prevent="handleUpdatePassword" class="p-6 space-y-4">
        <input v-model="forms.changePassword.currentPassword" type="password" placeholder="Senha Atual"
          class="w-full input-style" required />
        <input v-model="forms.changePassword.newPassword" type="password" placeholder="Nova Senha"
          class="w-full input-style" required />
        <input v-model="forms.changePassword.confirmNewPassword" type="password" placeholder="Confirme a Nova Senha"
          class="w-full input-style" required />

        <p v-if="forms.changePassword.error" class="error-text text-sm">{{ forms.changePassword.error }}</p>
        <p v-if="forms.changePassword.success" class="success-text text-sm">{{ forms.changePassword.success }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdatePassword" :disabled="forms.changePassword.isLoading"
          class="w-full btn-primary">
          {{ forms.changePassword.isLoading ? 'Atualizando...' : 'Atualizar Senha' }}
        </button>
      </template>
    </Modal>

    <!-- #endregion -->
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import SettingsSection from './SettingsSection.vue';
import InfoRow from '@/components/dashboard/InfoRow.vue';
import Modal from '@/components/dashboard/Modal.vue';
import CustomDomainCard from '@/components/dashboard/CustomDomainCard.vue';

const authStore = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const page = computed(() => pageStore.currentPage);

// State dos modais
const isUsernameModalOpen = ref(false);
const isDisplayNameModalOpen = ref(false);
const isChangeEmailModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);

// State reativo para todos os formulários
const forms = reactive({
  username: { name: '', isLoading: false, error: null as string | null },
  displayName: { title: '', isLoading: false, error: null as string | null },
  changeEmail: { currentPassword: '', newEmail: '', confirmNewEmail: '', isLoading: false, error: null as string | null, success: null as string | null },
  changePassword: { currentPassword: '', newPassword: '', confirmNewPassword: '', isLoading: false, error: null as string | null, success: null as string | null },
});

// Funções para abrir modais e preencher dados
const openUsernameModal = () => { forms.username.name = user.value?.name || ''; isUsernameModalOpen.value = true; };
const openDisplayNameModal = () => { forms.displayName.title = page.value?.title || ''; isDisplayNameModalOpen.value = true; };
const openChangeEmailModal = () => isChangeEmailModalOpen.value = true;
const openChangePasswordModal = () => isChangePasswordModalOpen.value = true;

const closeAllModals = () => {
  isUsernameModalOpen.value = false;
  isDisplayNameModalOpen.value = false;
  isChangeEmailModalOpen.value = false;
  isChangePasswordModalOpen.value = false;
  // Resetar todos os formulários ao fechar
  Object.values(forms).forEach(form => {
    Object.keys(form).forEach(key => {
      if (key !== 'isLoading') (form as any)[key] = (typeof (form as any)[key] === 'string') ? '' : null;
    });
  });
};

// Handlers de Submissão
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
  forms.changeEmail.isLoading = true; forms.changeEmail.error = null; forms.changeEmail.success = null;
  try {
    const response = await userStore.updateEmail(forms.changeEmail);
    forms.changeEmail.success = response.message + ' Você será deslogado.';
    setTimeout(() => authStore.logout(), 3000);
  } catch (e: any) { forms.changeEmail.error = e.message; }
  finally { forms.changeEmail.isLoading = false; }
};

const handleUpdatePassword = async () => {
  forms.changePassword.isLoading = true; forms.changePassword.error = null; forms.changePassword.success = null;
  try {
    const response = await userStore.updatePassword(forms.changePassword);
    forms.changePassword.success = response.message + ' Você será deslogado.';
    setTimeout(() => authStore.logout(), 3000);
  } catch (e: any) { forms.changePassword.error = e.message; }
  finally { forms.changePassword.isLoading = false; }
};
</script>

<style scoped>
/* Estilos globais para consistência nos modais */
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