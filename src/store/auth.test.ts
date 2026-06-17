import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "./auth";
import { server } from "@/test/msw/server";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

vi.mock("@/router", () => ({
  default: {
    push: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("faz login com o contrato atual da API e carrega o usuario", async () => {
    const store = useAuthStore();

    await store.login({
      email: "quack@example.com",
      password: "Senha123!",
    });

    expect(store.token).toBe("access-token");
    expect(store.user?.email).toBe("quack@example.com");
    expect(localStorage.getItem("accessToken")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
  });

  it("bloqueia login quando a API exige e-mail verificado", async () => {
    server.use(
      http.post(
        `${API_BASE_URL}/auth/login`,
        async () =>
          new HttpResponse("Verifique seu e-mail antes de entrar", {
            status: 403,
          }),
      ),
    );

    const store = useAuthStore();

    await expect(
      store.login({
        email: "quack@example.com",
        password: "Senha123!",
      }),
    ).rejects.toMatchObject({
      response: {
        status: 403,
        data: "Verifique seu e-mail antes de entrar",
      },
    });

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });

  it("registra sem autenticar automaticamente no fluxo com verificacao por email", async () => {
    const store = useAuthStore();

    await expect(
      store.register({
        name: "Quack User",
        email: "quack@example.com",
        password: "Senha123!",
      }),
    ).resolves.toBe(true);

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });

  it("verifica email e reenvia codigo pelo contrato atual", async () => {
    const store = useAuthStore();

    await expect(
      store.verifyEmail({
        email: "quack@example.com",
        token: "123456",
      }),
    ).resolves.toBe(true);

    await expect(
      store.resendVerificationEmail("quack@example.com"),
    ).resolves.toBe(true);
  });

  it("inicia o login social com authorize URL da API atual", async () => {
    const store = useAuthStore();
    const assignSpy = vi.fn();
    window.location.assign = assignSpy;

    await store.startSocialLogin("google");

    expect(sessionStorage.getItem("pendingSocialAuth")).toBe(
      JSON.stringify({
        provider: "google",
        state: "google-oauth-state",
      }),
    );
    expect(assignSpy).toHaveBeenCalledWith(
      "https://accounts.example.com/google/authorize",
    );
  });

  it("lista sessoes do usuario autenticado pela API atual", async () => {
    const store = useAuthStore();

    await store.fetchSessions();

    expect(store.sessions).toHaveLength(2);
    expect(store.sessions[0]?.active).toBe(true);
  });

  it("revoga uma sessao especifica e atualiza o estado local", async () => {
    const store = useAuthStore();

    await store.fetchSessions();
    await store.revokeSession("session-2");

    expect(store.sessions[1]?.revoked).toBe(true);
    expect(store.sessions[1]?.active).toBe(false);
  });

  it("exclui uma sessao revogada e remove do estado local", async () => {
    const store = useAuthStore();

    await store.fetchSessions();
    await store.revokeSession("session-2");
    await store.deleteSession("session-2");

    expect(store.sessions).toHaveLength(1);
    expect(store.sessions[0]?.id).toBe("session-1");
  });

  it("falha rapido quando o state OAuth retornado nao bate com o pendente", async () => {
    const store = useAuthStore();
    sessionStorage.setItem(
      "pendingSocialAuth",
      JSON.stringify({
        provider: "google",
        state: "expected-state",
      }),
    );

    await expect(
      store.completeSocialLogin({
        provider: "google",
        code: "oauth-code",
        state: "unexpected-state",
      }),
    ).rejects.toThrow("State OAuth invalido ou expirado.");
  });
});
