<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- 1. Header Componentizado e Melhorado -->
      <OverviewHeader title="Account Overview"
        subtitle="Gerencie seu perfil e acompanhe suas estatísticas em tempo real." :icon="UserCircleIcon" />

      <!-- 2. Loading Overlay (Mantido) -->
      <div v-show="!isDataLoaded" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 mx-auto border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin">
          </div>
          <p class="text-slate-400">Carregando dados da conta...</p>
        </div>
      </div>

      <!-- 3. Conteúdo Principal com Layout Melhorado -->
      <div v-show="isDataLoaded" class="space-y-6">
        <!-- Grid de Stats com v-for e Componente Reutilizável -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :icon="stat.icon"
            :gradient-class="stat.gradient" />
        </div>

        <!-- Grid Principal com Componentes Dedicados -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <ProfileCompletionCard :completion="completion" @open-discord-modal="openDiscordModal" />
          </div>

          <AccountActionsCard :is-discord-connected="isDiscordConnected" @change-username="openUsernameModal"
            @change-display-name="openDisplayNameModal" @connect-discord="openDiscordModal"
            @disconnect-discord="openDisconnectModal" />
        </div>
      </div>
    </div>
    <!-- Modals -->
    <Modal :is-open="isUsernameModalOpen" @close="isUsernameModalOpen = false" title="Change Username">

      <div class="space-y-4 p-4">
        <label for="username" class="block text-sm font-medium text-slate-300">Username</label>
        <div class="relative">
          <PencilIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="newUsername" type="text" id="username"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            placeholder="Seu nome de usuário">
        </div>
        <button @click="handleUpdateUsername" :disabled="isLoading"
          class="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-yellow-600 to-indigo-600 rounded-xl hover:from-yellow-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all duration-300">
          {{ isLoading ? 'Salvando...' : 'Change Username' }}
        </button>
        <p v-if="error" class="text-sm text-red-400 text-center">{{ error }}</p>
      </div>

    </Modal>

    <Modal :is-open="isDisplayNameModalOpen" @close="isDisplayNameModalOpen = false" title="Change Display Name">

      <div class="space-y-4 p-4">
        <label for="displayName" class="block text-sm font-medium text-slate-300">Display Name</label>
        <div class="relative">
          <ComputerDesktopIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="newDisplayName" type="text" id="displayName"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            placeholder="Título da sua página">
        </div>
        <button @click="handleUpdateDisplayName" :disabled="isLoading"
          class="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-yellow-600 to-indigo-600 rounded-xl hover:from-yellow-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all duration-300">
          {{ isLoading ? 'Salvando...' : 'Change Display Name' }}
        </button>
        <p v-if="error" class="text-sm text-red-400 text-center">{{ error }}</p>
      </div>

    </Modal>

    <Modal :is-open="isDiscordModalOpen" @close="isDiscordModalOpen = false" title="Conectar sua Conta do Discord">
      <div class="p-4 space-y-4">
        <p class="text-slate-300 text-center">Conecte sua conta do Discord para desbloquear novos recursos e
          personalizar ainda mais seu perfil!</p>
        <ul class="text-left space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <li class="flex items-start gap-3 text-slate-300">
            <CheckCircleIcon class="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span class="text-sm">Sincronize seu avatar do Discord automaticamente.</span>
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <CheckCircleIcon class="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span class="text-sm">Mostre seu status do Discord em sua página (em breve).</span>
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <CheckCircleIcon class="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span class="text-sm">Desbloqueie temas e badges exclusivos (em breve).</span>
          </li>
        </ul>
        <a :href="discordLoginUrl"
          class="flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold text-white bg-[#5865F2] rounded-xl hover:bg-[#4f5bda] transition-all duration-300 hover:scale-[1.02] shadow-lg">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.666 1.2828-1.5796-.3418-3.2142-.3418-4.7938 0-.2196-.4583-.455-.9075-.666-1.2828a.0741.0741 0 00-.0785-.0371 19.7364 19.7364 0 00-4.8852 1.5152.0691.0691 0 00-.0321.0262c-1.8988 4.6534-2.3168 9.541-1.7827 14.0416a.0741.0741 0 00.0785.062c1.4892-.259 2.9304-.7531 4.3085-1.4093a.0741.0741 0 00.042-.0372c-.177-.323-.342-.6526-.5-.9865a.0741.0741 0 01.012-.0819c.1252-.0941.251-.191.3765-.2911a.0741.0741 0 01.078-.012c4.1325 1.631 8.563 1.631 12.6954 0a.0741.0741 0 01.0785.012c.1255.1001.2515.197.3765.2911a.0741.0741 0 01.012.0819c-.158.3339-.323.6635-.5.9865a.0741.0741 0 00.042.0372c1.378.6562 2.8193 1.1503 4.3085 1.4093a.0741.0741 0 00.0785-.062c.54-4.494.12-9.382-1.7828-14.0416a.0691.0691 0 00-.032-.0262zM8.02 15.3312c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523zm7.96 0c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523z" />
          </svg>
          Conectar com Discord
        </a>
      </div>

    </Modal>

    <Modal :is-open="isDisconnectModalOpen" @close="isDisconnectModalOpen = false" title="Desconectar Conta do Discord">

      <div class="p-6 space-y-6"> <!-- Padding adicionado -->
        <div class="text-center space-y-2">
          <div class="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon class="w-8 h-8 text-red-400" />
          </div>
          <p class="text-slate-300">Tem certeza que deseja desvincular sua conta do Discord?</p>
          <p class="text-sm text-slate-400">
            Seu avatar do Discord será removido e você precisará se conectar novamente para usar os recursos
            relacionados.
          </p>
        </div>
      </div>

      <!-- Botões de ação no slot #footer -->
      <template #footer>
        <div class="flex gap-3">
          <button @click="isDisconnectModalOpen = false"
            class="flex-1 px-6 py-3 font-semibold text-white bg-slate-600 hover:bg-slate-500 rounded-xl transition-all">
            Cancelar
          </button>
          <button @click="handleDisconnectDiscord" :disabled="isLoading"
            class="flex-1 px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl disabled:bg-slate-500 transition-all">
            {{ isLoading ? 'Desconectando...' : 'Desconectar' }}
          </button>
        </div>
      </template>

    </Modal>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import Modal from '@/components/dashboard/Modal.vue';
import {
  PencilIcon,
  ComputerDesktopIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  AtSymbolIcon,
  HashtagIcon
} from '@heroicons/vue/24/outline';
import { EyeIcon, UserIcon } from 'vue-tabler-icons';
import OverviewHeader from '@/components/dashboard/OverviewHeader.vue';
import StatCard from '@/components/dashboard/StatCard.vue';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard.vue';
import AccountActionsCard from '@/components/dashboard/AccountActionsCard.vue';

const authStore = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();

const isUsernameModalOpen = ref(false);
const isDisplayNameModalOpen = ref(false);
const isDiscordModalOpen = ref(false);
const isDisconnectModalOpen = ref(false);
const newUsername = ref('');
const newDisplayName = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

const user = computed(() => authStore.user);
const page = computed(() => pageStore.currentPage);
const isDataLoaded = computed(() => !!(user.value && page.value));
const isDiscordConnected = computed(() => !!authStore.user?.discordAvatarUrl);


const stats = computed(() => [
  { title: 'Username', value: user.value?.name || '...', icon: UserIcon, gradient: 'from-yellow-500 to-indigo-500' },
  { title: 'Alias', value: page.value?.slug || '...', icon: AtSymbolIcon, gradient: 'from-yellow-500 to-rose-500' },
  { title: 'Profile Views', value: (page.value?.viewCount ?? 0).toLocaleString(), icon: EyeIcon, gradient: 'from-yellow-500 to-blue-500' },
  { title: 'UID', value: (user.value?.id.toUpperCase().slice(0, 5)) || 'N/A', icon: HashtagIcon, gradient: 'from-yellow-500 to-teal-500' }
])

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const discordLoginUrl = `${apiUrl}/auth/discord`;


const completion = computed(() => {
  if (!page.value) return { percentage: 0, tasks: [] };

  const isDiscordLinked = !!authStore.user?.discordAvatarUrl;

  const tasks = [
    { label: 'Upload An Avatar', completed: !!page.value.avatarUrl, to: '/dashboard/appearance' },
    { label: 'Add A Description', completed: !!page.value.bio && page.value.bio.length > 10, to: '/dashboard/appearance' },
    { label: 'Add Socials', completed: page.value.links.length > 0, to: '/links' },
    { label: 'Link Discord Account', completed: isDiscordLinked, action: !isDiscordLinked ? openDiscordModal : undefined },
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);
  return { percentage, tasks };
});

function openDiscordModal() {
  isDiscordModalOpen.value = true;
}

function openDisconnectModal() {
  isDisconnectModalOpen.value = true;
}

function openUsernameModal() {
  newUsername.value = user.value?.name || '';
  error.value = null;
  isUsernameModalOpen.value = true;
}

function openDisplayNameModal() {
  newDisplayName.value = page.value?.title || '';
  error.value = null;
  isDisplayNameModalOpen.value = true;
}

async function handleUpdateUsername() {
  if (!newUsername.value.trim()) {
    error.value = "Username não pode estar em branco.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    await userStore.updateUserProfile({ name: newUsername.value });
    isUsernameModalOpen.value = false;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleUpdateDisplayName() {
  isLoading.value = true;
  error.value = null;
  try {
    await pageStore.updateMyPage({ title: newDisplayName.value });
    isDisplayNameModalOpen.value = false;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleDisconnectDiscord() {
  isLoading.value = true;
  try {
    await userStore.unlinkDiscord();
    isDisconnectModalOpen.value = false;
  } catch (e: any) {
    alert(e.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
