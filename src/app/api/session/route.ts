import { parseIdentifier } from "@/domain/identifier";
import { delay } from "@/server/delay";
import { getSessionUser, isSimulatedIdentifier } from "@/server/store";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const identifier = readIdentifier(body);
  const parsed = identifier ? parseIdentifier(identifier) : null;

  if (!parsed) {
    return Response.json({ error: "invalid-identifier" }, { status: 400 });
  }

  await delay(700);

  if (isSimulatedIdentifier(parsed.value)) {
    return Response.json({ error: "simulated" }, { status: 401 });
  }

  return Response.json(getSessionUser());
}

function readIdentifier(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("identifier" in body)) {
    return null;
  }

  const identifier = body.identifier;
  return typeof identifier === "string" ? identifier : null;
}
