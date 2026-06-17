<template>
    <div @click.self="$emit('close')" class="ui-modal-shell">
        <div class="ui-modal-backdrop"></div>
        <div class="ui-modal-panel animate-fade-in max-w-4xl" @click.stop>
            <div class="ui-modal-header">
                <div class="ui-modal-title-wrap">
                    <div class="ui-modal-accent">
                        <span class="h-2.5 w-2.5 rounded-full bg-current"></span>
                    </div>
                    <h2 class="ui-modal-title">{{ copy.title }}</h2>
                </div>
                <button @click="$emit('close')" class="ui-modal-close" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="grid grid-cols-3 gap-3 self-start">
                    <button v-for="effect in titleEffects" :key="effect.id" @click="selectEffect(effect)"
                        :disabled="isLockedEffect(effect)"
                        class="relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-center"
                        :class="isLockedEffect(effect)
                            ? 'cursor-not-allowed border-amber-500/40 bg-slate-800/80 opacity-80'
                            : localSelectedEffect === effect.id
                                ? 'border-amber-400 bg-amber-500/10'
                                : 'border-slate-700 bg-slate-800 hover:border-slate-500'">

                        <div v-if="effect.premium && !authStore.isPremium"
                            class="absolute right-1 top-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
                            PREMIUM
                        </div>

                        <span class="font-bold text-xl" :class="`effect-${effect.id}`"
                            :style="{ color: effect.id === 'outline' ? 'transparent' : 'white', '--glow-color': '#ff00de' }">
                            Aa
                        </span>
                        <span class="text-xs text-slate-300 mt-1">{{ effect.name }}</span>
                        <span v-if="isLockedEffect(effect)" class="mt-1 text-[10px] text-amber-200">
                            {{ copy.premiumOnly }}
                        </span>
                    </button>
                </div>

                <div class="flex items-center justify-center p-8 bg-pink-600 rounded-xl min-h-[160px] overflow-hidden">
                    <h1 class="text-4xl font-bold text-white break-words text-center"
                        :class="localSelectedEffect !== 'typewriter' ? previewClass : ''" :data-text="truncatedTitle"
                        :style="{ '--glow-color': '#FFFFFF' }">

                        <span v-if="localSelectedEffect === 'typewriter'" class="typewriter font-mono"
                            :key="truncatedTitle" :style="{ '--char-count': truncatedTitle.length }">
                            {{ truncatedTitle }}
                        </span>
                        <span v-else>
                            {{ truncatedTitle }}
                        </span>
                    </h1>
                </div>
            </div>

            <div v-if="!authStore.isPremium" class="px-6 pb-2">
                <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                    {{ copy.premiumMessage }}
                    <button type="button"
                        class="mt-3 block rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200 transition hover:bg-amber-500/20"
                        @click="handlePlansClick">
                        {{ copy.seePlans }}
                    </button>
                </div>
            </div>

            <div class="ui-modal-footer">
                <button @click="$emit('close')" class="ui-btn-secondary" type="button">
                    {{ copy.cancel }}
                </button>
                <button @click="saveAndClose" class="ui-btn-primary" type="button">
                    {{ copy.save }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { usePlansNavigation } from '@/composables/usePlansNavigation';
import { useAppLanguage } from '@/composables/useAppLanguage';

const props = defineProps<{
    modelValue: string;
    title: string;
}>();

const emit = defineEmits(['update:modelValue', 'close']);
const authStore = useAuthStore();
const { openPlans } = usePlansNavigation();
const { locale } = useAppLanguage();

const localSelectedEffect = ref(props.modelValue);

const copy = computed(() => {
    switch (locale.value) {
        case 'en':
            return {
                title: 'Username effects',
                premiumOnly: 'Available on the PREMIUM plan',
                premiumMessage: 'Some name effects are exclusive to the PREMIUM plan.',
                seePlans: 'See plans',
                cancel: 'Cancel',
                save: 'Save',
                defaultName: 'Your Name',
                effects: {
                    none: 'None',
                    typewriter: 'Typewriter',
                    rainbow: 'Rainbow',
                    neon: 'Neon',
                    outline: 'Outline',
                    glitch: 'Glitch',
                },
            };
        case 'es':
            return {
                title: 'Efectos del nombre de usuario',
                premiumOnly: 'Disponible en el plan PREMIUM',
                premiumMessage: 'Algunos efectos del nombre son exclusivos del plan PREMIUM.',
                seePlans: 'Ver planes',
                cancel: 'Cancelar',
                save: 'Guardar',
                defaultName: 'Tu Nombre',
                effects: {
                    none: 'Ninguno',
                    typewriter: 'Máquina de Escribir',
                    rainbow: 'Arcoíris',
                    neon: 'Neon',
                    outline: 'Contorno',
                    glitch: 'Glitch',
                },
            };
        default:
            return {
                title: 'Efeitos do nome de usuário',
                premiumOnly: 'Disponível no plano PREMIUM',
                premiumMessage: 'Alguns efeitos do nome são exclusivos do plano PREMIUM.',
                seePlans: 'Ver planos',
                cancel: 'Cancelar',
                save: 'Salvar',
                defaultName: 'Seu Nome',
                effects: {
                    none: 'Nenhum',
                    typewriter: 'Máquina de Escrever',
                    rainbow: 'Arco-íris',
                    neon: 'Neon',
                    outline: 'Contorno',
                    glitch: 'Glitch',
                },
            };
    }
});

const titleEffects = computed(() => [
    { id: 'none', name: copy.value.effects.none, premium: false },
    { id: 'typewriter', name: copy.value.effects.typewriter, premium: true },
    { id: 'rainbow', name: copy.value.effects.rainbow, premium: false },
    { id: 'neon', name: copy.value.effects.neon, premium: false },
    { id: 'outline', name: copy.value.effects.outline, premium: false },
    { id: 'glitch', name: copy.value.effects.glitch, premium: false },
]);

const previewClass = computed(() => {
    return `effect-${localSelectedEffect.value}`;
});

const truncatedTitle = computed(() => {
    const text = props.title || copy.value.defaultName;
    if (text.length > 20) {
        return text.slice(0, 20) + '...';
    }
    return text;
});

function isLockedEffect(effect: { premium: boolean }) {
    return effect.premium && !authStore.isPremium;
}

function selectEffect(effect: { id: string; premium: boolean }) {
    if (isLockedEffect(effect)) {
        void handlePlansClick();
        return;
    }
    localSelectedEffect.value = effect.id;
}

function handlePlansClick() {
    return openPlans(copy.value.premiumMessage);
}

function saveAndClose() {
    emit('update:modelValue', localSelectedEffect.value);
    emit('close');
}
</script>

<style scoped>
.typewriter {
    display: inline-block;
    border-right: .15em solid #a78bfa;

    white-space: nowrap;
    overflow: hidden;
    max-width: 0;
    animation:
        typing 3.5s steps(var(--char-count, 40)) forwards,
        blink-caret .75s step-end infinite;
}


@keyframes typing {
    from {
        max-width: 0
    }

    to {
        max-width: 100%
    }

}

@keyframes blink-caret {

    from,
    to {
        border-color: transparent
    }

    50% {
        border-color: #a78bfa;
    }
}


@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out forwards;
}

/* Estilos dos efeitos (reutilizados para o preview pequeno e o grande) */
.effect-rainbow {
    background-image: linear-gradient(45deg, #f3ec78, #af4261, #5433ff, #20bdff, #a5FECb);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbow-animation 5s ease-in-out infinite alternate;
}

@keyframes rainbow-animation {
    to {
        background-position: 200% center;
    }
}

.effect-neon {
    color: #fff;
    /* A cor base do neon */
    text-shadow:
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px v-bind('"#ff00de"'),
        0 0 30px v-bind('"#ff00de"'),
        0 0 40px v-bind('"#ff00de"');
    animation: neon-flicker 1.5s infinite alternate;
}

@keyframes neon-flicker {

    0%,
    18%,
    22%,
    25%,
    53%,
    57%,
    100% {
        text-shadow: inherit;
    }

    20%,
    24%,
    55% {
        text-shadow: none;
    }
}

.effect-outline {
    color: transparent !important;
    /* Força a transparência para o contorno aparecer */
    -webkit-text-stroke: 1.5px v-bind('"#FFFFFF"');
    text-shadow: none !important;
    /* Remove outros brilhos que possam interferir */
}

.effect-glitch {
    position: relative;
}

.effect-glitch::before,
.effect-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    /* Herda o fundo para não cobrir o que está atrás */
    overflow: hidden;
}

.effect-glitch::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
    clip-path: rect(44px, 450px, 56px, 0);
    animation: glitch-anim-1 3s infinite linear alternate-reverse;
}

.effect-glitch::after {
    left: -2px;
    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
    clip-path: rect(80px, 450px, 90px, 0);
    animation: glitch-anim-2 4s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
    0% {
        clip-path: inset(5% 0 90% 0);
    }

    100% {
        clip-path: inset(60% 0 15% 0);
    }
}

@keyframes glitch-anim-2 {
    0% {
        clip-path: inset(80% 0 5% 0);
    }

    100% {
        clip-path: inset(40% 0 33% 0);
    }
}
</style>
