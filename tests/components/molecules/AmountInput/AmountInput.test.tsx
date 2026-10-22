// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AmountInput } from "@/components/molecules/AmountInput/AmountInput";

describe("AmountInput", () => {
  it("emite el texto y muestra el error", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<AmountInput value="" onChange={onChange} error="Monto inválido" />);

    const input = screen.getByLabelText("Monto (MXN)");

    expect(screen.getByRole("alert").textContent).toContain("Monto inválido");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain("amount-error");
    await user.type(input, "1");
    expect(onChange).toHaveBeenCalledWith("1");
  });
});
