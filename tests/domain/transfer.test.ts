import { describe, expect, it } from "vitest";
import { validateTransfer, type TransferDraft } from "@/domain/transfer";

const balance = 2500;

function draft(overrides: Partial<TransferDraft> = {}): TransferDraft {
  return {
    amount: 100,
    recipientId: "contact-1",
    ...overrides,
  };
}

describe("validateTransfer", () => {
  it("acepta un monto positivo dentro del saldo y con destinatario", () => {
    expect(validateTransfer(draft(), balance)).toBeNull();
  });

  it("acepta un monto igual al saldo", () => {
    expect(validateTransfer(draft({ amount: balance }), balance)).toBeNull();
  });

  it("rechaza cero", () => {
    expect(validateTransfer(draft({ amount: 0 }), balance)).toBe(
      "amount-not-positive",
    );
  });

  it("rechaza un monto negativo", () => {
    expect(validateTransfer(draft({ amount: -10 }), balance)).toBe(
      "amount-not-positive",
    );
  });

  it("rechaza NaN", () => {
    expect(validateTransfer(draft({ amount: Number.NaN }), balance)).toBe(
      "amount-not-positive",
    );
  });

  it("rechaza un monto mayor al saldo", () => {
    expect(validateTransfer(draft({ amount: balance + 1 }), balance)).toBe(
      "insufficient-balance",
    );
  });

  it("rechaza destinatario null", () => {
    expect(validateTransfer(draft({ recipientId: null }), balance)).toBe(
      "recipient-required",
    );
  });

  it("rechaza destinatario en blanco", () => {
    expect(validateTransfer(draft({ recipientId: "   " }), balance)).toBe(
      "recipient-required",
    );
  });

  it("prioriza el monto no positivo sobre el destinatario", () => {
    expect(
      validateTransfer(draft({ amount: 0, recipientId: null }), balance),
    ).toBe("amount-not-positive");
  });
});
