// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSessionStore } from "@/store/session";
import { RequireSession } from "@/app/require-session";

const { router } = vi.hoisted(() => ({
  router: { replace: vi.fn() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

describe("RequireSession", () => {
  beforeEach(() => {
    router.replace.mockClear();
    useSessionStore.setState({ userId: null, name: null });
    vi.spyOn(useSessionStore.persist, "hasHydrated").mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("muestra el spinner y oculta el contenido mientras no hidrata", () => {
    render(
      <RequireSession>
        <p>Saldo</p>
      </RequireSession>,
    );

    expect(screen.queryByText("Saldo")).toBeNull();
    expect(screen.getByRole("heading", { name: "Wallet" })).toBeTruthy();
    expect(document.querySelector(".animate-spin")).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("muestra el contenido cuando la sesión ya hidrató", () => {
    vi.mocked(useSessionStore.persist.hasHydrated).mockReturnValue(true);
    useSessionStore.setState({ userId: "user-ada", name: "Ada López" });

    render(
      <RequireSession>
        <p>Saldo</p>
      </RequireSession>,
    );

    expect(screen.getByText("Saldo")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Wallet" })).toBeNull();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("sigue en el spinner si hidrató sin sesión", () => {
    vi.mocked(useSessionStore.persist.hasHydrated).mockReturnValue(true);

    render(
      <RequireSession>
        <p>Saldo</p>
      </RequireSession>,
    );

    expect(screen.queryByText("Saldo")).toBeNull();
    expect(screen.getByRole("heading", { name: "Wallet" })).toBeTruthy();
    expect(document.querySelector(".animate-spin")).toBeTruthy();
    expect(router.replace).toHaveBeenCalledWith("/login");
  });
});
