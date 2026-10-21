// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginForm } from "@/components/organisms/LoginForm/LoginForm";

describe("LoginForm", () => {
  it("pinta el error y deshabilita el botón mientras carga", () => {
    render(
      <LoginForm
        identifier="ada@wallet.test"
        onIdentifierChange={() => undefined}
        onSubmit={() => undefined}
        loading
        error="No pudimos iniciar sesión."
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain(
      "No pudimos iniciar sesión.",
    );
    expect(
      (screen.getByRole("button", { name: "Entrar" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(document.querySelector("form")?.getAttribute("aria-busy")).toBe(
      "true",
    );
  });
});
