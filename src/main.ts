import "./assets/main.css";
import "vue-sonner/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import { useAuthStore } from "./store/auth";

const app = createApp(App);

app.use(createPinia());
app.use(VueApexCharts);

const authStore = useAuthStore();
if (authStore.isAuthenticated) {
  authStore.fetchUser();
}

app.use(router);

app.mount("#app");
