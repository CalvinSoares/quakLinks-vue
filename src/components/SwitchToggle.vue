<template>
    <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" class="sr-only peer">
        <div
            class="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
        </div>
    </label>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean;
}>();

defineEmits(['update:modelValue']);
</script>