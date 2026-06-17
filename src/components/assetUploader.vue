<template>
  <div>
    <div class="mb-2 flex items-center gap-2">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
      <span v-if="isLocked && requiredPlan"
        class="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
        {{ requiredPlan }}
      </span>
    </div>
    <div @click="handleLockedClick"
      class="relative flex items-center justify-center w-full h-32 rounded-lg overflow-hidden border"
      :class="isLocked ? 'border-amber-500/40 bg-slate-900/80' : 'border-slate-700 bg-slate-800/50'">
      <template v-if="currentUrl">
        <video v-if="isVideo" :src="currentUrl" class="w-full h-full object-cover" autoplay loop muted></video>
        <img v-else-if="isImage" :src="currentUrl" class="w-full h-full object-cover" />
        <div v-else class="text-center text-slate-400">
          <MusicalNoteIcon class="w-8 h-8 mx-auto" />
          <p class="text-xs mt-1 truncate max-w-[80%]">{{ getFileName(currentUrl) }}</p>
        </div>

        <div class="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity"
          :class="isLocked ? 'opacity-100' : 'opacity-0 hover:opacity-100'">

          <button @click="$emit('remove', fieldName)" v-if="!isLocked"
            class="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-slate-300 hover:bg-red-500/80 hover:text-white">
            <XMarkIcon class="w-4 h-4" />
          </button>

          <label v-if="!isLocked" :for="inputId" class="cursor-pointer font-semibold text-white">
            Trocar
          </label>
          <div v-else class="px-4 text-center text-sm text-amber-200">
            <p>{{ lockMessage || `Disponível no plano ${requiredPlan}.` }}</p>
            <button type="button"
              class="mt-3 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200 transition hover:bg-amber-500/20"
              @click.stop="handleLockedClick">
              Ver planos
            </button>
          </div>
        </div>
      </template>


      <label v-else :for="inputId" class="text-center transition-colors"
        :class="isLocked ? 'cursor-not-allowed text-amber-200' : 'cursor-pointer text-slate-400 hover:text-amber-400'">
        <component :is="placeholderIcon" class="w-8 h-8 mx-auto" />
        <p class="mt-2 text-sm">
          {{ isLocked ? (lockMessage || `Disponível no plano ${requiredPlan}.`) : 'Clique para enviar' }}
        </p>
        <button v-if="isLocked" type="button"
          class="mt-3 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200 transition hover:bg-amber-500/20"
          @click.prevent.stop="handleLockedClick">
          Ver planos
        </button>
      </label>

      <input :id="inputId" type="file" class="hidden" :accept="acceptedFiles" :disabled="isLocked"
        @change="onFileChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PhotoIcon, MusicalNoteIcon, XMarkIcon, VideoCameraIcon } from '@heroicons/vue/24/outline';
import { usePlansNavigation } from '@/composables/usePlansNavigation';

type UploadableField = 'avatarUrl' | 'backgroundUrl' | 'cursorUrl' | 'backgroundVideoUrl';
type UploadType = 'avatar' | 'background' | 'audio' | 'cursor' | 'video';

const props = defineProps<{
  title: string;
  currentUrl: string | null;
  uploadType: UploadType;
  acceptedFiles: string;
  localPreviewUrl?: string | null;
  fieldName?: UploadableField;
  isLocked?: boolean;
  requiredPlan?: string;
  lockMessage?: string;
}>();

const emit = defineEmits(['upload', 'remove']);
const { openPlans } = usePlansNavigation();

const finalFieldName = computed<UploadableField>(() => {
  if (props.fieldName) {
    return props.fieldName;
  }

  return `${props.uploadType}Url` as UploadableField;
});

const inputId = computed(() => `upload-${finalFieldName.value}`);

const isImage = computed(() => ['avatar', 'background', 'cursor'].includes(props.uploadType));
const isVideo = computed(() => props.uploadType === 'video');
const placeholderIcon = computed(() => {
  if (isVideo.value) return VideoCameraIcon;
  if (isImage.value) return PhotoIcon;
  return MusicalNoteIcon;
});



const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {

    emit('upload', {
      file: file,
      field: finalFieldName.value,
      uploadType: props.uploadType
    });
  }
};

function handleLockedClick() {
  if (!props.isLocked) {
    return;
  }

  void openPlans(props.lockMessage || `Disponível no plano ${props.requiredPlan || "PREMIUM"}.`);
}

function getFileName(url: string) {
  try {
    return url.split('/').pop()?.split('?')[0] || 'Arquivo de áudio';
  } catch {
    return 'Arquivo de áudio';
  }
}
</script>
