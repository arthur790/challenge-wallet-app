import { expect, test } from "@playwright/test";

test("reintenta un error de red y llega al comprobante", async ({ page }) => {
  let calls = 0;

  await page.route("**/api/transfers", async (route) => {
    calls += 1;
    await route.continue({
      headers: {
        ...route.request().headers(),
        "x-mock-outcome": calls === 1 ? "network-error" : "success",
      },
    });
  });

  await page.goto("/");
  await page.getByLabel("Teléfono o email").fill("mia@wallet.test");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByRole("link", { name: "Nueva transacción" }).click();
  await page.getByLabel("Monto").fill("15");
  await page.getByRole("button", { name: /Luis Mora/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Confirmar" }).click();
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeVisible();
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("heading", { name: "Comprobante" })).toBeVisible();
});
