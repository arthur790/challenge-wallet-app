import {
  isConfirmationStatus,
  type ConfirmationOutcome,
  type ConfirmationStatus,
} from "@/domain/confirmation";
import type { TransferDraft } from "@/domain/transfer";
import { HttpError, NetworkError, requestJson } from "@/services/http";

export async function confirmTransfer(
  draft: TransferDraft,
  forced?: ConfirmationStatus,
): Promise<ConfirmationOutcome> {
  try {
    const payload = await requestJson("/api/transfers", {
      method: "POST",
      headers: forced ? { "x-mock-outcome": forced } : undefined,
      body: JSON.stringify({
        amount: draft.amount,
        recipientId: draft.recipientId,
      }),
    });

    if (!isOutcome(payload)) {
      return { status: "unknown-error" };
    }

    return payload;
  } catch (error) {
    if (error instanceof NetworkError) {
      return { status: "network-error" };
    }

    if (error instanceof HttpError) {
      return { status: "unknown-error" };
    }

    return { status: "network-error" };
  }
}

function isOutcome(value: unknown): value is ConfirmationOutcome {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }

  if (typeof value.status !== "string" || !isConfirmationStatus(value.status)) {
    return false;
  }

  if (value.status !== "success") {
    return true;
  }

  return (
    "receipt" in value &&
    !!value.receipt &&
    typeof value.receipt === "object" &&
    "id" in value.receipt &&
    "amount" in value.receipt &&
    "recipientName" in value.receipt &&
    "createdAt" in value.receipt
  );
}
