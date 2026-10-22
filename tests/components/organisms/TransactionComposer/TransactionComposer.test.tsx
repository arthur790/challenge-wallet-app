// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TransactionComposer } from "@/components/organisms/TransactionComposer/TransactionComposer";

const noop = () => undefined;

function renderComposer(errors: { amountError?: string; recipientError?: string }) {
  return render(
    <TransactionComposer
      amount=""
      contacts={[{ id: "contact-ana", name: "Ana Ruiz", identifier: "5511111111" }]}
      selectedContactId={null}
      newContactName=""
      newContactIdentifier=""
      savingContact={false}
      loading={false}
      summary={null}
      onAmountChange={noop}
      onSelectContact={noop}
      onNewContactNameChange={noop}
      onNewContactIdentifierChange={noop}
      onSaveContact={noop}
      onContinue={noop}
      {...errors}
    />,
  );
}

describe("TransactionComposer", () => {
  afterEach(() => {
    cleanup();
  });

  it("pinta el error de monto en el campo y el de destinatario en favoritos", () => {
    renderComposer({
      amountError: "Ingresa un monto mayor a cero.",
      recipientError: "Elige o guarda un destinatario.",
    });

    const amountField = screen.getByLabelText("Monto").closest("div");
    const favorites = screen.getByRole("heading", { name: "Favoritos" }).closest("section");

    expect(amountField?.textContent).toContain("Ingresa un monto mayor a cero.");
    expect(amountField?.textContent).not.toContain("Elige o guarda un destinatario.");
    expect(favorites?.textContent).toContain("Elige o guarda un destinatario.");
    expect(favorites?.textContent).not.toContain("Ingresa un monto mayor a cero.");
  });
});
