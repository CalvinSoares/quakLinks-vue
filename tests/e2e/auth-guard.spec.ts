import { test, expect } from "@playwright/test";

test("redireciona visitante nao autenticado para login ao abrir rota protegida", async ({
  page,
}) => {
  await page.goto("/dashboard/overview");

  await expect(page).toHaveURL(/\/login$/);
});
