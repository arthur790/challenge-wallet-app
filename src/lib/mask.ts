export function maskIdentifier(value: string): string {
  const trimmed = value.trim();

  if (trimmed.includes("@")) {
    const at = trimmed.indexOf("@");
    const local = trimmed.slice(0, at);
    const domain = trimmed.slice(at + 1);
    const initial = local.slice(0, 1);

    return `${initial}•••@${domain}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  const last4 = digits.slice(-4);

  if (last4.length === 0) {
    return trimmed;
  }

  return `•••• ${last4}`;
}
