<template>
  <div class="space-y-2">
    <label :for="id" class="block text-sm font-medium text-slate-300">{{ label }}</label>
    <div class="relative">
      <div class="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-300 group">
        <div class="relative">
          <input 
            type="color" 
            :id="id"
            :value="modelValue" 
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="sr-only"
          />
          <label 
            :for="id"
            :style="{ backgroundColor: modelValue }"
            class="block w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-600 group-hover:border-slate-500 transition-all duration-300 shadow-lg hover:scale-110 transform"
          ></label>
        </div>
        <div class="flex-1">
          <input 
            type="text" 
            :value="modelValue" 
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            placeholder="#000000"
            class="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all font-mono text-sm"
          />
        </div>
        <div class="flex flex-col items-center">
          <div 
            :style="{ backgroundColor: modelValue }"
            class="w-8 h-8 rounded-full border-2 border-slate-700"
          ></div>
        </div>
      </div>
    </div>
    <p v-if="description" class="text-xs text-slate-500 mt-1">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: string
  description?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>