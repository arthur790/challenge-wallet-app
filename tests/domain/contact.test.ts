import { describe, expect, it } from "vitest";
import { validateNewContact } from "@/domain/contact";

describe("validateNewContact", () => {
  it("rechaza un nombre vacío", () => {
    expect(
      validateNewContact({ name: "   ", identifier: "ada@wallet.test" }),
    ).toBe("name-required");
  });

  it("rechaza un identificador inválido", () => {
    expect(validateNewContact({ name: "Ada", identifier: "123" })).toBe(
      "identifier-invalid",
    );
  });

  it("acepta nombre con email", () => {
    expect(
      validateNewContact({ name: "Ada", identifier: "ada@wallet.test" }),
    ).toBeNull();
  });

  it("acepta nombre con teléfono de 10 dígitos", () => {
    expect(
      validateNewContact({ name: "Ada", identifier: "55 1234 5678" }),
    ).toBeNull();
  });
});
