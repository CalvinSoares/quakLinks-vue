<template>
    <div @click.self="$emit('close')"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl animate-fade-in">
            <div class="flex items-center justify-between p-4 border-b border-slate-800">
                <h2 class="text-lg font-bold text-white">Efeitos do nome de usuário</h2>
                <button @click="$emit('close')"
                    class="text-slate-400 hover:text-white transition-colors rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="grid grid-cols-3 gap-3 self-start">
                    <button v-for="effect in titleEffects" :key="effect.id" @click="localSelectedEffect = effect.id"
                        class="relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-center"
                        :class="localSelectedEffect === effect.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'">

                        <div v-if="effect.premium" class="absolute top-1 right-1 bg-slate-900/50 rounded-full p-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-yellow-400" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M8 11m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
                                <path d="M10 11v-2a2 2 0 1 1 4 0v2" />
                            </svg>
                        </div>

                        <span class="font-bold text-xl" :class="`effect-${effect.id}`"
                            :style="{ color: effect.id === 'outline' ? 'transparent' : 'white', '--glow-color': '#ff00de' }">
                            Aa
                        </span>
                        <span class="text-xs text-slate-300 mt-1">{{ effect.name }}</span>
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

            <div
                class="flex items-center justify-end gap-3 p-4 bg-slate-950/50 border-t border-slate-800 rounded-b-2xl">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    Cancelar
                </button>
                <button @click="saveAndClose"
                    class="px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                    Salvar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    modelValue: string;
    title: string;
}>();

const emit = defineEmits(['update:modelValue', 'close']);

const localSelectedEffect = ref(props.modelValue);

const titleEffects = [
    { id: 'none', name: 'Nenhum', premium: false },
    { id: 'typewriter', name: 'Máquina de Escrever', premium: true },
    { id: 'rainbow', name: 'Arco-íris', premium: false },
    { id: 'neon', name: 'Neon', premium: false },
    { id: 'outline', name: 'Contorno', premium: false },
    { id: 'glitch', name: 'Glitch', premium: false },

];

const previewClass = computed(() => {
    return `effect-${localSelectedEffect.value}`;
});

const truncatedTitle = computed(() => {
    const text = props.title || 'Seu Nome';
    if (text.length > 20) {
        return text.slice(0, 20) + '...';
    }
    return text;
});


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
    max-width: o;
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