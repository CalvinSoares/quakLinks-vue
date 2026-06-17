<template>
  <DashboardLayout>
    <!-- Ambient animated background -->
    <div
      class="pointer-events-none fixed left-1/4 top-0 h-96 w-96 animate-float-slow rounded-full bg-amber-500/10 blur-[120px]">
    </div>
    <div
      class="pointer-events-none fixed bottom-0 right-1/4 h-96 w-96 animate-float-slower rounded-full bg-sky-500/10 blur-[140px]">
    </div>

    <div class="relative mx-auto max-w-4xl space-y-6 pb-12">
      <!-- Compact header -->
      <header class="reveal flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300"></span>
            {{ copy.pageBadge }}
          </div>
          <div class="flex items-center gap-2 text-sm font-medium text-slate-400">
            <span class="flex h-2 w-2 rounded-full"
              :class="isPremiumPlan ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"></span>
            {{ currentPlanName }} · {{ billingStatusLabel }}
          </div>
        </div>

        <button v-if="!isLoadingBilling" type="button" @click="loadBilling"
          class="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 transition hover:border-slate-500 hover:text-white">
          {{ copy.billing.reload }}
        </button>
        <span v-else class="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span class="spinner h-3.5 w-3.5 rounded-full border-2 border-slate-600 border-t-amber-400"></span>
          {{ copy.billing.loading }}
        </span>
      </header>

      <!-- Checkout / billing feedback -->
      <Transition name="slide-fade">
        <div v-if="checkoutFeedback" class="reveal rounded-2xl border px-4 py-3 text-sm" :class="checkoutFeedback.tone === 'success'
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
          : checkoutFeedback.tone === 'warning'
            ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
            : 'border-sky-500/20 bg-sky-500/10 text-sky-100'">
          <p class="font-semibold">{{ checkoutFeedback.title }}</p>
          <p class="mt-1 text-sm/6 opacity-90">{{ checkoutFeedback.message }}</p>
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div v-if="billingError"
          class="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ billingError }}
        </div>
      </Transition>

      <!-- Compact plan tiers -->
      <section class="grid gap-5 sm:grid-cols-2">
        <article v-for="(tier, index) in localizedPlanTiers" :key="tier.id"
          class="reveal group relative flex flex-col overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1"
          :class="tier.highlight
            ? 'border-amber-500/40 bg-amber-500/[0.07] hover:border-amber-400/60 hover:shadow-[0_16px_50px_rgba(245,158,11,0.18)]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'"
          :style="{ animationDelay: `${index * 80}ms` }">
          <div v-if="tier.highlight"
            class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/25 blur-3xl transition-opacity duration-500 group-hover:opacity-90">
          </div>

          <!-- Header: name + price -->
          <div class="relative flex items-center justify-between gap-3">
            <h2 class="text-xl font-black text-white">{{ tier.name }}</h2>
            <span v-if="tier.id === 'premium' && isPremiumPlan"
              class="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
              {{ currentPlanBadgeText }}
            </span>
          </div>

          <p class="relative mt-1 text-3xl font-black tracking-tight"
            :class="tier.highlight ? 'text-amber-300' : 'text-white'">
            {{ tier.priceLabel }}
          </p>

          <!-- Compact feature list -->
          <ul class="relative mt-5 flex-1 space-y-2.5">
            <li v-for="(feature, fIndex) in tierFeatureRows(tier.id)" :key="feature.label"
              class="reveal flex items-center gap-2.5 text-sm"
              :class="feature.enabled ? 'text-slate-200' : 'text-slate-500'"
              :style="{ animationDelay: `${index * 80 + fIndex * 30}ms` }">
              <span
                class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-transform duration-200 group-hover:scale-110"
                :class="feature.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-600'">
                {{ feature.enabled ? "✓" : "—" }}
              </span>
              {{ feature.label }}
            </li>
          </ul>

          <!-- CTA -->
          <div class="relative mt-6">
            <button v-if="tier.id === 'premium' && !isPremiumPlan" type="button" @click="startCheckout"
              :disabled="isStartingCheckout"
              class="btn-press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60">
              <span v-if="isStartingCheckout"
                class="spinner h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900"></span>
              {{ isStartingCheckout ? copy.actions.startingCheckout : tier.ctaLabel }}
            </button>
            <router-link v-else-if="tier.id === 'premium' && isPremiumPlan" to="/settings"
              class="btn-press block w-full rounded-xl bg-slate-800 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-slate-700">
              {{ copy.actions.manageAccount }}
            </router-link>
            <button v-else type="button" disabled
              class="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-400">
              {{ isPremiumPlan ? tier.ctaLabel : copy.actions.currentPlan }}
            </button>
          </div>
        </article>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { useAppLanguage } from "@/composables/useAppLanguage";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { planFeatures, planTiers } from "@/constants/plans";
import { useAuthStore } from "@/store/auth";
import {
  useUserStore,
  type BillingStatusResponse,
} from "@/store/user";

type PlanFeatureLabel = (typeof planFeatures)[number]["label"];

const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { locale } = useAppLanguage();

const isStartingCheckout = ref(false);
const isLoadingBilling = ref(true);
const billingError = ref<string | null>(null);
const billingStatus = ref<BillingStatusResponse | null>(null);
const checkoutFeedback = ref<{
  tone: "success" | "warning" | "info";
  title: string;
  message: string;
} | null>(null);

const translations = {
  pt: {
    pageBadge: "Planos",
    languageLabel: "Idioma",
    heroTitle: "Escolha o plano certo para liberar todos os recursos do QuakLinks",
    heroDescription:
      "Agora existe um lugar claro para ver o que o plano Free inclui, o que o Premium libera e como iniciar o upgrade sem ficar cacando CTA pelo sistema.",
    premiumHighlights: [
      "Remova friccao ao desbloquear video, audio, cursor e dominio personalizado.",
      "Ganhe recursos pensados para paginas mais ricas e com mais identidade visual.",
      "Tenha um caminho unico de upgrade em vez de descobrir o plano por tentativa e erro.",
    ],
    currentPlanCard: {
      eyebrow: "Plano atual",
      premiumDescription:
        "Sua conta ja tem acesso aos recursos premium. Voce pode continuar usando videos, audio, dominio customizado e extras avancados.",
      freeDescription:
        "Voce esta no plano Free. Faca upgrade para liberar recursos premium diretamente do checkout.",
    },
    billing: {
      status: "Status da assinatura",
      loading: "Carregando status real do billing...",
      reload: "Recarregar billing",
    },
    actions: {
      subscribePremium: "Assinar Premium",
      startingCheckout: "Iniciando checkout...",
      manageAccount: "Gerenciar conta",
      backToAppearance: "Voltar ao editor de aparencia",
      currentPlan: "Seu plano atual",
    },
    availability: {
      available: "Disponivel",
      premiumOnly: "Premium",
    },
    tiers: {
      free: {
        name: "Free",
        priceLabel: "R$ 0",
        description: "Para comecar sua pagina e publicar seus links essenciais.",
        ctaLabel: "Seu plano atual",
        pill: "Base essencial",
      },
      premium: {
        name: "Premium",
        priceLabel: "Upgrade",
        description:
          "Para destravar personalizacao avancada, midia e recursos profissionais.",
        ctaLabel: "Assinar Premium",
        pill: "Recursos avancados",
      },
    },
    features: {
      labels: {
        "Avatar e imagem de fundo": "Avatar e imagem de fundo",
        "Gradientes e estilos visuais": "Gradientes e estilos visuais",
        "Vídeo no background": "Video no background",
        "Cursor personalizado": "Cursor personalizado",
        "Playlist e player de áudio": "Playlist e player de audio",
        "Agendamento de links": "Agendamento de links",
        "Domínio personalizado": "Dominio personalizado",
        "Efeito Máquina de Escrever": "Efeito Maquina de Escrever",
        "Templates e assets premium": "Templates e assets premium",
      },
      descriptions: {
        "Avatar e imagem de fundo": "Base visual essencial para qualquer pagina.",
        "Gradientes e estilos visuais": "Personalizacao visual disponivel desde o plano inicial.",
        "Vídeo no background": "Use capa animada e video de fundo.",
        "Cursor personalizado": "Adicione mais identidade ao perfil.",
        "Playlist e player de áudio": "Publique musicas e trilhas diretamente na pagina.",
        "Agendamento de links": "Defina inicio e expiracao para campanhas e lancamentos.",
        "Domínio personalizado": "Conecte seu proprio dominio a pagina.",
        "Efeito Máquina de Escrever": "Exemplo de efeito premium no nome do perfil.",
        "Templates e assets premium": "Recursos avancados para aparencia e produtividade.",
      },
    },
    statusMap: {
      ACTIVE: "Ativo",
      CHECKOUT_PENDING: "Checkout pendente",
      CANCELED: "Cancelado",
      CANCELLED: "Cancelado",
      INCOMPLETE: "Incompleto",
      INCOMPLETE_EXPIRED: "Incompleto expirado",
      PAST_DUE: "Pagamento pendente",
      TRIALING: "Em teste",
      UNPAID: "Nao pago",
      PAUSED: "Pausado",
    },
    statusFallbacks: {
      noDataYet: "Sem dados ainda",
      noSubscription: "Sem assinatura",
      premiumActive: "Premium ativo",
      noActiveSubscription: "Ainda sem assinatura ativa",
    },
    checkoutFeedback: {
      activatedTitle: "Assinatura ativada",
      activatedMessage:
        "Seu retorno do checkout foi confirmado e o plano Premium ja aparece ativo nesta conta.",
      successPendingTitle: "Pagamento recebido",
      successPendingMessage:
        "O checkout retornou com sucesso. Se a assinatura ainda nao virou Premium, o webhook pode estar terminando o processamento.",
      canceledTitle: "Checkout cancelado",
      canceledMessage:
        "Nenhuma cobranca foi concluida. Voce pode revisar os beneficios e tentar novamente quando quiser.",
      toasts: {
        paymentConfirmed: "Pagamento confirmado e assinatura atualizada.",
        checkoutDone: "Checkout concluido. Atualizando status do billing.",
        paymentCanceled: "Pagamento cancelado.",
        loadBillingError: "Nao foi possivel carregar os dados de billing.",
        startPaymentError: "Nao foi possivel iniciar o pagamento.",
      },
    },
    featureValue: {
      included: "Incluido",
      notIncluded: "Nao incluido",
    },
  },
  en: {
    pageBadge: "Plans",
    languageLabel: "Language",
    heroTitle: "Choose the right plan to unlock every QuakLinks feature",
    heroDescription:
      "There is now a clear place to see what the Free plan includes, what Premium unlocks, and how to start the upgrade without hunting for CTAs across the app.",
    premiumHighlights: [
      "Remove friction when unlocking video, audio, cursor, and custom domain.",
      "Get features designed for richer pages with stronger visual identity.",
      "Use a single upgrade flow instead of discovering plan limits by trial and error.",
    ],
    currentPlanCard: {
      eyebrow: "Current plan",
      premiumDescription:
        "Your account already has access to premium features. Keep using video, audio, custom domain, and advanced extras.",
      freeDescription:
        "You are on the Free plan. Upgrade to unlock premium features directly from checkout.",
    },
    billing: {
      status: "Subscription status",
      loading: "Loading live billing status...",
      reload: "Reload billing",
    },
    actions: {
      subscribePremium: "Subscribe to Premium",
      startingCheckout: "Starting checkout...",
      manageAccount: "Manage account",
      backToAppearance: "Back to appearance editor",
      currentPlan: "Your current plan",
    },
    availability: {
      available: "Available",
      premiumOnly: "Premium",
    },
    tiers: {
      free: {
        name: "Free",
        priceLabel: "$0",
        description: "To start your page and publish your essential links.",
        ctaLabel: "Your current plan",
        pill: "Core essentials",
      },
      premium: {
        name: "Premium",
        priceLabel: "Upgrade",
        description: "Unlock advanced customization, media, and professional features.",
        ctaLabel: "Subscribe to Premium",
        pill: "Advanced features",
      },
    },
    features: {
      labels: {
        "Avatar e imagem de fundo": "Avatar and background image",
        "Gradientes e estilos visuais": "Gradients and visual styles",
        "Vídeo no background": "Background video",
        "Cursor personalizado": "Custom cursor",
        "Playlist e player de áudio": "Playlist and audio player",
        "Agendamento de links": "Link scheduling",
        "Domínio personalizado": "Custom domain",
        "Efeito Máquina de Escrever": "Typewriter effect",
        "Templates e assets premium": "Premium templates and assets",
      },
      descriptions: {
        "Avatar e imagem de fundo": "Core visual foundation for any page.",
        "Gradientes e estilos visuais": "Visual customization available from the starter plan.",
        "Vídeo no background": "Use animated cover and background video.",
        "Cursor personalizado": "Add more personality to your profile.",
        "Playlist e player de áudio": "Publish songs and audio tracks directly on the page.",
        "Agendamento de links": "Set start and expiration dates for campaigns and launches.",
        "Domínio personalizado": "Connect your own domain to the page.",
        "Efeito Máquina de Escrever": "Example of a premium profile name effect.",
        "Templates e assets premium": "Advanced resources for appearance and productivity.",
      },
    },
    statusMap: {
      ACTIVE: "Active",
      CHECKOUT_PENDING: "Checkout pending",
      CANCELED: "Canceled",
      CANCELLED: "Canceled",
      INCOMPLETE: "Incomplete",
      INCOMPLETE_EXPIRED: "Incomplete expired",
      PAST_DUE: "Past due",
      TRIALING: "Trialing",
      UNPAID: "Unpaid",
      PAUSED: "Paused",
    },
    statusFallbacks: {
      noDataYet: "No data yet",
      noSubscription: "No subscription",
      premiumActive: "Premium active",
      noActiveSubscription: "No active subscription yet",
    },
    checkoutFeedback: {
      activatedTitle: "Subscription activated",
      activatedMessage:
        "Your checkout return was confirmed and the Premium plan already appears active on this account.",
      successPendingTitle: "Payment received",
      successPendingMessage:
        "Checkout returned successfully. If the subscription is not Premium yet, the webhook may still be finishing processing.",
      canceledTitle: "Checkout canceled",
      canceledMessage:
        "No charge was completed. You can review the benefits and try again whenever you want.",
      toasts: {
        paymentConfirmed: "Payment confirmed and subscription updated.",
        checkoutDone: "Checkout completed. Updating billing status.",
        paymentCanceled: "Payment canceled.",
        loadBillingError: "Could not load billing data.",
        startPaymentError: "Could not start payment.",
      },
    },
    featureValue: {
      included: "Included",
      notIncluded: "Not included",
    },
  },
  es: {
    pageBadge: "Planes",
    languageLabel: "Idioma",
    heroTitle: "Elige el plan correcto para desbloquear todas las funciones de QuakLinks",
    heroDescription:
      "Ahora hay un lugar claro para ver lo que incluye el plan Free, lo que desbloquea Premium y como iniciar el upgrade sin buscar CTAs por todo el sistema.",
    premiumHighlights: [
      "Quita friccion al desbloquear video, audio, cursor y dominio personalizado.",
      "Obtiene funciones pensadas para paginas mas ricas y con mas identidad visual.",
      "Usa un solo flujo de upgrade en vez de descubrir limites por prueba y error.",
    ],
    currentPlanCard: {
      eyebrow: "Plan actual",
      premiumDescription:
        "Tu cuenta ya tiene acceso a las funciones premium. Puedes seguir usando video, audio, dominio personalizado y extras avanzados.",
      freeDescription:
        "Estas en el plan Free. Haz upgrade para desbloquear funciones premium directamente desde el checkout.",
    },
    billing: {
      status: "Estado de la suscripcion",
      loading: "Cargando estado real de billing...",
      reload: "Recargar billing",
    },
    actions: {
      subscribePremium: "Suscribirse a Premium",
      startingCheckout: "Iniciando checkout...",
      manageAccount: "Administrar cuenta",
      backToAppearance: "Volver al editor de apariencia",
      currentPlan: "Tu plan actual",
    },
    availability: {
      available: "Disponible",
      premiumOnly: "Premium",
    },
    tiers: {
      free: {
        name: "Free",
        priceLabel: "R$ 0",
        description: "Para empezar tu pagina y publicar tus enlaces esenciales.",
        ctaLabel: "Tu plan actual",
        pill: "Base esencial",
      },
      premium: {
        name: "Premium",
        priceLabel: "Upgrade",
        description: "Desbloquea personalizacion avanzada, medios y funciones profesionales.",
        ctaLabel: "Suscribirse a Premium",
        pill: "Funciones avanzadas",
      },
    },
    features: {
      labels: {
        "Avatar e imagem de fundo": "Avatar e imagen de fondo",
        "Gradientes e estilos visuais": "Gradientes y estilos visuales",
        "Vídeo no background": "Video de fondo",
        "Cursor personalizado": "Cursor personalizado",
        "Playlist e player de áudio": "Playlist y reproductor de audio",
        "Agendamento de links": "Programacion de enlaces",
        "Domínio personalizado": "Dominio personalizado",
        "Efeito Máquina de Escrever": "Efecto maquina de escribir",
        "Templates e assets premium": "Templates y assets premium",
      },
      descriptions: {
        "Avatar e imagem de fundo": "Base visual esencial para cualquier pagina.",
        "Gradientes e estilos visuais": "Personalizacion visual disponible desde el plan inicial.",
        "Vídeo no background": "Usa portada animada y video de fondo.",
        "Cursor personalizado": "Agrega mas identidad al perfil.",
        "Playlist e player de áudio": "Publica canciones y pistas directamente en la pagina.",
        "Agendamento de links": "Define inicio y expiracion para campanas y lanzamientos.",
        "Domínio personalizado": "Conecta tu propio dominio a la pagina.",
        "Efeito Máquina de Escrever": "Ejemplo de efecto premium para el nombre del perfil.",
        "Templates e assets premium": "Recursos avanzados para apariencia y productividad.",
      },
    },
    statusMap: {
      ACTIVE: "Activo",
      CHECKOUT_PENDING: "Checkout pendiente",
      CANCELED: "Cancelado",
      CANCELLED: "Cancelado",
      INCOMPLETE: "Incompleto",
      INCOMPLETE_EXPIRED: "Incompleto expirado",
      PAST_DUE: "Pago pendiente",
      TRIALING: "En prueba",
      UNPAID: "No pagado",
      PAUSED: "Pausado",
    },
    statusFallbacks: {
      noDataYet: "Sin datos todavia",
      noSubscription: "Sin suscripcion",
      premiumActive: "Premium activo",
      noActiveSubscription: "Aun sin suscripcion activa",
    },
    checkoutFeedback: {
      activatedTitle: "Suscripcion activada",
      activatedMessage:
        "El retorno del checkout fue confirmado y el plan Premium ya aparece activo en esta cuenta.",
      successPendingTitle: "Pago recibido",
      successPendingMessage:
        "El checkout volvio con exito. Si la suscripcion todavia no aparece como Premium, el webhook puede seguir procesandose.",
      canceledTitle: "Checkout cancelado",
      canceledMessage:
        "No se completo ningun cobro. Puedes revisar los beneficios e intentarlo de nuevo cuando quieras.",
      toasts: {
        paymentConfirmed: "Pago confirmado y suscripcion actualizada.",
        checkoutDone: "Checkout completado. Actualizando estado del billing.",
        paymentCanceled: "Pago cancelado.",
        loadBillingError: "No se pudieron cargar los datos de billing.",
        startPaymentError: "No se pudo iniciar el pago.",
      },
    },
    featureValue: {
      included: "Incluido",
      notIncluded: "No incluido",
    },
  },
}

const copy = computed(() => translations[locale.value]);

const localizedPremiumHighlights = computed(() => copy.value.premiumHighlights);
const localizedFeatureLabels = computed(
  () => copy.value.features.labels as Record<PlanFeatureLabel, string>,
);
const localizedFeatureDescriptions = computed(
  () => copy.value.features.descriptions as Record<PlanFeatureLabel, string>,
);
const localizedPlanTiers = computed(() =>
  planTiers.map((tier) => ({
    ...tier,
    ...copy.value.tiers[tier.id],
  })),
);

const featureDescriptions: Record<PlanFeatureLabel, string> = {
  "Avatar e imagem de fundo": "Base visual essencial para qualquer página.",
  "Gradientes e estilos visuais": "Personalização visual disponível desde o plano inicial.",
  "Vídeo no background": "Use capa animada e vídeo de fundo.",
  "Cursor personalizado": "Adicione mais identidade ao perfil.",
  "Playlist e player de áudio": "Publique músicas e trilhas diretamente na página.",
  "Agendamento de links": "Defina início e expiração para campanhas e lançamentos.",
  "Domínio personalizado": "Conecte seu próprio domínio à página.",
  "Efeito Máquina de Escrever": "Exemplo de efeito premium no nome do perfil.",
  "Templates e assets premium": "Recursos avançados para aparência e produtividade.",
};

function tierFeatureRows(tierId: "free" | "premium") {
  return planFeatures.map((feature) => ({
    label: localizedFeatureLabels.value[feature.label] || feature.label,
    enabled: Boolean(feature[tierId]),
    description:
      localizedFeatureDescriptions.value[feature.label] ||
      featureDescriptions[feature.label] ||
      "",
  }));
}

function formatSubscriptionStatus(status: string | null | undefined) {
  if (!status) {
    return null;
  }

  return (
    copy.value.statusMap[status as keyof typeof copy.value.statusMap] ||
    status.replace(/_/g, " ")
  );
}

const isPremiumPlan = computed(
  () => billingStatus.value?.premium || authStore.isPremium,
);

const currentPlanName = computed(() =>
  isPremiumPlan.value
    ? copy.value.tiers.premium.name
    : copy.value.tiers.free.name,
);

const currentPlanBadgeClass = computed(() =>
  isPremiumPlan.value
    ? "bg-emerald-500/15 text-emerald-300"
    : "bg-slate-800 text-slate-300",
);

const currentPlanBadgeText = computed(() => {
  if (billingStatus.value?.subscriptionStatus) {
    return formatSubscriptionStatus(billingStatus.value.subscriptionStatus);
  }

  return isPremiumPlan.value
    ? copy.value.statusMap.ACTIVE
    : copy.value.statusFallbacks.noSubscription;
});

const currentPlanDescription = computed(() =>
  isPremiumPlan.value
    ? copy.value.currentPlanCard.premiumDescription
    : copy.value.currentPlanCard.freeDescription,
);

const billingStatusLabel = computed(() => {
  if (!billingStatus.value) {
    return copy.value.statusFallbacks.noDataYet;
  }

  if (billingStatus.value.subscriptionStatus) {
    return formatSubscriptionStatus(billingStatus.value.subscriptionStatus);
  }

  return billingStatus.value.premium
    ? copy.value.statusFallbacks.premiumActive
    : copy.value.statusFallbacks.noActiveSubscription;
});

async function loadBilling() {
  isLoadingBilling.value = true;
  billingError.value = null;

  try {
    billingStatus.value = await userStore.fetchBillingStatus();
  } catch (error: any) {
    billingError.value =
      error.message || copy.value.checkoutFeedback.toasts.loadBillingError;
  } finally {
    isLoadingBilling.value = false;
  }
}

async function handleCheckoutReturn() {
  const paymentStatus =
    typeof route.query.payment === "string" ? route.query.payment : null;

  if (!paymentStatus) {
    return;
  }

  if (paymentStatus === "success") {
    await loadBilling();

    if (billingStatus.value?.premium) {
      checkoutFeedback.value = {
        tone: "success",
        title: copy.value.checkoutFeedback.activatedTitle,
        message: copy.value.checkoutFeedback.activatedMessage,
      };
      toast.success(copy.value.checkoutFeedback.toasts.paymentConfirmed);
    } else {
      checkoutFeedback.value = {
        tone: "info",
        title: copy.value.checkoutFeedback.successPendingTitle,
        message: copy.value.checkoutFeedback.successPendingMessage,
      };
      toast.success(copy.value.checkoutFeedback.toasts.checkoutDone);
    }
  } else if (paymentStatus === "cancel") {
    checkoutFeedback.value = {
      tone: "warning",
      title: copy.value.checkoutFeedback.canceledTitle,
      message: copy.value.checkoutFeedback.canceledMessage,
    };
    toast.info(copy.value.checkoutFeedback.toasts.paymentCanceled);
  }

  await router.replace({
    path: route.path,
    query: {
      ...route.query,
      payment: undefined,
    },
  });
}

async function startCheckout() {
  isStartingCheckout.value = true;
  try {
    await userStore.redirectToCheckout();
  } catch (error: any) {
    toast.error(
      error.message || copy.value.checkoutFeedback.toasts.startPaymentError,
    );
  } finally {
    isStartingCheckout.value = false;
  }
}

onMounted(() => {
  void (async () => {
    await loadBilling();
    await handleCheckoutReturn();
  })();
});
</script>

<style scoped>
/* Entrance reveal */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  animation: reveal-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating ambient blobs */
.animate-float-slow {
  animation: float 12s ease-in-out infinite;
}

.animate-float-slower {
  animation: float 16s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(20px, -24px) scale(1.08);
  }
}

/* Spinner */
.spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Button press */
.btn-press {
  transition: transform 0.12s ease;
}

.btn-press:active {
  transform: scale(0.97);
}

/* Feedback transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {

  .reveal,
  .animate-float-slow,
  .animate-float-slower,
  .spinner {
    animation: none;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>
