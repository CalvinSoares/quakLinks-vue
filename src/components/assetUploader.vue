<template>
  <div>
    <h3 class="text-lg font-semibold text-white mb-2">{{ title }}</h3>
    <div
      class="relative flex items-center justify-center w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <template v-if="currentUrl">
        <video v-if="isVideo" :src="currentUrl" class="w-full h-full object-cover" autoplay loop muted></video>
        <img v-else-if="isImage" :src="currentUrl" class="w-full h-full object-cover" />
        <div v-else class="text-center text-slate-400">
          <MusicalNoteIcon class="w-8 h-8 mx-auto" />
          <p class="text-xs mt-1 truncate max-w-[80%]">{{ getFileName(currentUrl) }}</p>
        </div>

        <div
          class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">

          <button @click="$emit('remove', fieldName)"
            class="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-slate-300 hover:bg-red-500/80 hover:text-white">
            <XMarkIcon class="w-4 h-4" />
          </button>

          <label :for="inputId" class="text-white font-semibold cursor-pointer">Trocar</label>
        </div>
      </template>


      <label v-else :for="inputId"
        class="text-center text-slate-400 cursor-pointer hover:text-amber-400 transition-colors">
        <component :is="placeholderIcon" class="w-8 h-8 mx-auto" />
        <p class="text-sm mt-2">Clique para enviar</p>
      </label>

      <input :id="inputId" type="file" class="hidden" :accept="acceptedFiles" @change="onFileChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PhotoIcon, MusicalNoteIcon, XMarkIcon, VideoCameraIcon } from '@heroicons/vue/24/outline';

type UploadableField = 'avatarUrl' | 'backgroundUrl' | 'cursorUrl' | 'backgroundVideoUrl';
type UploadType = 'avatar' | 'background' | 'audio' | 'cursor' | 'video';

const props = defineProps<{
  title: string;
  currentUrl: string | null;
  uploadType: UploadType;
  acceptedFiles: string;
  localPreviewUrl?: string | null;
  fieldName?: UploadableField;
}>();

const emit = defineEmits(['upload', 'remove']);

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

function getFileName(url: string) {
  try {
    return url.split('/').pop()?.split('?')[0] || 'Arquivo de áudio';
  } catch {
    return 'Arquivo de áudio';
  }
}
</script>