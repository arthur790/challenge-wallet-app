import type { Contact } from "@/domain/wallet";
import { requestJson } from "@/services/http";

export async function fetchContacts(): Promise<Contact[]> {
  const payload = await requestJson("/api/contacts");

  if (!Array.isArray(payload) || !payload.every(isContact)) {
    throw new Error("contacts-payload");
  }

  return payload;
}

export async function createContact(input: {
  name: string;
  identifier: string;
}): Promise<Contact> {
  const payload = await requestJson("/api/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!isContact(payload)) {
    throw new Error("contact-payload");
  }

  return payload;
}

function isContact(value: unknown): value is Contact {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "id" in value &&
    "name" in value &&
    "identifier" in value &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.identifier === "string"
  );
}
