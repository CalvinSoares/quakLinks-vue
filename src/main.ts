import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import { useAuthStore } from "./store/auth";

const app = createApp(App);

// Instala o Pinia ANTES de qualquer outra coisa
app.use(createPinia());
app.use(VueApexCharts);
// Tenta buscar os dados do usuário se um token existir no localStorage
// Isso mantém o usuário logado ao recarregar a página
const authStore = useAuthStore();
if (authStore.isAuthenticated) {
  authStore.fetchUser();
}

// Instala o Vue Router
app.use(router);

app.mount("#app");
