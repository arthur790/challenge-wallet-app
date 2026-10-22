import { describe, expect, it } from "vitest";
import type { Movement } from "@/domain/wallet";
import {
  MOVEMENT_PAGE_SIZE,
  paginateMovements,
} from "@/server/paginate-movements";

function movements(count: number): Movement[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `mov-${index + 1}`,
    title: `Movimiento ${index + 1}`,
    amount: index + 1,
    direction: index % 2 === 0 ? "in" : "out",
    createdAt: "2026-10-01T12:00:00.000Z",
  }));
}

describe("paginateMovements", () => {
  it("devuelve la primera página y el cursor del último ítem", () => {
    const page = paginateMovements(movements(12), null);

    expect(MOVEMENT_PAGE_SIZE).toBe(10);
    expect(page.movements).toHaveLength(10);
    expect(page.movements[0]?.id).toBe("mov-1");
    expect(page.nextCursor).toBe("mov-10");
  });

  it("devuelve la página siguiente a partir del cursor", () => {
    const page = paginateMovements(movements(25), "mov-10");

    expect(page.movements.map((movement) => movement.id)).toEqual([
      "mov-11",
      "mov-12",
      "mov-13",
      "mov-14",
      "mov-15",
      "mov-16",
      "mov-17",
      "mov-18",
      "mov-19",
      "mov-20",
    ]);
    expect(page.nextCursor).toBe("mov-20");
  });

  it("cierra la última página con nextCursor null", () => {
    const page = paginateMovements(movements(12), "mov-10");

    expect(page.movements.map((movement) => movement.id)).toEqual([
      "mov-11",
      "mov-12",
    ]);
    expect(page.nextCursor).toBeNull();
  });

  it("devuelve una página vacía si no hay movimientos", () => {
    expect(paginateMovements([], null)).toEqual({
      movements: [],
      nextCursor: null,
    });
  });

  it("corta el recorrido si el cursor no existe", () => {
    expect(paginateMovements(movements(12), "missing")).toEqual({
      movements: [],
      nextCursor: null,
    });
  });
});
