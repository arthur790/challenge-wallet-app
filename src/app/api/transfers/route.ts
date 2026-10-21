import { settleTransfer } from "@/server/store";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const draft = readDraft(body);

  if (!draft) {
    return Response.json({ error: "invalid-transfer" }, { status: 400 });
  }

  const outcome = await settleTransfer({
    amount: draft.amount,
    recipientId: draft.recipientId,
    forcedStatus: request.headers.get("x-mock-outcome"),
  });

  return Response.json(outcome);
}

function readDraft(
  body: unknown,
): { amount: number; recipientId: string } | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  if (!("amount" in body) || !("recipientId" in body)) {
    return null;
  }

  if (typeof body.amount !== "number" || typeof body.recipientId !== "string") {
    return null;
  }

  if (!Number.isFinite(body.amount) || body.recipientId.trim().length === 0) {
    return null;
  }

  return { amount: body.amount, recipientId: body.recipientId };
}
