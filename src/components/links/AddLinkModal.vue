<!-- src/components/links/AddLinkModal.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" @click.self="close"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <transition name="pop">
          <div v-if="isOpen" class="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
            <!-- Header com Gradiente -->
            <div class="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 p-6">
              <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-sky-500/10"></div>
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-amber-500/20 rounded-lg">
                    <component :is="icon" class="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 class="text-xl font-bold text-white">{{ formTitle }}</h2>
                </div>
                <button @click="close" type="button"
                  class="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                  <component :is="XIcon" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Form Content -->
            <form @submit.prevent="submit" class="p-6 bg-slate-900/50 space-y-5">
              <!-- Title Input -->
              <div>
                <label for="title" class="block text-sm font-semibold text-slate-300 mb-2">Título</label>
                <input v-model="formData.title" type="text" id="title" required
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                  placeholder="Ex: Meu GitHub" />
              </div>

              <!-- URL Input -->
              <div>
                <label for="url" class="block text-sm font-semibold text-slate-300 mb-2">URL</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <component :is="icon" class="w-5 h-5 text-slate-500" />
                  </div>
                  <input v-model="formData.url" type="text" id="url" required :placeholder="placeholder"
                    class="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200" />
                </div>
              </div>

              <div v-if="authStore.isPremium" class="space-y-4 pt-4 border-t border-slate-700/50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <ClockIcon class="w-5 h-5 text-sky-400" />
                    <h3 class="text-base font-semibold text-white">Agendamento de Link</h3>
                    <span class="px-2 py-0.5 text-xs font-bold text-sky-900 bg-sky-400 rounded-full">PREMIUM</span>
                  </div>
                  <button @click="clearSchedule" type="button" v-if="formData.scheduledAt || formData.expiresAt"
                    class="text-xs text-slate-400 hover:text-white">
                    Limpar
                  </button>
                </div>
                <p class="text-xs text-slate-400 -mt-2">
                  Defina quando este link deve aparecer e desaparecer automaticamente.
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Data de Início -->
                  <div>
                    <label for="scheduledAt" class="block text-sm font-medium text-slate-300 mb-1.5">Aparecer em</label>
                    <input v-model="formData.scheduledAt" type="datetime-local" id="scheduledAt" class="date-input"
                      placeholder="Data de início" />
                  </div>
                  <!-- Data de Fim -->
                  <div>
                    <label for="expiresAt" class="block text-sm font-medium text-slate-300 mb-1.5">Desaparecer
                      em</label>
                    <input v-model="formData.expiresAt" type="datetime-local" id="expiresAt" class="date-input"
                      placeholder="Data de fim" />
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex justify-end gap-3 pt-4">
                <button @click="close" type="button"
                  class="px-6 py-2 rounded-lg bg-slate-700/50 text-slate-200 hover:bg-slate-700 transition-all duration-200 font-medium">
                  Cancelar
                </button>
                <button type="submit"
                  class="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-amber-500/30">
                  {{ isEditing ? 'Atualizar' : 'Adicionar' }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Link } from '@/store/links';
import type { Social } from './social';
import { customLinkSocial } from './social';
import { XIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const props = defineProps<{
  isOpen: boolean;
  social: Social | null;
  editingLink: Link | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: { title: string; url: string; scheduledAt?: string | null; expiresAt?: string | null }): void;
}>();

const formData = ref({ title: '', url: '', scheduledAt: null as string | null, expiresAt: null as string | null });

const isEditing = computed(() => !!props.editingLink);
const formTitle = computed(() =>
  isEditing.value ? 'Editar Link' : `Adicionar ${props.social?.name || 'Link'}`
);
const icon = computed(() => props.social?.icon || customLinkSocial.icon);
const placeholder = computed(() => props.social?.placeholder || customLinkSocial.placeholder);

const formatDateTimeForInput = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  // Formato YYYY-MM-DDTHH:mm
  return date.toISOString().slice(0, 16);
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editingLink) {
      // 5. Formatar as datas ao carregar um link para edição
      formData.value = {
        title: props.editingLink.title,
        url: props.editingLink.url,
        scheduledAt: formatDateTimeForInput(props.editingLink.scheduledAt),
        expiresAt: formatDateTimeForInput(props.editingLink.expiresAt),
      };
    } else if (props.social) {
      formData.value = { title: props.social.name, url: '', scheduledAt: null, expiresAt: null };
    }
  } else {
    formData.value = { title: '', url: '', scheduledAt: null, expiresAt: null };
  }
});

function clearSchedule() {
  formData.value.scheduledAt = null;
  formData.value.expiresAt = null;
}

function close() {
  emit('close');
}

function submit() {
  if (!/^https?:\/\//i.test(formData.value.url)) {
    formData.value.url = 'https://' + formData.value.url;
  }
  emit('save', { ...formData.value });
}
</script>

<style scoped>
.date-input {
  @apply w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200;
  /* Estilo para o ícone do calendário */
  color-scheme: dark;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
