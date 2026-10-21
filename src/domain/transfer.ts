export type TransferViolation =
  | "amount-not-positive"
  | "insufficient-balance"
  | "recipient-required";

export type TransferDraft = {
  amount: number;
  recipientId: string | null;
};

export function validateTransfer(
  draft: TransferDraft,
  availableBalance: number,
): TransferViolation | null {
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) {
    return "amount-not-positive";
  }

  if (draft.amount > availableBalance) {
    return "insufficient-balance";
  }

  if (!draft.recipientId || draft.recipientId.trim().length === 0) {
    return "recipient-required";
  }

  return null;
}
