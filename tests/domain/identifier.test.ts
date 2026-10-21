import { describe, expect, it } from "vitest";
import { parseIdentifier } from "@/domain/identifier";

describe("parseIdentifier", () => {
  it("rechaza vacío", () => {
    expect(parseIdentifier("")).toBeNull();
    expect(parseIdentifier("   ")).toBeNull();
  });

  it("acepta un email válido", () => {
    expect(parseIdentifier("ada@wallet.test")).toEqual({
      kind: "email",
      value: "ada@wallet.test",
    });
  });

  it("rechaza un email inválido", () => {
    expect(parseIdentifier("ada@")).toBeNull();
    expect(parseIdentifier("ada@wallet")).toBeNull();
  });

  it("acepta 10 dígitos", () => {
    expect(parseIdentifier("5512345678")).toEqual({
      kind: "phone",
      value: "5512345678",
    });
  });

  it("rechaza 9 dígitos", () => {
    expect(parseIdentifier("551234567")).toBeNull();
  });

  it("acepta un teléfono con espacios", () => {
    expect(parseIdentifier("55 1234 5678")).toEqual({
      kind: "phone",
      value: "5512345678",
    });
  });
});
