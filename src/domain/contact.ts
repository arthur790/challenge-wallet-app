import { parseIdentifier } from "@/domain/identifier";

export type ContactViolation = "name-required" | "identifier-invalid";

export function validateNewContact(input: {
  name: string;
  identifier: string;
}): ContactViolation | null {
  if (input.name.trim().length === 0) {
    return "name-required";
  }

  if (!parseIdentifier(input.identifier)) {
    return "identifier-invalid";
  }

  return null;
}
