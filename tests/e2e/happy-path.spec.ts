import { expect, test } from "@playwright/test";

test("login, home, transacción y comprobante", async ({ page }) => {
  await page.route("**/api/transfers", async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        "x-mock-outcome": "success",
      },
    });
  });

  await page.goto("/");
  await page.getByLabel("Teléfono o email").fill("ada@wallet.test");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Ada López")).toBeVisible();
  await expect(page.getByText("Saldo disponible")).toBeVisible();

  await page.getByRole("link", { name: "Nueva transacción" }).click();
  await page.getByLabel("Monto").fill("20");
  await page.getByRole("button", { name: /Ana Ruiz/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Destinatario")).toBeVisible();
  await page.getByRole("button", { name: "Confirmar" }).click();
  await expect(page.getByRole("heading", { name: "Comprobante" })).toBeVisible();
});
