<template>
  <DashboardLayout>
    <div class="space-y-8 pb-12">
      <!-- Header com gradiente e efeito blur -->
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-indigo-500/10 to-rose-500/10 blur-3xl -z-10">
        </div>
        <OverviewHeader title="Account Overview"
          subtitle="Gerencie seu perfil e acompanhe suas estatísticas em tempo real." :icon="UserCircleIcon" />
      </div>

      <!-- Loading com animação moderna -->
      <div v-show="!isDataLoaded" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center space-y-6">
          <div class="relative w-20 h-20 mx-auto">
            <div class="absolute inset-0 border-4 border-yellow-500/30 rounded-full animate-ping"></div>
            <div class="absolute inset-0 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin">
            </div>
          </div>
          <p class="text-slate-400 animate-pulse">Carregando dados da conta...</p>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div v-show="isDataLoaded" class="space-y-8">
        <!-- Cards de stats completamente redesenhados com gradientes, glassmorphism e animações -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Username Card -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20">
            <div
              class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div
                  class="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-indigo-500/20 border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                  <UserIcon class="w-6 h-6 text-yellow-400" />
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span class="text-xs text-slate-400">Online</span>
                </div>
              </div>
              <p class="text-sm text-slate-400 font-medium mb-2">Username</p>
              <p class="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                {{ user?.name || '...' }}
              </p>
            </div>
          </div>

          <!-- Alias Card -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 hover:border-rose-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20">
            <div
              class="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div
                  class="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 group-hover:scale-110 transition-transform duration-300">
                  <AtSymbolIcon class="w-6 h-6 text-rose-400" />
                </div>
                <a :href="`/${page?.slug}`" target="_blank"
                  class="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <span>Visitar</span>
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <p class="text-sm text-slate-400 font-medium mb-2">Alias</p>
              <p class="text-2xl font-bold text-white group-hover:text-rose-400 transition-colors duration-300">
                @{{ page?.slug || '...' }}
              </p>
            </div>
          </div>

          <!-- Profile Views Card -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div
                  class="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <EyeIcon class="w-6 h-6 text-blue-400" />
                </div>
                <div
                  class="flex items-center gap-1 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clip-rule="evenodd" />
                  </svg>
                  <span>+12%</span>
                </div>
              </div>
              <p class="text-sm text-slate-400 font-medium mb-2">Profile Views</p>
              <p class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {{ (page?.viewCount ?? 0).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Grid principal redesenhado com novos cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile Completion - redesenhado -->
          <div
            class="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-8">
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-indigo-500/10 blur-3xl">
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-2xl font-bold text-white mb-2">Profile Completion</h3>
                  <p class="text-sm text-slate-400">Complete seu perfil para desbloquear todos os recursos</p>
                </div>
                <div class="relative w-20 h-20">
                  <!-- Circle Progress -->
                  <svg class="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="6" fill="none"
                      class="text-slate-700" />
                    <circle cx="40" cy="40" r="32" stroke="url(#gradient)" stroke-width="6" fill="none"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="circumference - (completion.percentage / 100) * circumference"
                      class="transition-all duration-1000 ease-out" stroke-linecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#eab308;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-lg font-bold text-white">{{ completion.percentage }}%</span>
                  </div>
                </div>
              </div>

              <!-- Tasks List -->
              <div class="space-y-3">
                <div v-for="(task, index) in completion.tasks" :key="index"
                  class="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:bg-slate-800/80"
                  :class="task.completed ? 'opacity-60' : 'hover:scale-[1.01]'">
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                    :class="task.completed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500'
                        : 'border-slate-600 group-hover:border-yellow-500'
                      ">
                    <CheckCircleIcon v-if="task.completed" class="w-4 h-4 text-white" />
                  </div>

                  <span class="flex-1 text-sm font-medium transition-colors"
                    :class="task.completed ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-white'">
                    {{ task.label }}
                  </span>

                  <button v-if="!task.completed && (task.to || task.action)"
                    class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-yellow-600 to-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-yellow-500 hover:to-indigo-500">
                    Completar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Actions - redesenhado -->
          <div class="space-y-4">
            <!-- Quick Actions Card -->
            <div
              class="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                Quick Actions
              </h3>

              <div class="space-y-3">
                <button @click="openUsernameModal"
                  class="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-yellow-500/50 hover:bg-slate-800 transition-all duration-300 group">
                  <div class="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                    <PencilIcon class="w-5 h-5 text-yellow-400" />
                  </div>
                  <div class="flex-1 text-left">
                    <p class="text-sm font-semibold text-white">Change Username</p>
                    <p class="text-xs text-slate-400">Atualize seu nome de usuário</p>
                  </div>
                  <svg class="w-5 h-5 text-slate-600 group-hover:text-yellow-400 transition-colors" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button @click="openDisplayNameModal"
                  class="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 group">
                  <div class="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <ComputerDesktopIcon class="w-5 h-5 text-indigo-400" />
                  </div>
                  <div class="flex-1 text-left">
                    <p class="text-sm font-semibold text-white">Change Display Name</p>
                    <p class="text-xs text-slate-400">Título da sua página</p>
                  </div>
                  <svg class="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Discord Connection Card -->
            <div
              class="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6">
              <div v-if="!isDiscordConnected" class="text-center space-y-4">
                <div
                  class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/5 border border-[#5865F2]/30 flex items-center justify-center">
                  <svg class="w-8 h-8 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.666 1.2828-1.5796-.3418-3.2142-.3418-4.7938 0-.2196-.4583-.455-.9075-.666-1.2828a.0741.0741 0 00-.0785-.0371 19.7364 19.7364 0 00-4.8852 1.5152.0691.0691 0 00-.0321.0262c-1.8988 4.6534-2.3168 9.541-1.7827 14.0416a.0741.0741 0 00.0785.062c1.4892-.259 2.9304-.7531 4.3085-1.4093a.0741.0741 0 00.042-.0372c-.177-.323-.342-.6526-.5-.9865a.0741.0741 0 01.012-.0819c.1252-.0941.251-.191.3765-.2911a.0741.0741 0 01.078-.012c4.1325 1.631 8.563 1.631 12.6954 0a.0741.0741 0 01.0785.012c.1255.1001.2515.197.3765.2911a.0741.0741 0 01.012.0819c-.158.3339-.323.6635-.5.9865a.0741.0741 0 00.042.0372c1.378.6562 2.8193 1.1503 4.3085 1.4093a.0741.0741 0 00.0785-.062c.54-4.494.12-9.382-1.7828-14.0416a.0691.0691 0 00-.032-.0262zM8.02 15.3312c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523zm7.96 0c-.8325 0-1.5097-.682-1.5097-1.523 0-.841.6772-1.523 1.5097-1.523s1.5097.682 1.5097 1.523c0 .841-.6772 1.523-1.5097 1.523z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">Connect Discord</h4>
                  <p class="text-xs text-slate-400">Sincronize seu avatar e desbloqueie recursos</p>
                </div>
                <button @click="openDiscordModal"
                  class="w-full px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#5865F2]/20">
                  Conectar
                </button>
              </div>

              <div v-else class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <img v-if="user?.discordAvatarUrl" :src="user.discordAvatarUrl" alt="Discord Avatar"
                      class="w-12 h-12 rounded-full border-2 border-[#5865F2]" />
                    <div
                      class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-slate-900">
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-white">Discord Connected</p>
                    <p class="text-xs text-slate-400">Avatar sincronizado</p>
                  </div>
                </div>
                <button @click="openDisconnectModal"
                  class="w-full px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all duration-300 border border-red-500/30 hover:border-red-500/50">
                  Desconectar
                </button>
              </div>
            </div>
          </div>
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
            placeholder="Seu nome de usuário" />
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
            placeholder="Título da sua página" />
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
        <p class="text-slate-300 text-center">
          Conecte sua conta do Discord para desbloquear novos recursos e personalizar ainda mais seu perfil!
        </p>
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
      <div class="p-6 space-y-6">
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
} from '@heroicons/vue/24/outline';
import { EyeIcon, UserIcon } from 'vue-tabler-icons';
import OverviewHeader from '@/components/dashboard/OverviewHeader.vue';
import { toast } from 'vue-sonner';

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

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const discordLoginUrl = `${apiUrl}/auth/discord`;

// Circle progress calculation
const circumference = 2 * Math.PI * 32;

const completion = computed(() => {
  if (!page.value) return { percentage: 0, tasks: [] };

  const isDiscordLinked = !!authStore.user?.discordAvatarUrl;

  const tasks = [
    { label: 'Upload An Avatar', completed: !!(page.value.avatarUrl || page.value.user?.discordAvatarUrl), to: '/dashboard/appearance' },
    { label: 'Add A Description', completed: !!page.value.bio && page.value.bio.length > 0, to: '/dashboard/appearance' },
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
    toast.error(e.message);
  } finally {
    isLoading.value = false;
  }
}
</script>
