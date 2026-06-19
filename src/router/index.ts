import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const UserPageView = () => import("@/views/UserPageView.vue");
const AppearanceView = () => import("@/views/AppearanceView.vue");
const AccountOverview = () => import("../views/AccountOverview.vue");
const VerifyEmailView = () => import("@/views/VerifyEmailView.vue");
const ForgotPasswordView = () => import("@/views/ForgotPasswordView.vue");
const ResetPasswordView = () => import("@/views/ResetPasswordView.vue");
const AccountSettingsView = () => import("@/views/AccountSettingsView.vue");
const TemplatesView = () => import("@/views/TemplatesView.vue");
const PlansView = () => import("@/views/PlansView.vue");
const AuthCallback = () => import("@/views/AuthCallback.vue");
const AnalyticsView = () => import("@/views/AnalyticsView.vue");
const LandingPage = () => import("@/views/Landing-Page.vue");
const PagesManager = () => import("@/views/PagesManager.vue");
const SpotifyCallback = () => import("@/views/SpotifyCallback.vue");

function normalizeHost(host?: string | null) {
  if (!host) {
    return null;
  }

  const normalized = host
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");

  return normalized || null;
}

function isPrimaryAppHost(host?: string | null) {
  const normalizedHost = normalizeHost(host);
  const configuredAppHost = normalizeHost(import.meta.env.VITE_APP_DOMAIN);

  if (!normalizedHost) {
    return true;
  }

  if (!configuredAppHost) {
    return true;
  }

  return normalizedHost === configuredAppHost;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        seo: {
          title: "Entrar",
          description:
            "Acesse sua conta QuackLinks para gerenciar suas páginas de biolink, links na bio e personalização.",
          noindex: true,
        },
      },
    },
    {
      path: "/",
      name: "home",
      component: LandingPage,
      meta: {
        seo: {
          skipRouterSeo: true,
        },
      },
    },
    {
      path: "/_public",
      name: "public-domain-page",
      component: UserPageView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        seo: {
          title: "Criar conta grátis",
          description:
            "Crie sua conta gratuita no QuackLinks e monte sua página de links na bio em minutos. Biolinks personalizados em quacklinks.com.br.",
        },
      },
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmailView,
      meta: {
        seo: {
          title: "Verificar e-mail",
          noindex: true,
        },
      },
    },
    {
      path: "/esqueci-senha",
      name: "forgot-password",
      component: ForgotPasswordView,
      meta: {
        seo: {
          title: "Recuperar senha",
          noindex: true,
        },
      },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPasswordView,
      meta: {
        seo: {
          title: "Redefinir senha",
          noindex: true,
        },
      },
    },
    {
      path: "/dashboard",
      redirect: "/dashboard/overview",
    },

    {
      path: "/analytics",
      name: "Analytics",
      component: AnalyticsView,
      meta: {
        requiresAuth: true,
        seo: { title: "Análises", noindex: true },
      },
    },
    {
      path: "/settings",
      name: "dashboard-settings",
      component: AccountSettingsView,
      meta: {
        requiresAuth: true,
        seo: { title: "Configurações", noindex: true },
      },
    },

    {
      path: "/dashboard/pages",
      name: "pages-manager",
      component: PagesManager,
      meta: {
        requiresAuth: true,
        seo: { title: "Minhas páginas", noindex: true },
      },
    },
    {
      path: "/dashboard/appearance",
      name: "appearance",
      component: AppearanceView,
      meta: {
        requiresAuth: true,
        seo: { title: "Personalização", noindex: true },
      },
    },
    {
      path: "/dashboard/templates",
      name: "templates",
      component: TemplatesView,
      meta: {
        requiresAuth: true,
        seo: { title: "Modelos", noindex: true },
      },
    },
    {
      path: "/dashboard/plans",
      name: "plans",
      component: PlansView,
      meta: {
        requiresAuth: true,
        seo: { title: "Planos", noindex: true },
      },
    },
    {
      path: "/dashboard/overview",
      name: "dashboard-overview",
      component: AccountOverview,
      meta: {
        requiresAuth: true,
        seo: { title: "Visão geral", noindex: true },
      },
    },
    {
      path: "/:slug",
      name: "user-page",
      component: UserPageView,
      meta: {
        seo: {
          skipRouterSeo: true,
        },
      },
    },
    {
      path: "/auth/callback/:provider?",
      name: "authCallback",
      component: AuthCallback,
      meta: {
        seo: { noindex: true },
      },
    },
    {
      path: "/spotify/callback",
      name: "spotify-callback",
      component: SpotifyCallback,
      meta: {
        seo: { noindex: true },
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "home" && !isPrimaryAppHost(window.location.host)) {
    next({ name: "public-domain-page" });
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
