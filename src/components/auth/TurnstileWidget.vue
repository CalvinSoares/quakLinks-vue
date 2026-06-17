<template>
  <div v-if="siteKey" class="space-y-2">
    <div ref="containerRef" class="flex justify-center"></div>
    <p v-if="errorMessage" class="text-center text-xs text-amber-300">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    resetKey?: number;
  }>(),
  {
    resetKey: 0,
  },
);

const model = defineModel<string | null>({ default: null });
const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
const containerRef = ref<HTMLDivElement | null>(null);
const widgetId = ref<string | number | null>(null);
const errorMessage = ref("");

type TurnstileGlobal = {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string | number;
  reset: (widgetId?: string | number) => void;
  remove?: (widgetId?: string | number) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileGlobal;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

const loadTurnstileScript = () => {
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-script="true"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstileScript = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar Turnstile"));
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
};

const renderWidget = async () => {
  if (!siteKey || !containerRef.value) {
    return;
  }

  try {
    errorMessage.value = "";
    model.value = null;
    await loadTurnstileScript();
    if (!window.turnstile || !containerRef.value) {
      throw new Error("Turnstile indisponivel");
    }

    if (widgetId.value != null && window.turnstile.remove) {
      window.turnstile.remove(widgetId.value);
      widgetId.value = null;
    }

    widgetId.value = window.turnstile.render(containerRef.value, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token) => {
        model.value = token;
        errorMessage.value = "";
      },
      "expired-callback": () => {
        model.value = null;
      },
      "error-callback": () => {
        model.value = null;
        errorMessage.value = "Nao foi possivel carregar o desafio anti-bot.";
      },
    });
  } catch (error) {
    model.value = null;
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Nao foi possivel carregar o desafio anti-bot.";
  }
};

watch(
  () => props.resetKey,
  () => {
    if (!siteKey) {
      return;
    }
    if (window.turnstile && widgetId.value != null) {
      model.value = null;
      errorMessage.value = "";
      window.turnstile.reset(widgetId.value);
      return;
    }
    void renderWidget();
  },
);

onMounted(() => {
  void renderWidget();
});

onBeforeUnmount(() => {
  if (window.turnstile && widgetId.value != null && window.turnstile.remove) {
    window.turnstile.remove(widgetId.value);
  }
});
</script>
