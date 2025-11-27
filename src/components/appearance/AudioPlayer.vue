<template>
    <div v-if="currentAudio" :class="[
        'fixed top-5 left-5 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-md border border-slate-700/50 rounded-full p-2 transition-all duration-300',
        showWidget ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
    ]" @mouseenter="controlsVisible = true" @mouseleave="controlsVisible = false">

        <audio ref="audioPlayer" :src="currentAudio.url" preload="auto"></audio>

        <div class="relative flex-shrink-0">
            <img :src="currentAudio.coverUrl || '/default-cover.png'" alt="Capa do áudio"
                class="w-10 h-10 rounded-full object-cover">
            <button @click="togglePlay"
                class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Tocar/Pausar música">
                <SpeakerWaveIcon v-if="isPlaying" class="w-5 h-5" />
                <SpeakerXMarkIcon v-else class="w-5 h-5" />
            </button>
        </div>

        <transition name="slide-fade">
            <div v-if="controlsVisible" class="flex items-center gap-4 pr-2">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate">{{ currentAudio.title }}</p>
                </div>

                <button v-if="audios.length > 1" @click="playNext"
                    class="text-slate-300 hover:text-white transition-colors" aria-label="Próxima música">
                    <ForwardIcon class="w-5 h-5" />
                </button>

                <div class="w-24">
                    <input type="range" min="0" max="1" step="0.01" :value="volume" @input="handleVolumeChange"
                        class="volume-slider w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
                        aria-label="Controle de volume" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { SpeakerWaveIcon, SpeakerXMarkIcon, ForwardIcon } from '@heroicons/vue/24/solid';
import type { Audio } from '@/store/page';

const props = defineProps<{
    audios: Audio[];
    shuffle: boolean;
    showWidget: boolean;
}>();


const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const volume = ref(0.35);
const controlsVisible = ref(false);
const currentAudioIndex = ref(0);

const currentAudio = computed<Audio | null>(() => {
    if (!props.audios || props.audios.length === 0) {
        return null;
    }

    const audio = props.audios[currentAudioIndex.value];

    return audio || null;
});

const playAudio = () => {
    if (!audioPlayer.value) return;
    audioPlayer.value.volume = volume.value;
    audioPlayer.value.play().catch(e => {
        console.error("Erro ao tocar áudio:", e);
        isPlaying.value = false;
    });
};

const togglePlay = () => {
    if (!audioPlayer.value) return;
    if (audioPlayer.value.paused) {
        playAudio();
    } else {
        audioPlayer.value.pause();
    }
};

const playNext = () => {
    if (props.audios.length <= 1) return;

    if (props.shuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * props.audios.length);
        } while (nextIndex === currentAudioIndex.value);
        currentAudioIndex.value = nextIndex;
    } else {
        currentAudioIndex.value = (currentAudioIndex.value + 1) % props.audios.length;
    }
};

const handleVolumeChange = (event: Event) => {
    const newVolume = parseFloat((event.target as HTMLInputElement).value);
    volume.value = newVolume;
    if (audioPlayer.value) {
        audioPlayer.value.volume = newVolume;
    }
};


watch(currentAudio, async (newAudio, oldAudio) => {
    if (newAudio && newAudio.id !== oldAudio?.id && audioPlayer.value) {
        await nextTick();

        audioPlayer.value.load();
        playAudio();
    }
})

onMounted(() => {
    const initialActiveIndex = props.audios.findIndex(a => a.isActive);
    currentAudioIndex.value = initialActiveIndex !== -1 ? initialActiveIndex : 0;

    if (props.shuffle) {
        currentAudioIndex.value = Math.floor(Math.random() * props.audios.length);
    }

    if (audioPlayer.value) {
        const player = audioPlayer.value;
        const updatePlayingState = () => isPlaying.value = !player.paused;
        const onEnded = () => playNext();

        player.addEventListener('play', updatePlayingState);
        player.addEventListener('pause', updatePlayingState);
        player.addEventListener('ended', onEnded);


        onUnmounted(() => {
            player.removeEventListener('play', updatePlayingState);
            player.removeEventListener('pause', updatePlayingState);
            player.removeEventListener('ended', onEnded);
        });
    }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
    width: 0;
}

.volume-slider {
    accent-color: #a78bfa;

}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #f1f5f9;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -2px;
    transition: background 0.2s ease-in-out;
}

.volume-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #f1f5f9;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}
</style>