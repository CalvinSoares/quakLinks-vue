import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const UserPageView = () => import("@/views/UserPageView.vue");
const AppearanceView = () => import("@/views/AppearanceView.vue");
const AccountOverview = () => import("../views/AccountOverview.vue");
const VerifyEmailView = () => import("@/views/VerifyEmailView.vue");
const AccountSettingsView = () => import("@/views/AccountSettingsView.vue");
const TemplatesView = () => import("@/views/TemplatesView.vue");
const AuthCallback = () => import("@/views/AuthCallback.vue");
const AnalyticsView = () => import("@/views/AnalyticsView.vue");
const LandingPage = () => import("@/views/Landing-Page.vue");
const PagesManager = () => import("@/views/PagesManager.vue");
const SpotifyCallback = () => import("@/views/SpotifyCallback.vue");

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
      path: "/dashboard",
      redirect: "/dashboard/overview",
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
      path: "/auth/callback/:provider?",
      name: "authCallback",
      component: AuthCallback,
    },
    {
      path: "/spotify/callback",
      name: "spotify-callback",
      component: SpotifyCallback,
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
