import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

// Importe suas Views (páginas)
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import UserPageView from "@/views/UserPageView.vue";
import LinksView from "@/views/LinksView.vue";
import AppearanceView from "@/views/AppearanceView.vue";
import AccountOverview from "../views/AccountOverview.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import AccountSettingsView from "@/views/AccountSettingsView.vue";
import TemplatesView from "@/views/TemplatesView.vue";
import AuthCallback from "@/views/AuthCallback.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmailView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true }, // <-- Marca esta rota como protegida
    },
    {
      path: "/analytics",
      name: "Analytics",
      component: AnalyticsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "dashboard-settings",
      component: AccountSettingsView,
      meta: { requiresAuth: true }, // <-- Marca esta rota como protegida
    },
    {
      path: "/links",
      name: "links",
      component: LinksView,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard/appearance",
      name: "appearance",
      component: AppearanceView,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard/templates",
      name: "templates",
      component: TemplatesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard/overview",
      name: "dashboard-overview",
      component: AccountOverview,
      meta: { requiresAuth: true },
    },
    {
      path: "/:slug",
      name: "user-page",
      component: UserPageView,
    },
    {
      path: "/",
      redirect: () => {
        const auth = useAuthStore();
        return auth.isAuthenticated ? "/dashboard" : "/login";
      },
    },
    {
      path: "/auth/callback",
      name: "authCallback",
      component: AuthCallback,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Se a rota requer autenticação e o usuário não está logado...
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // ...redireciona para a página de login.
    next({ name: "login" });
  }
  // Se o usuário está logado e tenta acessar login/register...
  else if (
    (to.name === "login" || to.name === "register") &&
    auth.isAuthenticated
  ) {
    // ...redireciona para o dashboard.
    next({ name: "dashboard" });
  }
  // Caso contrário, permite o acesso.
  else {
    next();
  }
});

export default router;
