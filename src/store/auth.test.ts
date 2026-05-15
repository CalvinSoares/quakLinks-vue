import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./auth";

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
