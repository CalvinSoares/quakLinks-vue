<template>
    <div class="profile-header-fixed mb-6 relative z-20">
        <div class="relative group mb-4 flex justify-center transition-all duration-500"
            :class="{ '-mt-20': page.pageLayout === 'banner' || page.pageLayout === 'portrait' }">

            <div class="p-1 rounded-full transition-all duration-300 relative" :style="profileRingStyle" :class="{
                'ring-animated': page.profileRingType === 'animated',
                'bg-slate-900': page.pageLayout !== 'standard' // Borda falsa para destacar no banner
            }">
                <div v-if="page.pageLayout !== 'standard'" class="absolute inset-0 rounded-full"
                    :style="{ backgroundColor: page.backgroundColor || '#111827' }"></div>

                <img :src="finalAvatarUrl" alt="Avatar" class="relative object-cover rounded-full shadow-lg z-10"
                    :class="(page.pageLayout === 'banner' || page.pageLayout === 'portrait') ? 'w-32 h-32' : 'w-28 h-28'" />
            </div>
        </div>

        <div class="text-center">
            <h1 :class="titleClasses"
                :style="{ color: page.textColor || '#FFFFFF', '--glow-color': page.textColor || '#FFFFFF' }">
                <span v-if="page.titleEffect === 'typewriter'" class="typewriter font-mono"
                    :style="{ '--char-count': (displayName).length }" :key="displayName">
                    {{ displayName }}
                </span>
                <span v-else>{{ displayName }}</span>
            </h1>

            <p v-if="page.bio" class="mt-2 text-center text-sm opacity-90 whitespace-pre-wrap w-full "
                :style="{ color: page.textColor ? `${page.textColor}CC` : '#CBD5E1' }">
                <span class="self-center text-center text-wrap  max-w-[10vw] break-words">{{ page.bio
                    }}</span>
            </p>

            <div class="mt-3 flex justify-between gap-4 text-xs font-medium opacity-70"
                :style="{ color: page.textColor || '#CBD5E1' }">
                <div v-if="page.showViewCount" class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.2 4 -5.6 6 -9 6s-6.8 -2 -9 -6c2.2 -4 5.6 -6 9 -6s6.8 2 9 6" />
                    </svg>
                    <span>{{ (page.viewCount || 0).toLocaleString() }}</span>
                </div>
                <div v-if="page.location" class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
                    <span>{{ page.location }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps<{ page: any }>();
const { user } = useAuthStore();

const displayName = computed(() => user?.name || props.page.slug || 'User');

const finalAvatarUrl = computed(() => {
    if (props.page.avatarUrl) {
        return props.page.avatarUrl;
    }

    if (props.page.user?.image) {
        return props.page.user.image;
    }

    const name = displayName.value || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=fff&size=128&bold=true`;
});

const titleClasses = computed(() => {
    const classes = ['text-3xl', 'font-bold', 'tracking-tight', 'drop-shadow-lg', 'min-h-[48px]', 'transition-all', 'duration-300'];
    if (props.page.glowEffect === 'title' || props.page.glowEffect === 'both') classes.push('text-glow');
    if (props.page.titleEffect && props.page.titleEffect !== 'none') classes.push(`effect-${props.page.titleEffect}`);
    return classes;
});

const profileRingStyle = computed(() => {
    const type = props.page.profileRingType || 'none';
    const colors = props.page.profileRingColors || [];
    if (type === 'none' || colors.length === 0) return { background: 'transparent', padding: '3px' };
    if (type === 'solid') return { background: colors[0], padding: '3px' };
    const gradient = `linear-gradient(45deg, ${[...colors, colors[0]].join(', ')})`;
    if (type === 'gradient') return { background: gradient, padding: '3px' };
    if (type === 'animated') return { '--ring-gradient': `conic-gradient(from var(--angle, 0deg), ${[...colors, colors[0]].join(', ')})`, padding: '3px' };
    return {};
});
</script>

<style scoped>
.text-glow {
    text-shadow: 0 0 10px var(--glow-color, #fff);
}
</style>