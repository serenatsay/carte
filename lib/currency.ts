export function formatMoney(amount: number, currency: string | undefined) {
  try {
    if (!currency) return amount.toFixed(2);
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? ""}`.trim();
  }
}


