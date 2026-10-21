import { describe, expect, it } from "vitest";
import { CONFIRMATION_STATUSES } from "@/domain/confirmation";

describe("CONFIRMATION_STATUSES", () => {
  it("lista exactamente los cinco escenarios del challenge", () => {
    expect(CONFIRMATION_STATUSES).toEqual([
      "success",
      "network-error",
      "insufficient-funds",
      "timeout",
      "unknown-error",
    ]);
  });
});
