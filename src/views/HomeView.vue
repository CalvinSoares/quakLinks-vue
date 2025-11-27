<!-- src/views/HomeView.vue -->

<template>
  <!-- Usando classes Tailwind diretamente no HTML -->
  <main class="font-sans text-center py-8 px-4  w-full h-full">
    <header class="mb-8">
      <img src="https://i.pravatar.cc/150" alt="Foto de perfil" class="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-gray-800">
      <h1 class="text-2xl font-bold">@SeuUsuario</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Bem-vindo à minha página de links! Me siga nas redes sociais.</p>
    </header>

    <div class="flex flex-col items-center space-y-4">
      <LinkCard
        v-for="link in links"
        :key="link.id"
        :title="link.title"
        :url="link.url"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import LinkCard from '@/components/LinkCard.vue';


// Definindo o tipo dos nossos links
interface Link {
  id: number;
  title: string;
  url: string;
}

// Criando uma lista de links reativa usando ref()
// Pense nisso como o seu `useState([])`
const links = ref<Link[]>([
  { id: 1, title: 'Meu Portfólio', url: 'https://meusite.com' },
  { id: 2, title: 'GitHub', url: 'https://github.com/seu-usuario' },
  { id: 3, title: 'LinkedIn', url: 'https://linkedin.com/in/seu-usuario' },
  { id: 4, title: 'Twitter / X', url: 'https://twitter.com/seu-usuario' },
]);

// No futuro, você vai buscar esses dados de uma API!
// Ex: onMounted(async () => { links.value = await fetchLinksFromAPI(); })
</script>

<style scoped>
.profile-page {
  font-family: sans-serif;
  text-align: center;
  padding: 2rem 1rem;
}

.profile-header {
  margin-bottom: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #333;
}

.links-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>