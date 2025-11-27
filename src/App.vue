<script setup>
import { RouterView } from 'vue-router'
import CustomCursor from './components/CustomCursor.vue';
</script>

<template>
  <RouterView />
  <CustomCursor />
</template>


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