<template>
  <RouterView />
  <Toaster rich-colors position="top-right" :toast-options="{
    style: { cursor: 'pointer !important' }
  }" />
  <CustomCursor />
</template>

<script setup>
import { RouterView } from 'vue-router'
import CustomCursor from './components/CustomCursor.vue';
import { Toaster } from 'vue-sonner';
</script>

<style>
/* Esconde o cursor padrão em toda a aplicação */
* {
  cursor: none !important;
}

/* Garante que o cursor de texto apareça em campos de input */
input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  cursor: text !important;
}
</style>