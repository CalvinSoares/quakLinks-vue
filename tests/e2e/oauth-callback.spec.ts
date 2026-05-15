import { test, expect } from "@playwright/test";

test("finaliza callback social pelo frontend e navega para o dashboard", async ({
  page,
}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "pendingSocialAuth",
      JSON.stringify({
        provider: "google",
        state: "oauth-state",
      }),
    );
  });

  await page.route("**/auth/oauth/google/callback?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accessToken: "social-access-token",
        refreshToken: "social-refresh-token",
        tokenType: "Bearer",
        expiresAt: "2030-01-01T00:00:00Z",
      }),
    });
  });

  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-1",
        name: "Quack User",
        email: "quack@example.com",
        roles: ["USER"],
        createdAt: "2026-01-01T00:00:00Z",
        accounts: [{ id: "identity-google", provider: "google" }],
        spotifyConnection: null,
      }),
    });
  });

  await page.route("**/pages/me", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "text/plain",
      body: "Pagina nao encontrada",
    });
  });

  await page.goto("/auth/callback/google?code=oauth-code&state=oauth-state");

  await expect(page).toHaveURL(/\/dashboard\/overview/);
});
