import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "./auth";
import { useUserStore } from "./user";

describe("useUserStore", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.setItem("accessToken", "access-token");

    const authStore = useAuthStore();
    await authStore.fetchUser();
  });

  it("altera email usando o endpoint atual de auth", async () => {
    const store = useUserStore();

    await expect(
      store.updateEmail({
        currentPassword: "SenhaAtual123!",
        newEmail: "novo@example.com",
        confirmNewEmail: "novo@example.com",
      }),
    ).resolves.toBe(true);
  });

  it("altera senha usando o endpoint atual de auth", async () => {
    const store = useUserStore();

    await expect(
      store.updatePassword({
        currentPassword: "SenhaAtual123!",
        newPassword: "NovaSenha123!",
        confirmNewPassword: "NovaSenha123!",
      }),
    ).resolves.toBe(true);
  });

  it("desvincula conta social e atualiza o usuario autenticado", async () => {
    const authStore = useAuthStore();
    const store = useUserStore();

    expect(authStore.isGoogleConnected).toBe(true);

    await expect(store.unlinkAccount("google")).resolves.toBe(true);

    expect(authStore.isGoogleConnected).toBe(false);
    expect(authStore.isDiscordConnected).toBe(true);
  });
});
