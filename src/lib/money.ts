const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export function formatMoney(amount: number): string {
  return money.format(amount);
}

export function parseAmountInput(raw: string): number {
  const normalized = raw.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return Number.NaN;
  }

  return Number(normalized);
}
