// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MovementsList } from "@/components/organisms/MovementsList/MovementsList";

const movement = {
  id: "mov-1",
  title: "Nómina",
  amount: 3200,
  direction: "in" as const,
  createdAt: "2026-10-18T15:00:00.000Z",
};

const older = {
  id: "mov-2",
  title: "Café",
  amount: 85,
  direction: "out" as const,
  createdAt: "2026-10-19T13:30:00.000Z",
};

type ObserverInstance = {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

let instances: ObserverInstance[] = [];

class IntersectionObserverMock implements ObserverInstance {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    instances.push(this);
  }
}

function intersect() {
  const current = instances.at(-1);

  if (!current) {
    throw new Error("No hay un observer activo.");
  }

  current.callback(
    [{ isIntersecting: true } as IntersectionObserverEntry],
    current as unknown as IntersectionObserver,
  );
}

function renderList(
  overrides: Partial<ComponentProps<typeof MovementsList>> = {},
) {
  return render(
    <MovementsList
      movements={[movement]}
      hasMore={false}
      status="idle"
      onLoadMore={() => undefined}
      onRetry={() => undefined}
      {...overrides}
    />,
  );
}

describe("MovementsList", () => {
  beforeEach(() => {
    instances = [];
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra la lista y el estado vacío", () => {
    const view = renderList();

    expect(screen.getByText("Nómina")).toBeTruthy();

    view.rerender(
      <MovementsList
        movements={[]}
        hasMore={false}
        status="idle"
        onLoadMore={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Aún no tienes movimientos")).toBeTruthy();
    expect(screen.getByText("Aquí verás tus transferencias.")).toBeTruthy();
    expect(instances).toHaveLength(0);
  });

  it("pide la siguiente página cuando el sentinel entra en pantalla", () => {
    const onLoadMore = vi.fn();

    renderList({ hasMore: true, onLoadMore });
    intersect();

    expect(instances[0]?.options?.root).toBeNull();
    expect(instances[0]?.options?.rootMargin).toBe("200px");
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("no observa el final si no hay más páginas", () => {
    const onLoadMore = vi.fn();

    renderList({ hasMore: false, onLoadMore });

    expect(instances).toHaveLength(0);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("muestra el spinner de la página siguiente sin observar de nuevo", () => {
    renderList({ hasMore: true, status: "loading-more" });

    expect(screen.getByRole("status").textContent).toContain(
      "Cargando más movimientos",
    );
    expect(screen.getByText("Nómina")).toBeTruthy();
    expect(instances).toHaveLength(0);
  });

  it("conserva las filas y reintenta la misma página", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    renderList({
      movements: [movement, older],
      hasMore: true,
      status: "error-more",
      onRetry,
    });

    expect(screen.getByText("Nómina")).toBeTruthy();
    expect(screen.getByText("Café")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain(
      "No se pudieron cargar más movimientos.",
    );

    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(instances).toHaveLength(0);
  });
});
