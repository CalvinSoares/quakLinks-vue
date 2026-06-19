import "./assets/main.css";
import "vue-sonner/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./store/auth";
import { head } from "./plugins/head";
import { registerSeoRouter } from "./utils/seoHead";

const app = createApp(App);

app.use(createPinia());
app.use(head);

const authStore = useAuthStore();
if (authStore.isAuthenticated) {
  authStore.fetchUser();
}

registerSeoRouter(router);
app.use(router);

app.mount("#app");
