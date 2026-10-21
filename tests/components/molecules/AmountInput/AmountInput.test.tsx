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

    expect(screen.getByRole("alert").textContent).toContain("Monto inválido");
    await user.type(screen.getByLabelText("Monto"), "1");
    expect(onChange).toHaveBeenCalledWith("1");
  });
});
