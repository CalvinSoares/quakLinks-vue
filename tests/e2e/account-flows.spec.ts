import { expect, test, type Page } from "@playwright/test";

const pageResponse = {
  id: "page-1",
  ownerId: "user-1",
  slug: "duck",
  title: "Duck Links",
  bio: "Bio",
  avatarUrl: null,
  theme: "dark",
  backgroundType: "COLOR",
  backgroundColor: "#111827",
  backgroundUrl: null,
  textColor: "#ffffff",
  iconColor: "#ffffff",
  buttonColor: "#f59e0b",
  layoutType: "stack",
  pageLayout: "standard",
  linkStyle: "solid",
  layoutLinkStyle: "column",
  showProfileCard: true,
  profileCardColor: "#111827",
  profileCardOpacity: 1,
  useStandardIconColors: false,
  glowEffect: "none",
  showViewCount: false,
  gradientDirection: null,
  gradientColorA: null,
  gradientColorB: null,
  backgroundVideoUrl: null,
  cursorUrl: null,
  titleEffect: "none",
  customCss: null,
  published: true,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

async function seedAuthenticatedSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "access-token");
    localStorage.setItem("refreshToken", "refresh-token");
  });
}

async function mockAuthenticatedApi(
  page: Page,
  options?: {
    includeSessions?: boolean;
    includePagesList?: boolean;
    includeCredentialChanges?: boolean;
  },
) {
  let accounts = [
    { id: "identity-google", provider: "google" },
    { id: "identity-discord", provider: "discord" },
  ];

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
        accounts,
        spotifyConnection: null,
      }),
    });
  });

  await page.route("**/pages/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pageResponse),
    });
  });

  await page.route("**/pages/page-1/blocks", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.route("**/pages/page-1/audios", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  if (options?.includePagesList) {
    await page.route("**/pages", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([pageResponse]),
      });
    });
  }

  if (options?.includeSessions) {
    await page.route("**/auth/sessions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sessions: [
            {
              id: "session-1",
              userId: "user-1",
              createdAt: "2026-01-01T00:00:00Z",
              expiresAt: "2030-01-01T00:00:00Z",
              revoked: false,
              active: true,
            },
          ],
        }),
      });
    });

    await page.route("**/auth/logout-all", async (route) => {
      await route.fulfill({ status: 204 });
    });
  }

  if (options?.includeCredentialChanges) {
    await page.route("**/auth/email", async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.route("**/auth/password", async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.route("**/auth/logout", async (route) => {
      await route.fulfill({ status: 204 });
    });
  }

  await page.route("**/auth/connections/google", async (route) => {
    accounts = accounts.filter((account) => account.provider !== "google");
    await route.fulfill({ status: 204 });
  });
}

test("lista sessoes em settings e encerra todas com redirect para login", async ({
  page,
}) => {
  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includeSessions: true });

  await page.goto("/settings");

  await expect(page.getByText("Sessão ativa")).toBeVisible();

  await page.getByRole("button", { name: "Encerrar todas as sessões" }).click();

  await expect(page).toHaveURL(/\/login$/);
});

test("desvincula Google no overview e reflete o novo estado na UI", async ({
  page,
}) => {
  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includePagesList: true });

  await page.goto("/dashboard/overview");

  await expect(page.getByRole("heading", { name: "Google" })).toBeVisible();
  const googleButton = page.getByRole("button", { name: "Desvincular" }).nth(1);
  await expect(googleButton).toBeVisible();

  await googleButton.click();

  await expect(page.getByRole("button", { name: "Conectar" })).toBeVisible();
});

test("altera e-mail e encerra a sessao com redirect para login", async ({
  page,
}) => {
  let emailPayload: Record<string, string> | null = null;
  let logoutPayload: Record<string, string> | null = null;

  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includeCredentialChanges: true });

  await page.route("**/auth/email", async (route) => {
    emailPayload = (await route.request().postDataJSON()) as Record<
      string,
      string
    >;
    await route.fulfill({ status: 204 });
  });

  await page.route("**/auth/logout", async (route) => {
    logoutPayload = (await route.request().postDataJSON()) as Record<
      string,
      string
    >;
    await route.fulfill({ status: 204 });
  });

  await page.goto("/settings");
  await page.getByRole("button", { name: "Alterar e-mail" }).click();

  await expect(
    page.getByRole("heading", { name: "Alterar E-mail" }),
  ).toBeVisible();
  await page.getByPlaceholder("Senha atual").fill("current-password");
  await page
    .locator('input[placeholder="Novo e-mail"]')
    .fill("updated@example.com");
  await page
    .locator('input[placeholder="Confirmar novo e-mail"]')
    .fill("updated@example.com");

  await page.getByRole("button", { name: "Salvar novo e-mail" }).click();

  await expect
    .poll(() => emailPayload)
    .toEqual({
      currentPassword: "current-password",
      newEmail: "updated@example.com",
    });
  await expect
    .poll(() => logoutPayload)
    .toEqual({
      refreshToken: "refresh-token",
    });
  await expect(page).toHaveURL(/\/login$/);
});

test("altera senha e encerra a sessao com redirect para login", async ({
  page,
}) => {
  let passwordPayload: Record<string, string> | null = null;
  let logoutPayload: Record<string, string> | null = null;

  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includeCredentialChanges: true });

  await page.route("**/auth/password", async (route) => {
    passwordPayload = (await route.request().postDataJSON()) as Record<
      string,
      string
    >;
    await route.fulfill({ status: 204 });
  });

  await page.route("**/auth/logout", async (route) => {
    logoutPayload = (await route.request().postDataJSON()) as Record<
      string,
      string
    >;
    await route.fulfill({ status: 204 });
  });

  await page.goto("/settings");
  await page.getByRole("button", { name: "Alterar senha" }).click();

  await expect(
    page.getByRole("heading", { name: "Alterar Senha" }),
  ).toBeVisible();
  await page.getByPlaceholder("Senha atual").fill("current-password");
  await page
    .locator('input[placeholder="Nova senha"]')
    .fill("new-password-123");
  await page
    .locator('input[placeholder="Confirmar nova senha"]')
    .fill("new-password-123");
  await page.getByRole("button", { name: "Salvar nova senha" }).click();

  await expect
    .poll(() => passwordPayload)
    .toEqual({
      currentPassword: "current-password",
      newPassword: "new-password-123",
    });
  await expect
    .poll(() => logoutPayload)
    .toEqual({
      refreshToken: "refresh-token",
    });
  await expect(page).toHaveURL(/\/login$/);
});

test("mostra erro ao tentar alterar e-mail com senha atual invalida", async ({
  page,
}) => {
  let logoutCalled = false;

  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includeCredentialChanges: true });

  await page.route("**/auth/email", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Senha atual invalida.",
      }),
    });
  });

  await page.route("**/auth/logout", async (route) => {
    logoutCalled = true;
    await route.fulfill({ status: 204 });
  });

  await page.goto("/settings");
  await page.getByRole("button", { name: "Alterar e-mail" }).click();

  await page.getByPlaceholder("Senha atual").fill("wrong-password");
  await page
    .locator('input[placeholder="Novo e-mail"]')
    .fill("updated@example.com");
  await page
    .locator('input[placeholder="Confirmar novo e-mail"]')
    .fill("updated@example.com");
  await page.getByRole("button", { name: "Salvar novo e-mail" }).click();

  await expect(page.getByText("Senha atual invalida.")).toBeVisible();
  expect(logoutCalled).toBe(false);
  await expect(page).toHaveURL(/\/settings$/);
});

test("mostra erro ao tentar alterar senha com senha atual invalida", async ({
  page,
}) => {
  let logoutCalled = false;

  await seedAuthenticatedSession(page);
  await mockAuthenticatedApi(page, { includeCredentialChanges: true });

  await page.route("**/auth/password", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Senha atual invalida.",
      }),
    });
  });

  await page.route("**/auth/logout", async (route) => {
    logoutCalled = true;
    await route.fulfill({ status: 204 });
  });

  await page.goto("/settings");
  await page.getByRole("button", { name: "Alterar senha" }).click();

  await page.getByPlaceholder("Senha atual").fill("wrong-password");
  await page
    .locator('input[placeholder="Nova senha"]')
    .fill("new-password-123");
  await page
    .locator('input[placeholder="Confirmar nova senha"]')
    .fill("new-password-123");
  await page.getByRole("button", { name: "Salvar nova senha" }).click();

  await expect(page.getByText("Senha atual invalida.")).toBeVisible();
  expect(logoutCalled).toBe(false);
  await expect(page).toHaveURL(/\/settings$/);
});
