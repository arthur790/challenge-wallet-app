import type { Movement, MovementPage, Wallet } from "@/domain/wallet";
import { requestJson } from "@/services/http";

export async function fetchWallet(): Promise<Wallet> {
  const payload = await requestJson("/api/wallet");

  if (!isWallet(payload)) {
    throw new Error("wallet-payload");
  }

  return payload;
}

export async function fetchMovementPage(
  cursor: string,
  signal?: AbortSignal,
): Promise<MovementPage> {
  const payload = await requestJson(
    `/api/wallet/movements?cursor=${encodeURIComponent(cursor)}`,
    { signal },
  );

  if (!isMovementPage(payload)) {
    throw new Error("movements-payload");
  }

  return payload;
}

function isMovementPage(value: unknown): value is MovementPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (!("movements" in value) || !("nextCursor" in value)) {
    return false;
  }

  if (!Array.isArray(value.movements)) {
    return false;
  }

  if (value.nextCursor !== null && typeof value.nextCursor !== "string") {
    return false;
  }

  return value.movements.every(isMovement);
}

function isMovement(value: unknown): value is Movement {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "id" in value &&
    "title" in value &&
    "amount" in value &&
    "direction" in value &&
    "createdAt" in value &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.amount === "number" &&
    (value.direction === "in" || value.direction === "out") &&
    typeof value.createdAt === "string"
  );
}

function isWallet(value: unknown): value is Wallet {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "balance" in value &&
    "user" in value &&
    "movements" in value &&
    typeof value.balance === "number" &&
    Array.isArray(value.movements) &&
    isUser(value.user)
  );
}

function isUser(value: unknown): value is Wallet["user"] {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "userId" in value &&
    "name" in value &&
    typeof value.userId === "string" &&
    typeof value.name === "string"
  );
}
