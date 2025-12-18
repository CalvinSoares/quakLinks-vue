import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import UserPageView from "@/views/UserPageView.vue";
import AppearanceView from "@/views/AppearanceView.vue";
import AccountOverview from "../views/AccountOverview.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import AccountSettingsView from "@/views/AccountSettingsView.vue";
import TemplatesView from "@/views/TemplatesView.vue";
import AuthCallback from "@/views/AuthCallback.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import LandingPage from "@/views/Landing-Page.vue";
import PagesManager from "@/views/PagesManager.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      name: "home",
      component: LandingPage,
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
      path: "/analytics",
      name: "Analytics",
      component: AnalyticsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "dashboard-settings",
      component: AccountSettingsView,
      meta: { requiresAuth: true },
    },

    {
      path: "/dashboard/pages",
      name: "pages-manager",
      component: PagesManager,
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
        return auth.isAuthenticated ? "/dashboard/overview" : "/login";
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

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: "login" });
  } else if (
    (to.name === "login" || to.name === "register") &&
    auth.isAuthenticated
  ) {
    next({ name: "dashboard-overview" });
  } else {
    next();
  }
});

export default router;
