<!-- src/components/LinkCard.vue -->

<template>
  <a :href="url" target="_blank" class="link-card">
    <div class="icon">
      <!-- Aqui você poderia ter um ícone, por enquanto uma letra -->
      <span>{{ title.charAt(0) }}</span>
    </div>
    <div class="title">
      {{ title }}
    </div>
  </a>
</template>

<script setup lang="ts">
// defineProps é como se fosse a declaração de props em React.
// É um "macro" do compilador, não precisa ser importado.
// Com TypeScript, podemos tipar as props facilmente.
defineProps<{
  title: string;
  url: string;
}>();
</script>

<style scoped>
/* O "scoped" garante que esse CSS só se aplique a este componente */
.link-card {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  padding: 1rem;
  margin: 0.75rem auto;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  transition: transform 0.2s ease-in-out;
}

.link-card:hover {
  transform: scale(1.02);
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  font-weight: bold;
}

.title {
  font-size: 1.1rem;
}
</style>