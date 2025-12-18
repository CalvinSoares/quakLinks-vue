<template>
  <DashboardLayout>
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow">
    </div>
    <div
      class="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000">
    </div>

    <div class="relative z-10 space-y-8 pb-12">

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Olá, <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{{
              user?.name?.split(' ')[0] }}</span>
            <span class="inline-block animate-wave text-3xl">👋</span>
          </h1>
          <p class="text-slate-400 mt-2 text-base md:text-lg">Gerencie sua conta e integrações em um só lugar.</p>
        </div>
      </div>

      <div v-show="!isDataLoaded" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div class="h-40 rounded-3xl bg-slate-800/50" v-for="i in 3" :key="i"></div>
      </div>

      <div v-show="isDataLoaded" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div
            class="group relative rounded-3xl bg-slate-900/60 border border-white/5 p-6 backdrop-blur-md hover:border-amber-500/30 transition-all overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <div class="flex items-center gap-4 mb-6 relative z-10">
              <div class="relative">
                <div class="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-purple-600">
                  <img :src="sidebarAvatarUrl"
                    class="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                </div>
                <button @click="openUsernameModal"
                  class="absolute -bottom-1 -right-1 p-1.5 bg-slate-800 rounded-full border border-slate-700 text-white hover:text-amber-400 transition-colors shadow-lg">
                  <PencilIcon class="w-3 h-3" />
                </button>
              </div>
              <div class="overflow-hidden">
                <h3 class="font-bold text-white text-lg truncate">{{ user?.name }}</h3>
                <p class="text-slate-400 text-xs truncate">{{ user?.email }}</p>
                <div
                  class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {{ user?.role === 'PREMIUM' ? 'PRO MEMBER ⚡' : 'FREE PLAN' }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-auto relative z-10">
              <button @click="openUsernameModal"
                class="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors">
                <UserCircleIcon class="w-4 h-4" /> Editar Nome
              </button>
              <button @click="$router.push('/settings')"
                class="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors">
                <Cog6ToothIcon class="w-4 h-4" /> Configurações
              </button>
            </div>
          </div>

          <div
            class="group relative rounded-3xl bg-slate-900/60 border border-white/5 p-6 backdrop-blur-md hover:border-purple-500/30 transition-all flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <div class="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                <DocumentDuplicateIcon class="w-6 h-6" />
              </div>
              <router-link to="/dashboard/pages"
                class="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                Ver todas
                <ArrowRightIcon class="w-3 h-3" />
              </router-link>
            </div>
            <div>
              <h3 class="text-slate-400 text-sm font-medium mb-1">Páginas Criadas</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-black text-white">{{ pageStore.userPages?.length || 0 }}</span>
                <span class="text-sm text-slate-500 font-medium">/ 5</span>
              </div>
              <div class="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${((pageStore.userPages?.length || 0) / 5) * 100}%` }"></div>
              </div>
            </div>
          </div>

          <div
            class="group relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-white/5 p-6 overflow-hidden flex flex-col justify-center">
            <div class="flex items-center gap-4">
              <div class="relative w-16 h-16 flex-shrink-0">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="none"
                    class="text-slate-800" />
                  <circle cx="32" cy="32" r="28" stroke="url(#gradient-completion)" stroke-width="4" fill="none"
                    :stroke-dasharray="175" :stroke-dashoffset="175 - (completion.percentage / 100) * 175"
                    stroke-linecap="round" class="transition-all duration-1000 ease-out" />
                  <defs>
                    <linearGradient id="gradient-completion" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fbbf24" />
                      <stop offset="100%" stop-color="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{{
                  completion.percentage }}%</span>
              </div>
              <div>
                <h3 class="text-white font-bold text-sm">Complete seu Setup</h3>
                <p class="text-slate-400 text-xs mt-1 leading-relaxed">Complete as tarefas para turbinar seu perfil.</p>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div v-for="(task, i) in completion.tasks.slice(0, 2)" :key="i" class="flex items-center gap-2 text-xs">
                <div class="w-4 h-4 rounded-full flex items-center justify-center"
                  :class="task.completed ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'">
                  <CheckIcon v-if="task.completed" class="w-3 h-3" />
                  <div v-else class="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                </div>
                <span :class="task.completed ? 'text-slate-500 line-through' : 'text-slate-300'">{{ task.label }}</span>
              </div>
            </div>
          </div>

        </div>

        <div>
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LinkIcon class="w-5 h-5 text-indigo-400" /> Contas Conectadas
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div class="relative overflow-hidden rounded-2xl border transition-all duration-300 group"
              :class="isDiscordConnected ? 'bg-[#5865F2]/10 border-[#5865F2]/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'">

              <div v-if="isDiscordConnected"
                class="absolute -right-10 -top-10 w-40 h-40 bg-[#5865F2]/20 blur-[60px] rounded-full pointer-events-none">
              </div>

              <div class="p-5 flex items-center justify-between relative z-10">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    :class="isDiscordConnected ? 'bg-[#5865F2]' : 'bg-slate-800 text-slate-500'">
                    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.666 1.2828-1.5796-.3418-3.2142-.3418-4.7938 0-.2196-.4583-.455-.9075-.666-1.2828a.0741.0741 0 00-.0785-.0371 19.7364 19.7364 0 00-4.8852 1.5152.0691.0691 0 00-.0321.0262c-1.8988 4.6534-2.3168 9.541-1.7827 14.0416a.0741.0741 0 00.0785.062c1.4892-.259 2.9304-.7531 4.3085-1.4093a.0741.0741 0 00.042-.0372c-.177-.323-.342-.6526-.5-.9865a.0741.0741 0 01.012-.0819c.1252-.0941.251-.191.3765-.2911a.0741.0741 0 01.078-.012c4.1325 1.631 8.563 1.631 12.6954 0a.0741.0741 0 01.0785.012c.1255.1001.2515.197.3765.2911a.0741.0741 0 01.012.0819c-.158.3339-.323.6635-.5.9865a.0741.0741 0 00.042.0372c1.378.6562 2.8193 1.1503 4.3085 1.4093a.0741.0741 0 00.0785-.062c.54-4.494.12-9.382-1.7828-14.0416a.0691.0691 0 00-.032-.0262zM8.02 15.3312c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523zm7.96 0c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">Discord</h3>
                    <p v-if="isDiscordConnected" class="text-[#5865F2] text-xs font-bold tracking-wide mt-0.5">CONECTADO
                    </p>
                    <p v-else class="text-slate-500 text-xs">Não conectado</p>
                  </div>
                </div>

                <div v-if="isDiscordConnected">
                  <button @click="openDisconnectModal('discord')"
                    class="px-3 py-1.5 text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-colors">
                    Desconectar
                  </button>
                </div>
                <div v-else>
                  <a :href="discordLoginUrl"
                    class="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700">
                    Conectar
                  </a>
                </div>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-2xl border transition-all duration-300 group"
              :class="isGoogleConnected ? 'bg-white/5 border-white/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'">

              <div class="p-5 flex items-center justify-between relative z-10">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-white text-slate-900 shadow-lg">
                    <svg class="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4" />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853" />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05" />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">Google</h3>
                    <p v-if="isGoogleConnected" class="text-green-400 text-xs font-bold tracking-wide mt-0.5">CONECTADO
                    </p>
                    <p v-else class="text-slate-500 text-xs">Não conectado</p>
                  </div>
                </div>

                <div v-if="isGoogleConnected">
                  <button @click="openDisconnectModal('google')"
                    class="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-slate-700 rounded-lg transition-all">
                    Desvincular
                  </button>
                </div>
                <div v-else>
                  <a :href="googleLoginUrl"
                    class="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-gray-200 rounded-lg transition-colors">
                    Conectar
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <Modal :is-open="isUsernameModalOpen" @close="isUsernameModalOpen = false" title="Editar Usuário">
      <div class="p-6 space-y-4">
        <label class="block text-sm font-medium text-slate-400 mb-1">Novo nome de usuário</label>
        <input v-model="newUsername" type="text" class="input-modern" placeholder="Ex: John Doe" />
        <button @click="handleUpdateUsername" :disabled="isLoading" class="btn-primary w-full">
          {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </Modal>

    <Modal :is-open="isDisconnectModalOpen" @close="isDisconnectModalOpen = false" title="Desconectar Conta">
      <div class="p-6 space-y-4 text-center">
        <div class="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
          <ArrowLeftEndOnRectangleIcon class="w-6 h-6" />
        </div>
        <p class="text-slate-300 text-sm">
          Tem certeza que deseja desvincular sua conta do
          <span class="capitalize font-bold text-white">{{ disconnectTarget }}</span>?
          Isso pode afetar seu login se for seu único método de acesso.
        </p>
        <div class="flex gap-3 pt-2">
          <button @click="isDisconnectModalOpen = false" class="btn-secondary flex-1">Cancelar</button>
          <button @click="handleDisconnectAccount" :disabled="isLoading" class="btn-danger flex-1">
            {{ isLoading ? 'Removendo...' : 'Sim, desconectar' }}
          </button>
        </div>
      </div>
    </Modal>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePageStore } from '@/store/page';
import { useUserStore } from '@/store/user';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import Modal from '@/components/dashboard/Modal.vue';
import {
  PencilIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CheckIcon,
  ArrowRightIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();

const isUsernameModalOpen = ref(false);
const isDisconnectModalOpen = ref(false);
const disconnectTarget = ref<'discord' | 'google'>('discord');
const newUsername = ref('');
const isLoading = ref(false);

onMounted(() => {
  if (pageStore.userPages.length === 0) pageStore.fetchUserPages();
});

const user = computed(() => authStore.user);
const isDataLoaded = computed(() => !!user.value);

const sidebarAvatarUrl = computed(() => {
  return user.value?.image || `https://ui-avatars.com/api/?name=${user.value?.name}&background=fbbd24&color=1e293b&bold=true`;
});

const isDiscordConnected = computed(() => user.value?.accounts?.some(acc => acc.provider === 'discord') ?? false);
const isGoogleConnected = computed(() => user.value?.accounts?.some(acc => acc.provider === 'google') ?? false);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const tokenParam = authStore.token ? `?token=${authStore.token}` : '';
const discordLoginUrl = `${apiUrl}/auth/discord${tokenParam}`;
const googleLoginUrl = `${apiUrl}/auth/google${tokenParam}`;

const completion = computed(() => {
  const tasks = [
    { label: 'Definir Avatar', completed: !!user.value?.image },
    { label: 'Criar Página', completed: (pageStore.userPages?.length || 0) > 0 },
    { label: 'Conectar Conta', completed: isDiscordConnected.value || isGoogleConnected.value },
  ];
  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);
  return { percentage, tasks };
});

function openDisconnectModal(target: 'discord' | 'google') {
  disconnectTarget.value = target;
  isDisconnectModalOpen.value = true;
}

function openUsernameModal() {
  newUsername.value = user.value?.name || '';
  isUsernameModalOpen.value = true;
}

async function handleUpdateUsername() {
  if (!newUsername.value.trim()) return toast.error("Nome vazio.");
  isLoading.value = true;
  try {
    await userStore.updateUserProfile({ name: newUsername.value });
    isUsernameModalOpen.value = false;
    toast.success("Nome atualizado!");
  } catch (e: any) { toast.error(e.message); }
  finally { isLoading.value = false; }
}

async function handleDisconnectAccount() {
  isLoading.value = true;
  try {
    await userStore.unlinkAccount(disconnectTarget.value);
    isDisconnectModalOpen.value = false;
    toast.success(`Conta ${disconnectTarget.value} desconectada.`);
    await authStore.fetchUser();
  } catch (e: any) { toast.error(e.message || "Erro ao desconectar"); }
  finally { isLoading.value = false; }
}
</script>

<style scoped>
.btn-primary {
  @apply py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50;
}

.btn-secondary {
  @apply py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium transition-colors;
}

.btn-danger {
  @apply py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 font-bold transition-colors;
}

.input-modern {
  @apply w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none;
}

@keyframes wave {

  0%,
  100% {
    transform: rotate(0deg);
  }

  10%,
  30% {
    transform: rotate(14deg);
  }

  20% {
    transform: rotate(-8deg);
  }

  40% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(10deg);
  }

  60% {
    transform: rotate(0deg);
  }
}

.animate-wave {
  animation: wave 2.5s infinite;
  transform-origin: 70% 70%;
}

@keyframes pulse-slow {

  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>