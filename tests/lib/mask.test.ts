import { describe, expect, it } from "vitest";
import { maskIdentifier } from "@/lib/mask";

describe("maskIdentifier", () => {
  it("deja solo los últimos 4 dígitos de un teléfono", () => {
    expect(maskIdentifier("5511111111")).toBe("•••• 1111");
  });

  it("deja la inicial y el dominio de un email", () => {
    expect(maskIdentifier("ana@wallet.test")).toBe("a•••@wallet.test");
  });
});
