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
* {
  cursor: none !important;
}

input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  cursor: text !important;
}
</style>