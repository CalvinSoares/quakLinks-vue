<template>
  <div
    class="domain-card overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 shadow-xl shadow-slate-950/40 backdrop-blur-sm">
    <!-- Header -->
    <div class="relative border-b border-slate-700/50 bg-slate-900/40 px-6 py-5">
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/[0.07] via-transparent to-transparent">
      </div>
      <div class="relative flex items-start gap-4">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
          <GlobeAltIcon class="h-6 w-6 text-sky-400" />
        </span>
        <div class="min-w-0">
          <h3 class="flex flex-wrap items-center gap-2 text-lg font-bold text-white sm:text-xl">
            {{ copy.title }}
            <span v-if="!auth.isPremium"
              class="badge-pulse inline-flex items-center gap-1 rounded-full bg-sky-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sky-950">
              <SparklesIcon class="h-3 w-3" />
              Premium
            </span>
          </h3>
          <p class="mt-1 text-sm leading-relaxed text-slate-400">{{ copy.subtitle }}</p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Premium gate -->
      <Transition name="fade" mode="out-in">
        <div v-if="!auth.isPremium" key="premium"
          class="flex flex-col items-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-10 text-center">
          <span
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/20">
            <SparklesIcon class="h-6 w-6 text-sky-400" />
          </span>
          <p class="max-w-sm text-slate-300">{{ copy.premiumOnly }}</p>
          <UpgradeToPremium class="mx-auto mt-5 max-w-xs" />
        </div>

        <div v-else-if="!currentPage" key="select"
          class="flex flex-col items-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-12 text-center text-slate-400">
          <GlobeAltIcon class="mb-3 h-8 w-8 text-slate-600" />
          {{ copy.selectPage }}
        </div>

        <div v-else key="content" class="space-y-8">
          <section class="reveal relative z-40">
            <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div class="mb-3 flex items-center gap-2">
                <LinkIcon class="h-5 w-5 text-sky-400" />
                <h4 class="text-sm font-semibold text-white">{{ copy.targetPage }}</h4>
              </div>
              <CustomDropdown v-model="selectedPageId" :options="pageDropdownOptions"
                :placeholder="copy.selectTargetPagePlaceholder"
                :disabled="isLoading || pageDropdownOptions.length === 0" trigger-class="bg-slate-950"
                menu-class="bg-slate-900" />
            </div>
          </section>

          <!-- Current page domain (hero) -->
          <section class="reveal relative z-0">
            <div
              class="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/80 to-slate-900/40 p-5 transition-all duration-300 hover:border-sky-500/30">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start gap-4">
                  <span
                    :class="currentAssignedDomain ? (currentAssignedDomain.verified ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-400 ring-amber-500/20') : 'bg-slate-800 text-slate-500 ring-slate-700'"
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1">
                    <CheckBadgeIcon v-if="currentAssignedDomain?.verified" class="h-6 w-6" />
                    <ExclamationTriangleIcon v-else-if="currentAssignedDomain" class="h-6 w-6" />
                    <LinkIcon v-else class="h-6 w-6" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {{ copy.currentPageDomain }}
                    </p>
                    <div v-if="currentAssignedDomain" class="mt-1.5 flex flex-wrap items-center gap-2">
                      <span class="break-all font-mono text-base font-medium text-white">{{ currentAssignedDomain.domain
                      }}</span>
                      <span
                        :class="currentAssignedDomain.verified ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'"
                        class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                        <span class="h-1.5 w-1.5 rounded-full"
                          :class="currentAssignedDomain.verified ? 'bg-emerald-400' : 'bg-amber-400'"></span>
                        {{ currentAssignedDomain.verified ? copy.verified : copy.pending }}
                      </span>
                    </div>
                    <p v-else class="mt-1.5 text-sm text-slate-400">{{ copy.noDomainAssigned }}</p>
                    <p v-if="selectedPage" class="mt-2 text-xs text-slate-500">
                      {{ copy.selectedPageLabel }} <span class="text-slate-300">{{ selectedPage.title ||
                        selectedPage.slug }}</span>
                    </p>
                  </div>
                </div>

                <div v-if="currentAssignedDomain" class="flex flex-wrap gap-2">
                  <button v-if="!currentAssignedDomain.verified" type="button" :disabled="isLoading"
                    class="btn-press inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-500 disabled:bg-slate-700"
                    @click="handleVerifyDomain(currentAssignedDomain.id)">
                    <CheckBadgeIcon class="h-4 w-4" />
                    {{ copy.verifyNow }}
                  </button>
                  <button type="button" :disabled="isLoading"
                    class="btn-press rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-60"
                    @click="handleUnassignDomain(currentAssignedDomain.id)">
                    {{ copy.unassign }}
                  </button>
                  <button type="button" :disabled="isLoading"
                    class="btn-press inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                    :title="copy.removeDomain" :aria-label="copy.removeDomain"
                    @click="openDeleteModal(currentAssignedDomain)">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- DNS instructions -->
          <Transition name="expand">
            <section v-if="currentAssignedDomain && !currentAssignedDomain.verified"
              class="reveal overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/[0.07]">
              <div class="flex items-center gap-2 border-b border-amber-500/20 px-4 py-3">
                <span class="relative flex h-2.5 w-2.5">
                  <span
                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                </span>
                <p class="text-sm font-semibold text-amber-300">{{ copy.actionRequired }}</p>
              </div>
              <div class="space-y-3 p-4 text-sm">
                <p class="text-slate-300">{{ copy.dnsInstruction }}</p>
                <dl class="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-sm">
                  <div class="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-2.5">
                    <dt class="text-slate-500">{{ copy.dnsType }}</dt>
                    <dd class="text-slate-200">CNAME</dd>
                  </div>
                  <div class="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-2.5">
                    <dt class="shrink-0 text-slate-500">{{ copy.dnsHost }}</dt>
                    <dd class="truncate text-right text-slate-200">{{ copy.dnsHostValue }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-3 px-4 py-2.5">
                    <dt class="text-slate-500">{{ copy.dnsValue }}</dt>
                    <dd class="break-all text-right text-sky-300">{{ appDomain }}</dd>
                  </div>
                </dl>
                <p class="text-xs text-slate-500">{{ copy.dnsPropagation }}</p>
              </div>
            </section>
          </Transition>

          <!-- Register / assign grid -->
          <div class="reveal relative z-30 grid gap-5 lg:grid-cols-2" style="animation-delay: 60ms">
            <!-- Add new domain -->
            <form
              class="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 focus-within:border-sky-500/40"
              @submit.prevent="handleAddDomain">
              <div class="mb-3 flex items-center gap-2">
                <PlusCircleIcon class="h-5 w-5 text-sky-400" />
                <h4 class="text-sm font-semibold text-white">{{ copy.addNewDomain }}</h4>
              </div>
              <input v-model="domainInput" type="text" :placeholder="copy.domainPlaceholder" :disabled="isLoading"
                class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
              <label class="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input v-model="assignOnCreate" type="checkbox" :disabled="isLoading"
                  class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500/30" />
                {{ copy.assignOnCreate }}
              </label>
              <button type="submit" :disabled="isLoading || !domainInput.trim() || (assignOnCreate && !selectedPageId)"
                class="btn-press mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-colors hover:bg-sky-500 disabled:bg-slate-700 disabled:shadow-none">
                <span v-if="isLoading"
                  class="spinner h-4 w-4 rounded-full border-2 border-white/30 border-t-white"></span>
                {{ isLoading ? copy.adding : copy.add }}
              </button>
            </form>

            <!-- Assign existing -->
            <div class="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div class="mb-3 flex items-center gap-2">
                <LinkIcon class="h-5 w-5 text-sky-400" />
                <h4 class="text-sm font-semibold text-white">{{ copy.selectExisting }}</h4>
              </div>
              <CustomDropdown v-model="selectedDomainId" :options="domainDropdownOptions"
                :placeholder="copy.selectExistingPlaceholder"
                :disabled="isLoading || domainDropdownOptions.length === 0" />
              <button type="button" :disabled="isLoading || !selectedDomainId || !selectedPageId"
                class="btn-press mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-slate-700 transition-colors hover:bg-slate-700 disabled:opacity-50 lg:mt-auto"
                @click="handleAssignSelectedDomain">
                <LinkIcon class="h-4 w-4" />
                {{ copy.assignToPage }}
              </button>
            </div>
          </div>

          <!-- My domains -->
          <section class="reveal relative z-0 space-y-4" style="animation-delay: 120ms">
            <div class="flex items-center justify-between gap-3">
              <h4 class="flex items-center gap-2 text-sm font-semibold text-white">
                {{ copy.myDomains }}
                <span class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-400">{{
                  ownedDomains.length }}</span>
              </h4>
              <button type="button" :disabled="isLoading"
                class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-sky-300 transition-colors hover:bg-sky-500/10 hover:text-sky-200 disabled:text-slate-500"
                @click="loadDomains">
                <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
                {{ copy.refresh }}
              </button>
            </div>

            <div v-if="ownedDomains.length === 0"
              class="flex flex-col items-center rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center text-sm text-slate-400">
              <GlobeAltIcon class="mb-3 h-8 w-8 text-slate-600" />
              {{ copy.emptyDomains }}
            </div>

            <TransitionGroup v-else name="list" tag="div" class="space-y-3">
              <div v-for="domain in ownedDomains" :key="domain.id"
                class="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/60">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex min-w-0 items-start gap-3">
                    <span
                      :class="domain.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'"
                      class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <CheckBadgeIcon v-if="domain.verified" class="h-5 w-5" />
                      <ExclamationTriangleIcon v-else class="h-5 w-5" />
                    </span>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="break-all font-mono text-sm font-medium text-white">{{ domain.domain }}</span>
                        <span
                          :class="domain.verified ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'"
                          class="rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                          {{ domain.verified ? copy.verified : copy.pending }}
                        </span>
                        <span
                          :class="domain.pageId === selectedPage?.id ? 'border-sky-500/30 bg-sky-500/10 text-sky-300' : 'border-slate-700 bg-slate-800 text-slate-300'"
                          class="rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                          {{ resolveAssignmentLabel(domain) }}
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-slate-400">{{ resolveAssignmentDescription(domain) }}</p>
                    </div>
                  </div>

                  <div
                    class="flex shrink-0 flex-wrap gap-2 lg:opacity-80 lg:transition-opacity lg:group-hover:opacity-100">
                    <button v-if="domain.pageId !== selectedPage?.id" type="button"
                      :disabled="isLoading || !selectedPageId"
                      class="btn-press rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-sky-500/40 hover:text-white disabled:opacity-60"
                      @click="handleAssignDomain(domain.id)">
                      {{ copy.assignToPage }}
                    </button>
                    <button v-else type="button" :disabled="isLoading"
                      class="btn-press rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-60"
                      @click="handleUnassignDomain(domain.id)">
                      {{ copy.unassign }}
                    </button>
                    <button v-if="!domain.verified" type="button" :disabled="isLoading"
                      class="btn-press rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 disabled:opacity-60"
                      @click="handleVerifyDomain(domain.id)">
                      {{ copy.verifyNow }}
                    </button>
                    <button type="button" :disabled="isLoading"
                      class="btn-press inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                      :title="copy.removeDomain" :aria-label="copy.removeDomain" @click="openDeleteModal(domain)">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </section>

          <Transition name="fade">
            <p v-if="error"
              class="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <ExclamationTriangleIcon class="h-4 w-4 shrink-0" />
              {{ error }}
            </p>
          </Transition>
        </div>
      </Transition>
    </div>

    <ConfirmationModal :is-open="isRemoveDomainModalOpen" :title="copy.removeDomainTitle"
      :description="copy.removeConfirm(domainPendingDeletion?.domain || '')" :cancel-label="copy.cancel"
      :confirm-label="copy.removeDomainConfirm" :loading-label="copy.removing" :is-loading="isLoading"
      @close="closeRemoveDomainModal" @confirm="confirmRemoveDomain" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  GlobeAltIcon,
  ArrowPathIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { toast } from "vue-sonner";
import { useAppLanguage } from "@/composables/useAppLanguage";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import CustomDropdown from "@/components/ui/CustomDropdown.vue";
import UpgradeToPremium from "../dashboard/UpgradeToPremium.vue";
import { useAuthStore } from "@/store/auth";
import { usePageStore } from "@/store/page";
import { useUserStore, type CustomDomainResponse } from "@/store/user";
import type { DropdownOption } from "@/types/dropdown";

const auth = useAuthStore();
const pageStore = usePageStore();
const userStore = useUserStore();
const { locale } = useAppLanguage();

const domainInput = ref("");
const selectedDomainId = ref("");
const selectedPageId = ref("");
const assignOnCreate = ref(true);
const isLoading = ref(false);
const isRemoveDomainModalOpen = ref(false);
const error = ref<string | null>(null);
const ownedDomains = ref<CustomDomainResponse[]>([]);
const domainPendingDeletion = ref<CustomDomainResponse | null>(null);

const currentPage = computed(() => pageStore.currentPage);
const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.host;
const availablePages = computed(() => pageStore.userPages);
const selectedPage = computed(() => {
  if (!selectedPageId.value) {
    return null;
  }

  return (
    pageStore.userPages.find((page) => page.id === selectedPageId.value) ??
    (currentPage.value?.id === selectedPageId.value ? currentPage.value : null)
  );
});

const currentAssignedDomain = computed(() => {
  if (!selectedPage.value?.id) {
    return null;
  }

  return ownedDomains.value.find((domain) => domain.pageId === selectedPage.value?.id) ?? null;
});

const selectableDomains = computed(() => ownedDomains.value.filter((domain) => domain.id !== currentAssignedDomain.value?.id));
const pageDropdownOptions = computed<DropdownOption[]>(() =>
  availablePages.value.map((page) => ({
    value: page.id,
    label: buildPageOptionLabel(page),
  })),
);
const domainDropdownOptions = computed<DropdownOption[]>(() =>
  selectableDomains.value.map((domain) => ({
    value: domain.id,
    label: buildDomainOptionLabel(domain),
  })),
);

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return {
        title: "Custom Domain",
        subtitle: "Register your domains once and assign them to any page when needed.",
        premiumOnly: "This feature is available on the Premium plan.",
        selectPage: "Select a page to manage its domain.",
        targetPage: "Target page",
        selectTargetPagePlaceholder: "Choose the page that will use this domain",
        currentPageDomain: "Current page domain",
        noDomainAssigned: "No domain assigned to this page yet.",
        selectedPageLabel: "Selected page:",
        selectExisting: "Use an existing domain",
        selectExistingPlaceholder: "Choose a registered domain",
        assignToPage: "Assign to page",
        assignOnCreate: "Assign the new domain to the current page right away",
        addNewDomain: "Register new domain",
        domainPlaceholder: "links.mysite.com",
        adding: "Saving...",
        add: "Save domain",
        myDomains: "My domains",
        refresh: "Refresh",
        emptyDomains: "You have not registered any custom domains yet.",
        verified: "Verified",
        pending: "Pending DNS",
        currentPageBadge: "Assigned to this page",
        otherPageBadge: "Assigned elsewhere",
        unassignedBadge: "Unassigned",
        assignedHereDescription: "This domain is currently active on the selected page.",
        assignedOtherDescription: "This domain is linked to another page and can be moved here.",
        unassignedDescription: "This domain is available to be linked to any page.",
        removeDomain: "Delete",
        unassign: "Unassign",
        actionRequired: "Action required",
        dnsInstruction: "Configure the CNAME record below in your DNS provider before verification.",
        dnsType: "Type",
        dnsHost: "Host/Name",
        dnsHostValue: "@ (or the subdomain you entered, like 'links')",
        dnsValue: "Value/Points to",
        dnsPropagation: "DNS propagation may take a few hours.",
        verifyNow: "Verify now",
        domainAdded: "Domain saved successfully.",
        domainAssigned: "Domain assigned to the current page.",
        domainUnassigned: "Domain unassigned successfully.",
        domainDeleted: "Domain deleted successfully.",
        removeConfirm: (domain: string) => `Are you sure you want to delete the domain "${domain}"?`,
        removeDomainTitle: "Delete custom domain",
        removeDomainConfirm: "Delete domain",
        removing: "Deleting...",
        cancel: "Cancel",
      };
    case "es":
      return {
        title: "Dominio Personalizado",
        subtitle: "Registra tus dominios una vez y asígnalos a cualquier página cuando lo necesites.",
        premiumOnly: "Esta funcionalidad está disponible en el plan Premium.",
        selectPage: "Selecciona una página para administrar su dominio.",
        targetPage: "Página destino",
        selectTargetPagePlaceholder: "Elige la página que usará este dominio",
        currentPageDomain: "Dominio de la página actual",
        noDomainAssigned: "Todavía no hay un dominio vinculado a esta página.",
        selectedPageLabel: "Página seleccionada:",
        selectExisting: "Usar un dominio existente",
        selectExistingPlaceholder: "Elige un dominio registrado",
        assignToPage: "Vincular a la página",
        assignOnCreate: "Vincular el nuevo dominio a la página actual inmediatamente",
        addNewDomain: "Registrar nuevo dominio",
        domainPlaceholder: "links.misitio.com",
        adding: "Guardando...",
        add: "Guardar dominio",
        myDomains: "Mis dominios",
        refresh: "Actualizar",
        emptyDomains: "Todavía no registraste dominios personalizados.",
        verified: "Verificado",
        pending: "DNS pendiente",
        currentPageBadge: "Vinculado a esta página",
        otherPageBadge: "Vinculado en otra página",
        unassignedBadge: "Sin vínculo",
        assignedHereDescription: "Este dominio está activo en la página seleccionada.",
        assignedOtherDescription: "Este dominio está vinculado a otra página y puede moverse aquí.",
        unassignedDescription: "Este dominio está disponible para vincularse a cualquier página.",
        removeDomain: "Eliminar",
        unassign: "Desvincular",
        actionRequired: "Acción necesaria",
        dnsInstruction: "Configura el registro CNAME abajo en tu proveedor DNS antes de verificar.",
        dnsType: "Tipo",
        dnsHost: "Host/Nombre",
        dnsHostValue: "@ (o el subdominio que ingresaste, como 'links')",
        dnsValue: "Valor/Apunta a",
        dnsPropagation: "La propagación DNS puede tardar algunas horas.",
        verifyNow: "Verificar ahora",
        domainAdded: "Dominio guardado con éxito.",
        domainAssigned: "Dominio vinculado a la página actual.",
        domainUnassigned: "Dominio desvinculado con éxito.",
        domainDeleted: "Dominio eliminado con éxito.",
        removeConfirm: (domain: string) => `¿Seguro que deseas eliminar el dominio "${domain}"?`,
        removeDomainTitle: "Eliminar dominio personalizado",
        removeDomainConfirm: "Eliminar dominio",
        removing: "Eliminando...",
        cancel: "Cancelar",
      };
    default:
      return {
        title: "Domínio Personalizado",
        subtitle: "Cadastre seus domínios uma vez e vincule cada um à página que precisar.",
        premiumOnly: "Esta funcionalidade está disponível no plano Premium.",
        selectPage: "Selecione uma página para gerenciar o domínio.",
        targetPage: "Página de destino",
        selectTargetPagePlaceholder: "Escolha a página que vai usar este domínio",
        currentPageDomain: "Domínio da página atual",
        noDomainAssigned: "Nenhum domínio vinculado a esta página ainda.",
        selectedPageLabel: "Página selecionada:",
        selectExisting: "Usar domínio já cadastrado",
        selectExistingPlaceholder: "Escolha um domínio cadastrado",
        assignToPage: "Vincular à página",
        assignOnCreate: "Vincular o novo domínio à página atual imediatamente",
        addNewDomain: "Cadastrar novo domínio",
        domainPlaceholder: "links.meusite.com",
        adding: "Salvando...",
        add: "Salvar domínio",
        myDomains: "Meus domínios",
        refresh: "Atualizar",
        emptyDomains: "Você ainda não cadastrou nenhum domínio customizado.",
        verified: "Verificado",
        pending: "DNS pendente",
        currentPageBadge: "Vinculado a esta página",
        otherPageBadge: "Vinculado em outra página",
        unassignedBadge: "Sem vínculo",
        assignedHereDescription: "Este domínio está ativo na página selecionada.",
        assignedOtherDescription: "Este domínio está vinculado a outra página e pode ser movido para cá.",
        unassignedDescription: "Este domínio está disponível para ser vinculado a qualquer página.",
        removeDomain: "Excluir",
        unassign: "Desvincular",
        actionRequired: "Ação necessária",
        dnsInstruction: "Configure o registro CNAME abaixo no seu provedor DNS antes de verificar.",
        dnsType: "Tipo",
        dnsHost: "Host/Nome",
        dnsHostValue: "@ (ou o subdomínio informado, como 'links')",
        dnsValue: "Valor/Aponta para",
        dnsPropagation: "A propagação de DNS pode levar algumas horas.",
        verifyNow: "Verificar agora",
        domainAdded: "Domínio salvo com sucesso.",
        domainAssigned: "Domínio vinculado à página atual.",
        domainUnassigned: "Domínio desvinculado com sucesso.",
        domainDeleted: "Domínio excluído com sucesso.",
        removeConfirm: (domain: string) => `Tem certeza que deseja excluir o domínio "${domain}"?`,
        removeDomainTitle: "Excluir domínio personalizado",
        removeDomainConfirm: "Excluir domínio",
        removing: "Excluindo...",
        cancel: "Cancelar",
      };
  }
});

onMounted(() => {
  void loadDomains();
});

watch(
  () => currentPage.value?.id,
  () => {
    error.value = null;
    selectedDomainId.value = "";
    if (currentPage.value?.id) {
      selectedPageId.value = currentPage.value.id;
    }
    void loadDomains();
  },
  { immediate: true },
);

async function loadDomains() {
  if (!auth.isPremium || !currentPage.value?.id) {
    ownedDomains.value = [];
    return;
  }

  try {
    if (pageStore.userPages.length === 0) {
      await pageStore.fetchUserPages();
    }

    if (!selectedPageId.value) {
      selectedPageId.value = currentPage.value?.id ?? pageStore.userPages[0]?.id ?? "";
    }

    ownedDomains.value = await userStore.listOwnedDomains();
  } catch (e: any) {
    error.value = e.message;
  }
}

function resolvePageName(pageId: string | null) {
  if (!pageId) {
    return null;
  }

  const matchedPage = pageStore.userPages.find((page) => page.id === pageId);
  if (matchedPage) {
    return matchedPage.title || matchedPage.slug;
  }

  if (currentPage.value?.id === pageId) {
    return currentPage.value.title || currentPage.value.slug;
  }

  return null;
}

function resolveAssignmentLabel(domain: CustomDomainResponse) {
  if (domain.pageId === selectedPage.value?.id) {
    return copy.value.currentPageBadge;
  }

  if (domain.pageId) {
    return copy.value.otherPageBadge;
  }

  return copy.value.unassignedBadge;
}

function resolveAssignmentDescription(domain: CustomDomainResponse) {
  if (domain.pageId === selectedPage.value?.id) {
    return copy.value.assignedHereDescription;
  }

  if (domain.pageId) {
    const pageName = resolvePageName(domain.pageId);
    return pageName
      ? `${copy.value.assignedOtherDescription} (${pageName})`
      : copy.value.assignedOtherDescription;
  }

  return copy.value.unassignedDescription;
}

function buildDomainOptionLabel(domain: CustomDomainResponse) {
  const pageName = resolvePageName(domain.pageId);
  return pageName ? `${domain.domain} - ${pageName}` : domain.domain;
}

function buildPageOptionLabel(page: { title?: string; slug: string; primaryPage?: boolean }) {
  const label = page.title || page.slug;
  return page.primaryPage ? `${label} - Principal` : label;
}

async function handleAddDomain() {
  if (!domainInput.value.trim()) {
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    await userStore.addOwnedDomain(
      domainInput.value.trim(),
      assignOnCreate.value ? selectedPageId.value || null : null,
    );
    domainInput.value = "";
    selectedDomainId.value = "";
    toast.success(copy.value.domainAdded);
    await loadDomains();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleAssignSelectedDomain() {
  if (!selectedDomainId.value) {
    return;
  }

  await handleAssignDomain(selectedDomainId.value);
}

async function handleAssignDomain(domainId: string) {
  if (!selectedPageId.value) {
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    await userStore.assignOwnedDomain(domainId, selectedPageId.value);
    selectedDomainId.value = "";
    toast.success(copy.value.domainAssigned);
    await loadDomains();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleUnassignDomain(domainId: string) {
  isLoading.value = true;
  error.value = null;
  try {
    await userStore.unassignOwnedDomain(domainId);
    selectedDomainId.value = "";
    toast.success(copy.value.domainUnassigned);
    await loadDomains();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleVerifyDomain(domainId: string) {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await userStore.verifyOwnedDomain(domainId);
    toast.success(result.message);
    await loadDomains();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(domain: CustomDomainResponse) {
  domainPendingDeletion.value = domain;
  isRemoveDomainModalOpen.value = true;
}

function closeRemoveDomainModal() {
  if (isLoading.value) {
    return;
  }

  isRemoveDomainModalOpen.value = false;
  domainPendingDeletion.value = null;
}

async function confirmRemoveDomain() {
  if (!domainPendingDeletion.value) {
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    await userStore.deleteOwnedDomain(domainPendingDeletion.value.id);
    toast.success(copy.value.domainDeleted);
    isRemoveDomainModalOpen.value = false;
    domainPendingDeletion.value = null;
    selectedDomainId.value = "";
    await loadDomains();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Entrance for the whole card */
.domain-card {
  animation: card-in 0.4s ease both;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered reveal for inner blocks */
.reveal {
  animation: reveal-up 0.45s ease both;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button press feedback */
.btn-press {
  will-change: transform;
}

.btn-press:not(:disabled):active {
  transform: scale(0.96);
}

/* Premium badge subtle pulse */
.badge-pulse {
  animation: badge-pulse 2.4s ease-in-out infinite;
}

@keyframes badge-pulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.45);
  }

  50% {
    box-shadow: 0 0 0 6px rgba(56, 189, 248, 0);
  }
}

/* Inline loading spinner */
.spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Expand transition for DNS panel */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
  max-height: 400px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}

/* List transitions for domain items */
.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.list-move {
  transition: transform 0.35s ease;
}

@media (prefers-reduced-motion: reduce) {

  .domain-card,
  .reveal,
  .badge-pulse,
  .spinner {
    animation: none;
  }
}
</style>
