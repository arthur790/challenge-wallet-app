export type Identifier =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseIdentifier(raw: string): Identifier | null {
  const value = raw.trim();

  if (value.length === 0) {
    return null;
  }

  if (value.includes("@")) {
    if (!EMAIL_PATTERN.test(value)) {
      return null;
    }

    return { kind: "email", value };
  }

  const digits = value.replace(/\s+/g, "");

  if (!/^\d{10}$/.test(digits)) {
    return null;
  }

  return { kind: "phone", value: digits };
}
