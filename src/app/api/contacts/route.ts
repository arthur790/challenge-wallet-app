import { validateNewContact } from "@/domain/contact";
import { addContact, listContacts } from "@/server/store";

export function GET() {
  return Response.json(listContacts());
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const input = readContact(body);

  if (!input || validateNewContact(input)) {
    return Response.json({ error: "invalid-contact" }, { status: 400 });
  }

  return Response.json(addContact(input), { status: 201 });
}

function readContact(body: unknown): { name: string; identifier: string } | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  if (!("name" in body) || !("identifier" in body)) {
    return null;
  }

  if (typeof body.name !== "string" || typeof body.identifier !== "string") {
    return null;
  }

  return { name: body.name, identifier: body.identifier };
}
