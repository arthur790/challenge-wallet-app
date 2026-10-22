export const CONFIRMATION_STATUSES = [
  "success",
  "network-error",
  "insufficient-funds",
  "timeout",
  "unknown-error",
] as const;

export type ConfirmationStatus = (typeof CONFIRMATION_STATUSES)[number];

export type Receipt = {
  id: string;
  amount: number;
  recipientName: string;
  createdAt: string;
  balanceAfter: number;
};

export type ConfirmationOutcome =
  | { status: "success"; receipt: Receipt }
  | { status: "network-error" }
  | { status: "insufficient-funds" }
  | { status: "timeout" }
  | { status: "unknown-error" };

export function isConfirmationStatus(value: string): value is ConfirmationStatus {
  return (CONFIRMATION_STATUSES as readonly string[]).includes(value);
}
