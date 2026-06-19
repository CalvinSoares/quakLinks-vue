<template>
  <section
    id="explore"
    ref="scrollTrack"
    class="explore-sticky-track relative h-[420vh] bg-[#050505]"
  >
    <div class="explore-sticky-pin relative h-screen w-full overflow-hidden">
      <Aurora
        class="absolute inset-0 opacity-65"
        :color-stops="activeAuroraStops"
        :amplitude="1.1"
        :blend="0.58"
        :speed="0.65"
      />

      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_78%)] pointer-events-none"
      />
      <div
        class="absolute inset-0 opacity-[0.1] pointer-events-none explore-grid"
      />

      <div
        class="relative z-10 h-full w-full flex flex-col px-4 sm:px-6 py-5 sm:py-6"
      >
        <div
          class="flex-1 min-h-0 flex items-center justify-center"
          :style="contentShellStyle"
        >
          <div
            class="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-5 sm:gap-6 lg:gap-10"
            :class="textOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'"
          >
            <!-- Texto dinâmico ao lado -->
            <div
              class="w-full lg:w-[40%] xl:w-[38%] shrink-0 relative min-h-[140px] sm:min-h-[160px] lg:min-h-[220px]"
            >
              <Transition :name="textTransitionName" mode="out-in">
                <div
                  :key="activeStep.id"
                  class="flex flex-col lg:items-start text-center lg:text-left px-1"
                >
                  <span
                    class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-amber-400/35 bg-amber-400/10 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 mx-auto lg:mx-0"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]"
                    />
                    {{ activeStep.tag }}
                  </span>

                  <div
                    class="h-px w-12 bg-gradient-to-r from-amber-400 to-amber-400/0 mb-3 mx-auto lg:mx-0"
                  />

                  <h2
                    class="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white leading-[0.98] tracking-tight"
                  >
                    {{ activeStep.titleStart }}
                    <span
                      class="block mt-1 text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] transition-colors duration-700"
                    >
                      {{ activeStep.titleHighlight }}
                    </span>
                  </h2>

                  <p
                    class="mt-3 text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 border-l-0 lg:border-l-2 lg:border-amber-400/40 lg:pl-4"
                  >
                    {{ activeStep.description }}
                  </p>
                </div>
              </Transition>
            </div>

            <!-- Preview -->
            <div
              class="relative w-full lg:flex-1 flex items-center justify-center min-h-0"
              :style="previewShellStyle"
            >
              <div
                class="absolute w-64 h-64 sm:w-72 sm:h-72 blur-[70px] opacity-20 transition-colors duration-1000 pointer-events-none"
                :style="{ backgroundColor: activeStep.themeColor }"
              />

              <Transition name="explore-preview" mode="out-in">
                <div
                  :key="activeStep.id"
                  class="relative flex items-center justify-center"
                >
                  <div
                    v-if="activeStep.viewport === 'mobile'"
                    class="relative bg-black rounded-[2.5rem] border-[8px] border-slate-900 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85)] ring-1 ring-amber-400/20 overflow-hidden"
                    :class="
                      activeStep.mobileWide
                        ? 'h-[min(58vh,520px)] sm:h-[min(64vh,540px)] w-auto aspect-[9/18.2] min-w-[210px] sm:min-w-[300px]'
                        : 'h-[min(54vh,480px)] sm:h-[min(70vh,660px)] w-auto aspect-[9/19.5] min-w-[290px] sm:min-w-[265px]'
                    "
                  >
                    <div
                      class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-b-xl z-20"
                    />
                    <img
                      :src="activeStep.image"
                      :alt="activeStep.imageAlt"
                      class="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div
                    v-else
                    class="relative w-[min(94vw,700px)] max-h-[min(66vh,550px)] sm:max-h-[min(48vh,460px)] aspect-[16/10] bg-slate-900 rounded-xl border border-amber-400/15 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
                  >
                    <div
                      class="h-7 sm:h-8 bg-slate-800/90 border-b border-amber-400/10 flex items-center px-3 gap-1.5"
                    >
                      <span class="w-2 h-2 rounded-full bg-red-500/80" />
                      <span class="w-2 h-2 rounded-full bg-amber-400/90" />
                      <span class="w-2 h-2 rounded-full bg-green-500/80" />
                      <span
                        class="ml-2 text-[10px] text-amber-200/50 font-mono truncate"
                      >
                        quacklinks.com.br/{{ activeStep.slug }}
                      </span>
                    </div>
                    <img
                      :src="activeStep.image"
                      :alt="activeStep.imageAlt"
                      class="w-full h-[calc(100%-1.75rem)] sm:h-[calc(100%-2rem)] object-cover object-top bg-black"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Progresso fixo na parte inferior visível -->
        <div class="shrink-0 flex flex-col items-center gap-2 pt-2 pb-1">
          <div
            class="flex items-center px-2 py-2 rounded-full border border-amber-400/15 bg-black/30 backdrop-blur-md"
          >
            <template v-for="(step, index) in steps" :key="`dot-${step.id}`">
              <button
                type="button"
                class="group relative flex items-center justify-center p-1"
                :aria-label="step.tag"
                @click="scrollToStep(index)"
              >
                <span
                  class="block rounded-full transition-all duration-500 ease-out"
                  :class="
                    activeIndex === index
                      ? 'w-3 h-3 ring-4 ring-amber-400/25 bg-amber-400'
                      : index < activeIndex
                        ? 'w-2.5 h-2.5 bg-amber-400/70'
                        : 'w-2 h-2 bg-white/20 hover:bg-amber-400/40'
                  "
                />
              </button>

              <div
                v-if="index < steps.length - 1"
                class="relative w-8 sm:w-12 h-[2px] mx-1 rounded-full bg-white/10 overflow-hidden"
              >
                <div
                  class="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out bg-gradient-to-r from-amber-400 to-amber-300"
                  :style="{
                    width: `${connectorProgress(index) * 100}%`,
                    boxShadow:
                      connectorProgress(index) > 0
                        ? '0 0 10px rgba(251,191,36,0.55)'
                        : undefined,
                  }"
                />
              </div>
            </template>
          </div>

          <p
            class="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-amber-400/55"
          >
            {{ copy.scrollHint }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import Aurora from "@/components/vue-bits/Aurora.vue";
import { useAppLanguage } from "@/composables/useAppLanguage";

type Viewport = "mobile" | "desktop";

interface ExploreStep {
  id: string;
  tag: string;
  titleStart: string;
  titleHighlight: string;
  description: string;
  viewport: Viewport;
  image: string;
  imageAlt: string;
  slug: string;
  themeColor: string;
  auroraStops: [string, string, string];
  mobileWide?: boolean;
}

const emit = defineEmits<{
  "explore-active": [active: boolean];
}>();

const activeIndex = ref(0);
const scrollTrack = ref<HTMLElement | null>(null);
const sectionProgress = ref(0);
let exploreActive = false;

const { locale } = useAppLanguage();

const copy = computed(() => {
  switch (locale.value) {
    case "en":
      return { scrollHint: "Scroll to explore" };
    case "es":
      return { scrollHint: "Desplázate para explorar" };
    default:
      return { scrollHint: "Role para explorar" };
  }
});

const steps = computed<ExploreStep[]>(() => {
  const yellow = "#fbbf24";
  const yellowDeep = "#f59e0b";

  switch (locale.value) {
    case "en":
      return [
        {
          id: "mobile-glass",
          tag: "Mobile · Glass",
          titleStart: "Profiles that",
          titleHighlight: "feel alive",
          description:
            "Frosted cards over immersive photos. Clean layout, strong identity — exactly what visitors see on your QuackLinks page.",
          viewport: "mobile",
          image: "/page-mobile2.jpeg",
          imageAlt:
            "QuackLinks mobile page with glassmorphism over a purple lake background",
          slug: "mars",
          themeColor: "#c084fc",
          auroraStops: [yellow, "#050505", "#c084fc"],
          mobileWide: true,
        },
        {
          id: "mobile-brand",
          tag: "Mobile · Brand",
          titleStart: "Built to",
          titleHighlight: "convert",
          description:
            "Bold typography, pixel backgrounds and clear CTAs — perfect for partnerships, media kits and link campaigns.",
          viewport: "mobile",
          image: "/page-mobile1.jpeg",
          imageAlt:
            "QuackLinks mobile page for brand partnerships with pixel-art background",
          slug: "eitar",
          themeColor: "#2dd4bf",
          auroraStops: [yellowDeep, "#050505", "#14b8a6"],
        },
        {
          id: "desktop-neon",
          tag: "Desktop · Neon",
          titleStart: "Neon energy",
          titleHighlight: "on big screens",
          description:
            "Video backgrounds, cyberpunk palettes and social blocks that pop on desktop — without sacrificing speed.",
          viewport: "desktop",
          image: "/page-desktop2.png",
          imageAlt:
            "QuackLinks desktop page with neon cyberpunk city background",
          slug: "la-ele",
          themeColor: "#f472b6",
          auroraStops: ["#ec4899", "#050505", yellow],
        },
        {
          id: "desktop-art",
          tag: "Desktop · Art",
          titleStart: "Artistic worlds",
          titleHighlight: "your way",
          description:
            "Cinematic backgrounds, custom icons and profile cards that tell a story — real pages created with QuackLinks.",
          viewport: "desktop",
          image: "/page-desktop1.png",
          imageAlt:
            "QuackLinks desktop page with fantasy moon landscape background",
          slug: "hori7241",
          themeColor: yellow,
          auroraStops: [yellowDeep, "#050505", "#6366f1"],
        },
      ];
    case "es":
      return [
        {
          id: "mobile-glass",
          tag: "Mobile · Glass",
          titleStart: "Perfiles que",
          titleHighlight: "respiran estilo",
          description:
            "Tarjetas de vidrio sobre fotos inmersivas. Layout limpio e identidad fuerte — lo que tus visitantes ven en QuackLinks.",
          viewport: "mobile",
          image: "/page-mobile2.jpeg",
          imageAlt:
            "Página móvil QuackLinks con glassmorphism sobre lago púrpura",
          slug: "mars",
          themeColor: "#c084fc",
          auroraStops: [yellow, "#050505", "#c084fc"],
          mobileWide: true,
        },
        {
          id: "mobile-brand",
          tag: "Mobile · Marca",
          titleStart: "Hecho para",
          titleHighlight: "convertir",
          description:
            "Tipografía marcante, fondos pixel y CTAs claros — ideal para partnerships, media kits y campañas de links.",
          viewport: "mobile",
          image: "/page-mobile1.jpeg",
          imageAlt: "Página móvil QuackLinks para marcas con fondo pixel-art",
          slug: "eitar",
          themeColor: "#2dd4bf",
          auroraStops: [yellowDeep, "#050505", "#14b8a6"],
        },
        {
          id: "desktop-neon",
          tag: "Desktop · Neon",
          titleStart: "Energía neón",
          titleHighlight: "en pantalla grande",
          description:
            "Fondos en video, paletas cyberpunk e íconos sociales que destacan en desktop — sin perder velocidad.",
          viewport: "desktop",
          image: "/page-desktop2.png",
          imageAlt: "Página desktop QuackLinks con fondo cyberpunk neón",
          slug: "la-ele",
          themeColor: "#f472b6",
          auroraStops: ["#ec4899", "#050505", yellow],
        },
        {
          id: "desktop-art",
          tag: "Desktop · Arte",
          titleStart: "Mundos artísticos",
          titleHighlight: "a tu manera",
          description:
            "Fondos cinematográficos, selección de íconos y cards que cuentan una historia — páginas reales hechas con QuackLinks.",
          viewport: "desktop",
          image: "/page-desktop1.png",
          imageAlt: "Página desktop QuackLinks con paisaje fantástico de luna",
          slug: "hori7241",
          themeColor: yellow,
          auroraStops: [yellowDeep, "#050505", "#6366f1"],
        },
      ];
    default:
      return [
        {
          id: "mobile-glass",
          tag: "Mobile · Glass",
          titleStart: "Perfis que",
          titleHighlight: "respiram estilo",
          description:
            "Cards de vidro sobre fotos imersivas. Layout limpo e identidade forte — exatamente o que seus visitantes veem no QuackLinks.",
          viewport: "mobile",
          image: "/page-mobile2.jpeg",
          imageAlt:
            "Página mobile QuackLinks com glassmorphism sobre lago roxo",
          slug: "mars",
          themeColor: "#c084fc",
          auroraStops: [yellow, "#050505", "#c084fc"],
          mobileWide: true,
        },
        {
          id: "mobile-brand",
          tag: "Mobile · Marca",
          titleStart: "Feito para",
          titleHighlight: "converter",
          description:
            "Tipografia marcante, fundos pixel e CTAs claros — ideal para parcerias, media kits e campanhas de links.",
          viewport: "mobile",
          image: "/page-mobile1.jpeg",
          imageAlt: "Página mobile QuackLinks para marcas com fundo pixel-art",
          slug: "eitar",
          themeColor: "#2dd4bf",
          auroraStops: [yellowDeep, "#050505", "#14b8a6"],
        },
        {
          id: "desktop-neon",
          tag: "Desktop · Neon",
          titleStart: "Energia neon",
          titleHighlight: "na tela grande",
          description:
            "Fundos em vídeo, paletas cyberpunk e blocos sociais que saltam no desktop — sem sacrificar velocidade.",
          viewport: "desktop",
          image: "/page-desktop2.png",
          imageAlt: "Página desktop QuackLinks com fundo cyberpunk neon",
          slug: "la-ele",
          themeColor: "#f472b6",
          auroraStops: ["#ec4899", "#050505", yellow],
        },
        {
          id: "desktop-art",
          tag: "Desktop · Arte",
          titleStart: "Mundos artísticos",
          titleHighlight: "do seu jeito",
          description:
            "Backgrounds cinematográficos, ícones customizados e cards de perfil que contam uma história — páginas reais criadas no QuackLinks.",
          viewport: "desktop",
          image: "/page-desktop1.png",
          imageAlt: "Página desktop QuackLinks com paisagem fantástica de lua",
          slug: "hori7241",
          themeColor: yellow,
          auroraStops: [yellowDeep, "#050505", "#6366f1"],
        },
      ];
  }
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const activeAuroraStops = computed(
  () =>
    steps.value[activeIndex.value]?.auroraStops ?? [
      "#fbbf24",
      "#050505",
      "#6366f1",
    ],
);
const activeStep = computed(
  () => steps.value[activeIndex.value] ?? steps.value[0]!,
);
const textOnLeft = computed(() => activeIndex.value % 2 === 0);
const textTransitionName = computed(() =>
  textOnLeft.value ? "explore-text-left" : "explore-text-right",
);

const contentShellStyle = computed(() => {
  const introProgress = clamp(sectionProgress.value * 2.8, 0, 1);
  return {
    opacity: `${0.82 + introProgress * 0.18}`,
    transform: `translateY(${(1 - introProgress) * 16}px)`,
  };
});

const previewShellStyle = computed(() => {
  const segmentSize = 1 / steps.value.length;
  const segmentStart = activeIndex.value * segmentSize;
  const progressInSegment = clamp(
    (sectionProgress.value - segmentStart) / segmentSize,
    0,
    1,
  );

  return {
    transform: `translateY(${(1 - progressInSegment) * 6}px) scale(${0.98 + progressInSegment * 0.02})`,
  };
});

function connectorProgress(index: number) {
  const stepCount = steps.value.length;
  if (stepCount <= 1) return 0;

  const travel = sectionProgress.value * (stepCount - 1);
  if (travel >= index + 1) return 1;
  if (travel <= index) return 0;
  return travel - index;
}

function setExploreActive(active: boolean) {
  if (exploreActive === active) return;
  exploreActive = active;
  emit("explore-active", active);
}

function handleScroll() {
  if (!scrollTrack.value) return;

  const rect = scrollTrack.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const totalScrollable = Math.max(rect.height - windowHeight, 1);
  const rawProgress = clamp(-rect.top / totalScrollable, 0, 1);

  sectionProgress.value = rawProgress;
  setExploreActive(rect.top <= 0 && rect.bottom > windowHeight);

  if (rect.top > 0) {
    activeIndex.value = 0;
    return;
  }

  if (rect.bottom < windowHeight) {
    activeIndex.value = steps.value.length - 1;
    return;
  }

  const segmentProgress = rawProgress * steps.value.length;
  const stepIndex = Math.min(
    Math.floor(segmentProgress),
    steps.value.length - 1,
  );

  if (activeIndex.value !== stepIndex) {
    activeIndex.value = stepIndex;
  }
}

function scrollToStep(index: number) {
  if (!scrollTrack.value) return;

  const rect = scrollTrack.value.getBoundingClientRect();
  const sectionTop = window.scrollY + rect.top;
  const totalScrollable = Math.max(
    scrollTrack.value.offsetHeight - window.innerHeight,
    1,
  );
  const stepProgress =
    steps.value.length === 1 ? 0 : index / (steps.value.length - 1);
  const targetScroll = sectionTop + totalScrollable * stepProgress;

  window.scrollTo({ top: targetScroll, behavior: "smooth" });
}

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
});

onUnmounted(() => {
  setExploreActive(false);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>

<style scoped>
.explore-grid {
  background-image: radial-gradient(
    rgba(251, 191, 36, 0.35) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}

.explore-text-left-enter-active,
.explore-text-left-leave-active,
.explore-text-right-enter-active,
.explore-text-right-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.explore-text-left-enter-from {
  opacity: 0;
  transform: translateX(-36px);
}

.explore-text-left-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

.explore-text-right-enter-from {
  opacity: 0;
  transform: translateX(36px);
}

.explore-text-right-leave-to {
  opacity: 0;
  transform: translateX(-28px);
}

.explore-preview-enter-active,
.explore-preview-leave-active {
  transition:
    opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.explore-preview-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}

.explore-preview-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-10px);
}

.explore-sticky-track {
  scroll-snap-align: start;
  overflow: visible;
}

.explore-sticky-pin {
  position: sticky;
  top: 0;
}

@media (prefers-reduced-motion: reduce) {
  .explore-text-left-enter-active,
  .explore-text-left-leave-active,
  .explore-text-right-enter-active,
  .explore-text-right-leave-active,
  .explore-preview-enter-active,
  .explore-preview-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
