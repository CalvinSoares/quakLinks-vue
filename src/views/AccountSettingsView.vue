<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto space-y-8" v-if="user && page">
      <div>
        <h1 class="text-3xl font-bold text-white">{{ copy.pageTitle }}</h1>
        <p class="mt-1 text-slate-400">{{ copy.pageDescription }}</p>
      </div>

      <SettingsSection :title="copy.sections.general">
        <InfoRow :label="copy.labels.username" :value="user.name" is-editable @click="openUsernameModal" />
        <InfoRow :label="copy.labels.displayName" :value="page.title || copy.labels.notDefined" is-editable
          @click="openDisplayNameModal" />
        <InfoRow :label="copy.labels.email" :value="user.email" />
      </SettingsSection>

      <CustomDomainCard />

      <SettingsSection :title="copy.sections.plans" :description="copy.sections.plansDescription">
        <div class="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-sm font-semibold text-white">{{ copy.plan.currentPlan }}</h3>
              <p class="mt-1 text-sm text-slate-400">
                {{ authStore.isPremium
                  ? copy.plan.premiumDescription
                  : copy.plan.freeDescription }}
              </p>
            </div>
            <span :class="authStore.isPremium ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'"
              class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {{ authStore.isPremium ? copy.plan.premiumBadge : copy.plan.freeBadge }}
            </span>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <router-link to="/dashboard/plans" class="ui-btn-secondary w-full">
              {{ copy.plan.viewPlans }}
            </router-link>
            <button v-if="!authStore.isPremium" type="button" @click="handleUpgrade" class="ui-btn-primary w-full">
              {{ copy.plan.upgrade }}
            </button>
            <router-link v-else to="/dashboard/overview"
              class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20">
              {{ copy.plan.viewOverview }}
            </router-link>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection :title="copy.sections.actions" :description="copy.sections.actionsDescription">
        <button @click="openEmailModal" class="ui-btn-secondary w-full justify-start">
          {{ copy.actions.changeEmail }}
        </button>
        <button @click="openPasswordModal" class="ui-btn-secondary w-full justify-start">
          {{ copy.actions.changePassword }}
        </button>
        <div class="p-4 bg-slate-800/30 border border-slate-700 rounded-lg space-y-3">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-semibold text-white">{{ copy.sessions.title }}</h3>
              <p class="text-xs text-slate-400">{{ copy.sessions.description }}</p>
            </div>
            <button @click="loadSessions" :disabled="isLoadingSessions" class="ui-btn-secondary text-xs">
              {{ isLoadingSessions ? copy.sessions.updating : copy.sessions.refresh }}
            </button>
          </div>

          <div v-if="sessionsError" class="text-sm text-red-400">{{ sessionsError }}</div>

          <div v-if="authStore.sessions.length" class="max-h-80 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
            <div v-for="session in authStore.sessions" :key="session.id"
              class="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-white">
                  {{
                    session.id === latestActiveSessionId
                      ? copy.sessions.current
                      : session.active
                        ? copy.sessions.active
                        : copy.sessions.revoked
                  }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ copy.sessions.createdAt }} {{ formatDate(session.createdAt) }} {{ copy.sessions.expiresAt }}
                  {{ formatDate(session.expiresAt) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span :class="session.id === latestActiveSessionId
                  ? 'text-sky-300 bg-sky-500/10'
                  : session.active
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-400 bg-slate-700/60'"
                  class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
                  {{
                    session.id === latestActiveSessionId
                      ? copy.sessions.currentBadge
                      : session.active
                        ? copy.sessions.activeBadge
                        : copy.sessions.revokedBadge
                  }}
                </span>
                <button v-if="canRevokeSession(session)" type="button"
                  class="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/20"
                  @click="openRevokeSessionModal(session.id)">
                  {{ copy.sessions.revokeOld }}
                </button>
                <button v-if="canDeleteSession(session)" type="button"
                  class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                  @click="openDeleteSessionModal(session.id)">
                  {{ copy.sessions.deleteRevoked }}
                </button>
              </div>
            </div>
          </div>

          <p v-else-if="!isLoadingSessions" class="text-sm text-slate-400">
            {{ copy.sessions.empty }}
          </p>

          <button @click="handleLogoutAllSessions" :disabled="isLoggingOutAll || isLoadingSessions"
            class="ui-btn-secondary w-full justify-start border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20">
            {{ isLoggingOutAll ? copy.sessions.loggingOutAll : copy.sessions.logoutAll }}
          </button>
        </div>
        <button @click="authStore.logout()" class="ui-btn-danger w-full justify-start">
          {{ copy.actions.logout }}
        </button>
      </SettingsSection>

    </div>

    <Modal :is-open="isUsernameModalOpen" @close="closeAllModals" :title="copy.modals.usernameTitle">
      <form @submit.prevent="handleUpdateUsername" class="p-6 space-y-4">
        <input v-model="forms.username.name" class="ui-input" :placeholder="copy.modals.usernamePlaceholder" />
        <div class="flex items-center justify-between gap-3 text-xs">
          <p class="text-slate-500 truncate">
            {{ copy.modals.usernamePreviewPrefix }} <span class="font-semibold text-slate-300">/{{ forms.username.name
              || '...' }}</span>
          </p>
          <p v-if="usernameStatus === 'checking'" class="text-slate-400">{{ copy.modals.usernameChecking }}</p>
          <p v-else-if="usernameStatus === 'available'" class="text-emerald-400">{{ copy.modals.usernameAvailable }}</p>
          <p v-else-if="usernameStatus === 'taken'" class="text-red-400">{{ copy.modals.usernameInUse }}</p>
          <p v-else-if="usernameStatus === 'invalid'" class="text-red-400">{{ usernameValidationError }}</p>
        </div>
        <p v-if="forms.username.error" class="error-text text-sm">{{ forms.username.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateUsername"
          :disabled="forms.username.isLoading || usernameStatus === 'checking'" class="ui-btn-primary w-full">
          {{ forms.username.isLoading ? copy.modals.saving : copy.modals.saveChanges }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isDisplayNameModalOpen" @close="closeAllModals" :title="copy.modals.displayNameTitle">
      <form @submit.prevent="handleUpdateDisplayName" class="p-6 space-y-4">
        <input v-model="forms.displayName.title" class="ui-input" :placeholder="copy.modals.displayNamePlaceholder" />
        <p v-if="forms.displayName.error" class="error-text text-sm">{{ forms.displayName.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="handleUpdateDisplayName" :disabled="forms.displayName.isLoading"
          class="ui-btn-primary w-full">
          {{ forms.displayName.isLoading ? copy.modals.saving : copy.modals.saveChanges }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isEmailModalOpen" @close="closeAllModals" :title="copy.modals.emailTitle">
      <form @submit.prevent="handleUpdateEmail" class="space-y-5 p-6">
        <div class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p class="text-sm font-semibold text-amber-200">{{ copy.modals.securityCheckTitle }}</p>
          <p class="mt-1 text-xs text-slate-300">{{ copy.modals.emailSecurityDescription }}</p>
        </div>
        <div class="space-y-3">
          <input v-model="forms.changeEmail.currentPassword" type="password" class="ui-input"
            :placeholder="copy.modals.currentPassword" />
          <input v-model="forms.changeEmail.newEmail" type="email" class="ui-input"
            :placeholder="copy.modals.newEmail" />
          <input v-model="forms.changeEmail.confirmNewEmail" type="email" class="ui-input"
            :placeholder="copy.modals.confirmNewEmail" />
        </div>
        <label
          class="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
          <input v-model="forms.changeEmail.confirmAction" type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/30" />
          <span>{{ copy.modals.confirmSensitiveAction }}</span>
        </label>
        <p class="text-xs text-slate-400">
          {{ copy.modals.reloginHint }}
        </p>
        <p v-if="forms.changeEmail.error" class="error-text text-sm">{{ forms.changeEmail.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="openEmailConfirmationModal"
          :disabled="forms.changeEmail.isLoading || !forms.changeEmail.confirmAction" class="ui-btn-primary w-full">
          {{ forms.changeEmail.isLoading ? copy.modals.saving : copy.modals.reviewEmail }}
        </button>
      </template>
    </Modal>

    <Modal :is-open="isPasswordModalOpen" @close="closeAllModals" :title="copy.modals.passwordTitle">
      <form @submit.prevent="handleUpdatePassword" class="space-y-5 p-6">
        <div class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p class="text-sm font-semibold text-amber-200">{{ copy.modals.securityCheckTitle }}</p>
          <p class="mt-1 text-xs text-slate-300">{{ copy.modals.passwordSecurityDescription }}</p>
        </div>
        <div class="space-y-3">
          <input v-model="forms.changePassword.currentPassword" type="password" class="ui-input"
            :placeholder="copy.modals.currentPassword" />
          <input v-model="forms.changePassword.newPassword" type="password" class="ui-input"
            :placeholder="copy.modals.newPassword" />
          <input v-model="forms.changePassword.confirmNewPassword" type="password" class="ui-input"
            :placeholder="copy.modals.confirmNewPassword" />
        </div>
        <label
          class="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
          <input v-model="forms.changePassword.confirmAction" type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/30" />
          <span>{{ copy.modals.confirmSensitiveAction }}</span>
        </label>
        <p class="text-xs text-slate-400">
          {{ copy.modals.reloginHint }}
        </p>
        <p v-if="forms.changePassword.error" class="error-text text-sm">{{ forms.changePassword.error }}</p>
      </form>

      <template #footer>
        <button type="button" @click="openPasswordConfirmationModal"
          :disabled="forms.changePassword.isLoading || !forms.changePassword.confirmAction"
          class="ui-btn-primary w-full">
          {{ forms.changePassword.isLoading ? copy.modals.saving : copy.modals.reviewPassword }}
        </button>
      </template>
    </Modal>

    <ConfirmationModal :is-open="isEmailConfirmationModalOpen" :title="copy.modals.emailConfirmTitle"
      :description="copy.modals.emailConfirmDescription(forms.changeEmail.newEmail)" :cancel-label="copy.modals.back"
      :confirm-label="copy.modals.saveEmail" :loading-label="copy.modals.saving"
      :is-loading="forms.changeEmail.isLoading" variant="primary" @close="closeEmailConfirmationModal"
      @confirm="handleUpdateEmail" />

    <ConfirmationModal :is-open="isPasswordConfirmationModalOpen" :title="copy.modals.passwordConfirmTitle"
      :description="copy.modals.passwordConfirmDescription" :cancel-label="copy.modals.back"
      :confirm-label="copy.modals.savePassword" :loading-label="copy.modals.saving"
      :is-loading="forms.changePassword.isLoading" variant="primary" @close="closePasswordConfirmationModal"
      @confirm="handleUpdatePassword" />

    <ConfirmationModal :is-open="isLogoutAllSessionsModalOpen" :title="copy.sessions.logoutAllTitle"
      :description="copy.sessions.logoutAllDescription" :cancel-label="copy.modals.cancel"
      :confirm-label="copy.sessions.logoutAll" :loading-label="copy.sessions.loggingOutAll"
      :is-loading="isLoggingOutAll" @close="closeLogoutAllSessionsModal" @confirm="confirmLogoutAllSessions" />

    <ConfirmationModal :is-open="isRevokeSessionModalOpen" :title="copy.sessions.revokeOldTitle"
      :description="copy.sessions.revokeOldDescription" :cancel-label="copy.modals.cancel"
      :confirm-label="copy.sessions.revokeOld" :loading-label="copy.sessions.revokingOld"
      :is-loading="isRevokingSession" @close="closeRevokeSessionModal" @confirm="confirmRevokeSession" />

    <ConfirmationModal :is-open="isDeleteSessionModalOpen" :title="copy.sessions.deleteRevokedTitle"
      :description="copy.sessions.deleteRevokedDescription" :cancel-label="copy.modals.cancel"
      :confirm-label="copy.sessions.deleteRevoked" :loading-label="copy.sessions.deletingRevoked"
      :is-loading="isDeletingSession" @close="closeDeleteSessionModal" @confirm="confirmDeleteSession" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import SettingsSection from './SettingsSection.vue';
import InfoRow from '@/components/dashboard/InfoRow.vue';
import Modal from '@/components/dashboard/Modal.vue';
import CustomDomainCard from '@/components/dashboard/CustomDomainCard.vue';
import { toast } from 'vue-sonner';
import { useAppLanguage } from '@/composables/useAppLanguage';
import {
  isPublicHandleAvailable,
  normalizePublicHandle,
  validatePublicHandle,
} from '@/utils/publicHandle';

const authStore = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();
const { locale } = useAppLanguage();

const user = computed(() => authStore.user);
const page = computed(() => pageStore.currentPage);
const isLoadingSessions = computed(() => authStore.isLoadingSessions);

const isUsernameModalOpen = ref(false);
const isDisplayNameModalOpen = ref(false);
const isEmailModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isEmailConfirmationModalOpen = ref(false);
const isPasswordConfirmationModalOpen = ref(false);
const isLogoutAllSessionsModalOpen = ref(false);
const isRevokeSessionModalOpen = ref(false);
const isDeleteSessionModalOpen = ref(false);
const isLoggingOutAll = ref(false);
const isRevokingSession = ref(false);
const isDeletingSession = ref(false);
const sessionsError = ref<string | null>(null);
const sessionIdPendingDeletion = ref<string | null>(null);
const sessionIdPendingHardDeletion = ref<string | null>(null);
const latestActiveSessionId = computed(() =>
  authStore.sessions.find((session) => session.active)?.id ?? null,
);

const translations = {
  pt: {
    pageTitle: 'Configurações da conta',
    pageDescription: 'Gerencie suas informações gerais e segurança.',
    sections: {
      general: 'Informações gerais',
      plans: 'Planos e assinatura',
      plansDescription: 'Veja o que o plano atual oferece e inicie o upgrade sem sair da sua conta.',
      actions: 'Ações da conta',
      actionsDescription: 'Ações de segurança e acesso da sua conta.',
    },
    labels: {
      username: 'Usuário',
      displayName: 'Nome de exibição',
      email: 'Email',
      notDefined: 'Não definido',
    },
    plan: {
      currentPlan: 'Plano atual',
      premiumDescription: 'Sua conta já está com acesso PREMIUM liberado.',
      freeDescription: 'Você está no plano FREE. Faça upgrade para liberar vídeo, áudio, cursor, domínio e outros extras.',
      premiumBadge: 'PREMIUM',
      freeBadge: 'FREE',
      viewPlans: 'Ver planos',
      upgrade: 'Fazer upgrade',
      viewOverview: 'Ver visão geral',
    },
    actions: {
      changeEmail: 'Alterar e-mail',
      changePassword: 'Alterar senha',
      logout: 'Logout',
    },
    sessions: {
      title: 'Sessões ativas',
      description: 'Visualize suas sessões e encerre todas de uma vez.',
      refresh: 'Atualizar',
      updating: 'Atualizando...',
      active: 'Sessão ativa',
      revoked: 'Sessão encerrada',
      createdAt: 'Criada em',
      expiresAt: 'e expira em',
      activeBadge: 'ATIVA',
      revokedBadge: 'REVOGADA',
      empty: 'Nenhuma sessão retornada pela API.',
      loggingOutAll: 'Encerrando sessões...',
      logoutAll: 'Encerrar todas as sessões',
      current: 'Sessão atual',
      currentBadge: 'ATUAL',
      revokeOld: 'Encerrar sessão',
      revokingOld: 'Encerrando sessão...',
      revokeOldTitle: 'Encerrar sessão',
      revokeOldDescription: 'Essa sessão será encerrada e perderá acesso à conta.',
      deleteRevoked: 'Excluir',
      deletingRevoked: 'Excluindo...',
      deleteRevokedTitle: 'Excluir sessão revogada',
      deleteRevokedDescription: 'Essa sessão revogada será removida do histórico da conta.',
      logoutAllTitle: 'Encerrar todas as sessões',
      logoutAllDescription: 'Todas as sessões da conta serão encerradas e será necessário entrar novamente.',
    },
    modals: {
      usernameTitle: 'Alterar nome de usuário',
      usernamePlaceholder: 'Novo nome de usuário',
      usernamePreviewPrefix: 'Seu link:',
      usernameChecking: 'Verificando...',
      usernameAvailable: 'Disponível',
      usernameInUse: 'Este nome de usuário já está em uso.',
      usernameInvalid: 'Escolha um nome de usuário válido.',
      usernameRequired: 'Informe um nome de usuário.',
      usernameTooShort: 'Use pelo menos 3 caracteres.',
      usernameReserved: 'Este nome de usuário não está disponível.',
      displayNameTitle: 'Alterar nome de exibição',
      displayNamePlaceholder: 'Novo nome de exibição',
      emailTitle: 'Alterar e-mail',
      passwordTitle: 'Alterar senha',
      currentPassword: 'Senha atual',
      newEmail: 'Novo e-mail',
      confirmNewEmail: 'Confirmar novo e-mail',
      newPassword: 'Nova senha',
      confirmNewPassword: 'Confirmar nova senha',
      reloginHint: 'Ao concluir, suas sessões serão encerradas e você precisará entrar novamente.',
      securityCheckTitle: 'Verificação de segurança',
      emailSecurityDescription: 'Confirme sua senha atual e revise o novo e-mail antes de salvar.',
      passwordSecurityDescription: 'Confirme sua senha atual e revise a nova senha antes de salvar.',
      confirmSensitiveAction: 'Entendo que esta é uma ação sensível e quero continuar.',
      saving: 'Salvando...',
      saveChanges: 'Salvar alterações',
      reviewEmail: 'Revisar alteração de e-mail',
      reviewPassword: 'Revisar alteração de senha',
      saveEmail: 'Salvar novo e-mail',
      savePassword: 'Salvar nova senha',
      emailConfirmTitle: 'Confirmar alteração de e-mail',
      emailConfirmDescription: (email: string) => `Seu acesso passará a usar "${email}". Você precisará entrar novamente depois de salvar.`,
      passwordConfirmTitle: 'Confirmar alteração de senha',
      passwordConfirmDescription: 'Sua senha será alterada e todas as sessões atuais serão encerradas.',
      cancel: 'Cancelar',
      back: 'Voltar',
    },
    toasts: {
      emailUpdated: 'E-mail alterado com sucesso. Entre novamente para continuar.',
      passwordUpdated: 'Senha alterada com sucesso. Entre novamente para continuar.',
      checkoutError: 'Não foi possível iniciar o pagamento.',
    },
  },
  en: {
    pageTitle: 'Account settings',
    pageDescription: 'Manage your general information and security.',
    sections: {
      general: 'General information',
      plans: 'Plans and subscription',
      plansDescription: 'See what your current plan includes and start an upgrade without leaving your account.',
      actions: 'Account actions',
      actionsDescription: 'Security and access actions for your account.',
    },
    labels: {
      username: 'Username',
      displayName: 'Display name',
      email: 'Email',
      notDefined: 'Not set',
    },
    plan: {
      currentPlan: 'Current plan',
      premiumDescription: 'Your account already has PREMIUM access enabled.',
      freeDescription: 'You are on the FREE plan. Upgrade to unlock video, audio, cursor, domain, and more extras.',
      premiumBadge: 'PREMIUM',
      freeBadge: 'FREE',
      viewPlans: 'View plans',
      upgrade: 'Upgrade',
      viewOverview: 'View overview',
    },
    actions: {
      changeEmail: 'Change email',
      changePassword: 'Change password',
      logout: 'Logout',
    },
    sessions: {
      title: 'Active sessions',
      description: 'Review your sessions and close them all at once.',
      refresh: 'Refresh',
      updating: 'Refreshing...',
      active: 'Active session',
      revoked: 'Closed session',
      createdAt: 'Created at',
      expiresAt: 'and expires at',
      activeBadge: 'ACTIVE',
      revokedBadge: 'REVOKED',
      empty: 'No sessions returned by the API.',
      loggingOutAll: 'Closing sessions...',
      logoutAll: 'Close all sessions',
      current: 'Current session',
      currentBadge: 'CURRENT',
      revokeOld: 'Revoke session',
      revokingOld: 'Revoking session...',
      revokeOldTitle: 'Revoke session',
      revokeOldDescription: 'This session will be revoked and lose access to the account.',
      deleteRevoked: 'Delete',
      deletingRevoked: 'Deleting...',
      deleteRevokedTitle: 'Delete revoked session',
      deleteRevokedDescription: 'This revoked session will be removed from the account history.',
      logoutAllTitle: 'Close all sessions',
      logoutAllDescription: 'All account sessions will be closed and you will need to sign in again.',
    },
    modals: {
      usernameTitle: 'Change username',
      usernamePlaceholder: 'New username',
      usernamePreviewPrefix: 'Your link:',
      usernameChecking: 'Checking...',
      usernameAvailable: 'Available',
      usernameInUse: 'This username is already taken.',
      usernameInvalid: 'Choose a valid username.',
      usernameRequired: 'Enter a username.',
      usernameTooShort: 'Use at least 3 characters.',
      usernameReserved: 'This username is not available.',
      displayNameTitle: 'Change display name',
      displayNamePlaceholder: 'New display name',
      emailTitle: 'Change email',
      passwordTitle: 'Change password',
      currentPassword: 'Current password',
      newEmail: 'New email',
      confirmNewEmail: 'Confirm new email',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
      reloginHint: 'When finished, your sessions will be closed and you will need to sign in again.',
      securityCheckTitle: 'Security check',
      emailSecurityDescription: 'Confirm your current password and review the new email before saving.',
      passwordSecurityDescription: 'Confirm your current password and review the new password before saving.',
      confirmSensitiveAction: 'I understand this is a sensitive action and want to continue.',
      saving: 'Saving...',
      saveChanges: 'Save changes',
      reviewEmail: 'Review email change',
      reviewPassword: 'Review password change',
      saveEmail: 'Save new email',
      savePassword: 'Save new password',
      emailConfirmTitle: 'Confirm email change',
      emailConfirmDescription: (email: string) => `Your account access will start using "${email}". You will need to sign in again after saving.`,
      passwordConfirmTitle: 'Confirm password change',
      passwordConfirmDescription: 'Your password will be changed and all current sessions will be closed.',
      cancel: 'Cancel',
      back: 'Back',
    },
    toasts: {
      emailUpdated: 'Email changed successfully. Sign in again to continue.',
      passwordUpdated: 'Password changed successfully. Sign in again to continue.',
      checkoutError: 'Could not start payment.',
    },
  },
  es: {
    pageTitle: 'Configuración de la cuenta',
    pageDescription: 'Administra tu información general y seguridad.',
    sections: {
      general: 'Información general',
      plans: 'Planes y suscripción',
      plansDescription: 'Mira lo que ofrece tu plan actual e inicia el upgrade sin salir de tu cuenta.',
      actions: 'Acciones de la cuenta',
      actionsDescription: 'Acciones de seguridad y acceso de tu cuenta.',
    },
    labels: {
      username: 'Usuario',
      displayName: 'Nombre de visualización',
      email: 'Email',
      notDefined: 'No definido',
    },
    plan: {
      currentPlan: 'Plan actual',
      premiumDescription: 'Tu cuenta ya tiene acceso PREMIUM habilitado.',
      freeDescription: 'Estás en el plan FREE. Haz upgrade para desbloquear video, audio, cursor, dominio y otros extras.',
      premiumBadge: 'PREMIUM',
      freeBadge: 'FREE',
      viewPlans: 'Ver planes',
      upgrade: 'Hacer upgrade',
      viewOverview: 'Ver resumen',
    },
    actions: {
      changeEmail: 'Cambiar email',
      changePassword: 'Cambiar contraseña',
      logout: 'Logout',
    },
    sessions: {
      title: 'Sesiones activas',
      description: 'Revisa tus sesiones y ciérralas todas de una vez.',
      refresh: 'Actualizar',
      updating: 'Actualizando...',
      active: 'Sesión activa',
      revoked: 'Sesión cerrada',
      createdAt: 'Creada en',
      expiresAt: 'y expira en',
      activeBadge: 'ACTIVA',
      revokedBadge: 'REVOCADA',
      empty: 'Ninguna sesión fue devuelta por la API.',
      loggingOutAll: 'Cerrando sesiones...',
      logoutAll: 'Cerrar todas las sesiones',
      current: 'Sesión actual',
      currentBadge: 'ACTUAL',
      revokeOld: 'Cerrar sesión',
      revokingOld: 'Cerrando sesión...',
      revokeOldTitle: 'Cerrar sesión',
      revokeOldDescription: 'Esta sesión será revocada y perderá acceso a la cuenta.',
      deleteRevoked: 'Eliminar',
      deletingRevoked: 'Eliminando...',
      deleteRevokedTitle: 'Eliminar sesión revocada',
      deleteRevokedDescription: 'Esta sesión revocada será eliminada del historial de la cuenta.',
      logoutAllTitle: 'Cerrar todas las sesiones',
      logoutAllDescription: 'Todas las sesiones de la cuenta se cerrarán y tendrás que iniciar sesión nuevamente.',
    },
    modals: {
      usernameTitle: 'Cambiar nombre de usuario',
      usernamePlaceholder: 'Nuevo nombre de usuario',
      usernamePreviewPrefix: 'Tu link:',
      usernameChecking: 'Verificando...',
      usernameAvailable: 'Disponible',
      usernameInUse: 'Este nombre de usuario ya está en uso.',
      usernameInvalid: 'Elige un nombre de usuario válido.',
      usernameRequired: 'Ingresa un nombre de usuario.',
      usernameTooShort: 'Usa al menos 3 caracteres.',
      usernameReserved: 'Este nombre de usuario no está disponible.',
      displayNameTitle: 'Cambiar nombre de visualización',
      displayNamePlaceholder: 'Nuevo nombre de visualización',
      emailTitle: 'Cambiar email',
      passwordTitle: 'Cambiar contraseña',
      currentPassword: 'Contraseña actual',
      newEmail: 'Nuevo email',
      confirmNewEmail: 'Confirmar nuevo email',
      newPassword: 'Nueva contraseña',
      confirmNewPassword: 'Confirmar nueva contraseña',
      reloginHint: 'Al finalizar, tus sesiones se cerrarán y tendrás que iniciar sesión nuevamente.',
      securityCheckTitle: 'Verificación de seguridad',
      emailSecurityDescription: 'Confirma tu contraseña actual y revisa el nuevo email antes de guardar.',
      passwordSecurityDescription: 'Confirma tu contraseña actual y revisa la nueva contraseña antes de guardar.',
      confirmSensitiveAction: 'Entiendo que esta es una acción sensible y quiero continuar.',
      saving: 'Guardando...',
      saveChanges: 'Guardar cambios',
      reviewEmail: 'Revisar cambio de email',
      reviewPassword: 'Revisar cambio de contraseña',
      saveEmail: 'Guardar nuevo email',
      savePassword: 'Guardar nueva contraseña',
      emailConfirmTitle: 'Confirmar cambio de email',
      emailConfirmDescription: (email: string) => `El acceso de tu cuenta pasará a usar "${email}". Tendrás que iniciar sesión nuevamente después de guardar.`,
      passwordConfirmTitle: 'Confirmar cambio de contraseña',
      passwordConfirmDescription: 'Tu contraseña será cambiada y todas las sesiones actuales serán cerradas.',
      cancel: 'Cancelar',
      back: 'Volver',
    },
    toasts: {
      emailUpdated: 'Email cambiado con éxito. Inicia sesión nuevamente para continuar.',
      passwordUpdated: 'Contraseña cambiada con éxito. Inicia sesión nuevamente para continuar.',
      checkoutError: 'No se pudo iniciar el pago.',
    },
  },
} as const;

const copy = computed(() => translations[locale.value]);
const usernameStatus = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
const usernameValidationError = ref<string | null>(null);
let usernameCheckTimer: number | null = null;
let lastCheckedUsername = '';

const forms = reactive({
  username: { name: '', isLoading: false, error: null as string | null },
  displayName: { title: '', isLoading: false, error: null as string | null },
  changeEmail: {
    currentPassword: '',
    newEmail: '',
    confirmNewEmail: '',
    confirmAction: false,
    isLoading: false,
    error: null as string | null,
  },
  changePassword: {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    confirmAction: false,
    isLoading: false,
    error: null as string | null,
  },
});

const validateAccountUsername = (value: string) => validatePublicHandle(value, {
  required: copy.value.modals.usernameRequired,
  tooShort: copy.value.modals.usernameTooShort,
  reserved: copy.value.modals.usernameReserved,
});

const currentUsernameNormalized = computed(() => normalizePublicHandle(user.value?.name || ''));

const resetUsernameFeedback = () => {
  usernameStatus.value = 'idle';
  usernameValidationError.value = null;
  lastCheckedUsername = '';
  if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
  usernameCheckTimer = null;
};

const checkAccountUsernameAvailability = async (value: string) => {
  const normalized = normalizePublicHandle(value);
  const validationError = validateAccountUsername(normalized);

  if (normalized !== value) {
    forms.username.name = normalized;
  }

  if (validationError) {
    usernameStatus.value = normalized ? 'invalid' : 'idle';
    usernameValidationError.value = validationError;
    return false;
  }

  if (normalized === currentUsernameNormalized.value) {
    usernameStatus.value = 'available';
    usernameValidationError.value = null;
    lastCheckedUsername = normalized;
    return true;
  }

  if (lastCheckedUsername === normalized && usernameStatus.value !== 'checking') {
    return usernameStatus.value === 'available';
  }

  usernameStatus.value = 'checking';
  usernameValidationError.value = null;
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

watch(() => forms.username.name, (value) => {
  const normalized = normalizePublicHandle(value);

  if (normalized !== value) {
    forms.username.name = normalized;
    return;
  }

  if (!normalized) {
    resetUsernameFeedback();
    return;
  }

  const validationError = validateAccountUsername(normalized);
  if (validationError) {
    usernameStatus.value = 'invalid';
    usernameValidationError.value = validationError;
    lastCheckedUsername = '';
    if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
    usernameCheckTimer = null;
    return;
  }

  if (usernameCheckTimer) window.clearTimeout(usernameCheckTimer);
  usernameCheckTimer = window.setTimeout(() => {
    checkAccountUsernameAvailability(normalized);
  }, 350);
});

const openUsernameModal = () => {
  forms.username.name = normalizePublicHandle(user.value?.name || '');
  forms.username.error = null;
  resetUsernameFeedback();
  isUsernameModalOpen.value = true;
};
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
  isEmailConfirmationModalOpen.value = false;
  isPasswordConfirmationModalOpen.value = false;
  Object.values(forms).forEach(form => {
    Object.keys(form).forEach(key => {
      if (key !== 'isLoading') (form as any)[key] = (typeof (form as any)[key] === 'string') ? '' : null;
    });
  });
  resetUsernameFeedback();
};

function formatDate(value: string) {
  const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const;
  return new Date(value).toLocaleString(localeMap[locale.value]);
}

function canDeleteSession(session: { id: string; active: boolean; revoked: boolean }) {
  return session.revoked && session.id !== latestActiveSessionId.value;
}

function canRevokeSession(session: { id: string; active: boolean; revoked: boolean }) {
  return !session.revoked && session.id !== latestActiveSessionId.value;
}

function openEmailConfirmationModal() {
  forms.changeEmail.error = null;
  isEmailConfirmationModalOpen.value = true;
}

function closeEmailConfirmationModal() {
  if (forms.changeEmail.isLoading) return;
  isEmailConfirmationModalOpen.value = false;
}

function openPasswordConfirmationModal() {
  forms.changePassword.error = null;
  isPasswordConfirmationModalOpen.value = true;
}

function closePasswordConfirmationModal() {
  if (forms.changePassword.isLoading) return;
  isPasswordConfirmationModalOpen.value = false;
}

function openLogoutAllSessionsModal() {
  sessionsError.value = null;
  isLogoutAllSessionsModalOpen.value = true;
}

function closeLogoutAllSessionsModal() {
  if (isLoggingOutAll.value) return;
  isLogoutAllSessionsModalOpen.value = false;
}

function openRevokeSessionModal(sessionId: string) {
  sessionsError.value = null;
  sessionIdPendingDeletion.value = sessionId;
  isRevokeSessionModalOpen.value = true;
}

function closeRevokeSessionModal() {
  if (isRevokingSession.value) return;
  isRevokeSessionModalOpen.value = false;
  sessionIdPendingDeletion.value = null;
}

function openDeleteSessionModal(sessionId: string) {
  sessionsError.value = null;
  sessionIdPendingHardDeletion.value = sessionId;
  isDeleteSessionModalOpen.value = true;
}

function closeDeleteSessionModal() {
  if (isDeletingSession.value) return;
  isDeleteSessionModalOpen.value = false;
  sessionIdPendingHardDeletion.value = null;
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
    const isAvailable = await checkAccountUsernameAvailability(forms.username.name);
    if (!isAvailable) {
      forms.username.error =
        usernameStatus.value === 'taken'
          ? copy.value.modals.usernameInUse
          : usernameValidationError.value || copy.value.modals.usernameInvalid;
      return;
    }
    await userStore.updateUserProfile({ name: forms.username.name });
    closeAllModals();
  } catch (e: any) {
    forms.username.error = /user(name)?|slug/i.test(e.message)
      ? copy.value.modals.usernameInUse
      : e.message;
  }
  finally { forms.username.isLoading = false; }
};

onUnmounted(() => {
  resetUsernameFeedback();
});

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
    toast.success(copy.value.toasts.emailUpdated);
    await authStore.logout();
  } catch (e: any) { forms.changeEmail.error = e.message; }
  finally { forms.changeEmail.isLoading = false; }
};

const handleUpdatePassword = async () => {
  forms.changePassword.isLoading = true; forms.changePassword.error = null;
  try {
    await userStore.updatePassword(forms.changePassword);
    toast.success(copy.value.toasts.passwordUpdated);
    await authStore.logout();
  } catch (e: any) { forms.changePassword.error = e.message; }
  finally { forms.changePassword.isLoading = false; }
};

const confirmLogoutAllSessions = async () => {
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

const handleLogoutAllSessions = () => {
  openLogoutAllSessionsModal();
};

const confirmRevokeSession = async () => {
  if (!sessionIdPendingDeletion.value) return;
  sessionsError.value = null;
  isRevokingSession.value = true;
  try {
    await authStore.revokeSession(sessionIdPendingDeletion.value);
    closeRevokeSessionModal();
  } catch (e: any) {
    sessionsError.value = e.message;
  } finally {
    isRevokingSession.value = false;
  }
};

const confirmDeleteSession = async () => {
  if (!sessionIdPendingHardDeletion.value) return;
  sessionsError.value = null;
  isDeletingSession.value = true;
  try {
    await authStore.deleteSession(sessionIdPendingHardDeletion.value);
    closeDeleteSessionModal();
  } catch (e: any) {
    sessionsError.value = e.message;
  } finally {
    isDeletingSession.value = false;
  }
};

const handleUpgrade = async () => {
  try {
    await userStore.redirectToCheckout();
  } catch (e: any) {
    toast.error(e.message || copy.value.toasts.checkoutError);
  }
};
</script>

<style scoped>
.error-text {
  @apply text-sm text-red-400 text-center;
}

.success-text {
  @apply text-sm text-green-400 text-center;
}
</style>
