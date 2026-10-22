// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TransactionPage from "@/app/transaction/page";
import { useDraftStore } from "@/store/draft";
import { useSessionStore } from "@/store/session";

const { router, fetchWallet, fetchContacts } = vi.hoisted(() => ({
  router: { push: vi.fn(), replace: vi.fn() },
  fetchWallet: vi.fn(),
  fetchContacts: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("@/services/wallet", () => ({
  fetchWallet,
}));

vi.mock("@/services/contacts", () => ({
  fetchContacts,
  createContact: vi.fn(),
}));

const ana = {
  id: "contact-ana",
  name: "Ana Ruiz",
  identifier: "5511111111",
};

describe("TransactionPage", () => {
  beforeEach(() => {
    router.push.mockClear();
    router.replace.mockClear();
    useDraftStore.setState({
      draft: null,
      recipientName: "",
      recipientIdentifier: "",
    });
    useSessionStore.setState({ userId: "user-ada", name: "Ada López" });
    vi.spyOn(useSessionStore.persist, "hasHydrated").mockReturnValue(true);
    fetchWallet.mockResolvedValue({
      user: { userId: "user-ada", name: "Ada López" },
      balance: 100,
      movements: [],
    });
    fetchContacts.mockResolvedValue([ana]);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("repinta el monto y el contacto cuando el borrador aparece tras el primer render", async () => {
    render(<TransactionPage />);

    const input = await screen.findByLabelText("Monto (MXN)");
    expect((input as HTMLInputElement).value).toBe("");

    act(() => {
      useDraftStore.setState({
        draft: { amount: 20, recipientId: ana.id },
        recipientName: ana.name,
        recipientIdentifier: ana.identifier,
      });
    });

    await waitFor(() => {
      expect((screen.getByLabelText("Monto (MXN)") as HTMLInputElement).value).toBe(
        "20.00",
      );
    });
    expect(screen.getByRole("button", { name: /Ana Ruiz/ }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("bloquea continuar cuando el monto supera el saldo", async () => {
    const user = userEvent.setup();

    render(<TransactionPage />);

    const input = await screen.findByLabelText("Monto (MXN)");
    await user.type(input, "150");

    expect(screen.getByRole("alert").textContent).toContain(
      "El monto supera tu saldo disponible.",
    );
    expect(
      (screen.getByRole("button", { name: "Continuar" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(router.push).not.toHaveBeenCalled();
  });
});
