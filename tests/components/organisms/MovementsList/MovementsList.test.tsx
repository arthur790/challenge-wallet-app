// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MovementsList } from "@/components/organisms/MovementsList/MovementsList";

const movement = {
  id: "mov-1",
  title: "Nómina",
  amount: 3200,
  direction: "in" as const,
  createdAt: "2026-10-18T15:00:00.000Z",
};

describe("MovementsList", () => {
  it("muestra la lista y el estado vacío", () => {
    const view = render(<MovementsList movements={[movement]} />);

    expect(screen.getByText("Nómina")).toBeTruthy();

    view.rerender(<MovementsList movements={[]} />);

    expect(screen.getByText("Aún no tienes movimientos.")).toBeTruthy();
  });
});
