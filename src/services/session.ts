import type { SessionUser } from "@/domain/wallet";
import { HttpError, requestJson } from "@/services/http";

export class SimulatedLoginError extends Error {
  constructor() {
    super("simulated");
    this.name = "SimulatedLoginError";
  }
}

export async function login(identifier: string): Promise<SessionUser> {
  try {
    const payload = await requestJson("/api/session", {
      method: "POST",
      body: JSON.stringify({ identifier }),
    });

    if (!isSessionUser(payload)) {
      throw new Error("login-failed");
    }

    return payload;
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      throw new SimulatedLoginError();
    }

    throw error;
  }
}

function isSessionUser(value: unknown): value is SessionUser {
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
