import type { Wallet } from "@/domain/wallet";
import { requestJson } from "@/services/http";

export async function fetchWallet(): Promise<Wallet> {
  const payload = await requestJson("/api/wallet");

  if (!isWallet(payload)) {
    throw new Error("wallet-payload");
  }

  return payload;
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
