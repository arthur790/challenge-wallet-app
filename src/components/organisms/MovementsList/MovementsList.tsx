"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { MovementItem } from "@/components/molecules/MovementItem/MovementItem";
import type { Movement } from "@/domain/wallet";

export type MovementsListStatus = "idle" | "loading-more" | "error-more";

type MovementsListProps = {
  movements: Movement[];
  hasMore: boolean;
  status: MovementsListStatus;
  onLoadMore: () => void;
  onRetry: () => void;
};

export function MovementsList({
  movements,
  hasMore,
  status,
  onLoadMore,
  onRetry,
}: MovementsListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || status !== "idle") {
      return;
    }

    const node = sentinelRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "200px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, movements.length, onLoadMore, status]);

  if (movements.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-semibold">Movimientos</h2>
        <p className="mt-3 text-sm text-muted">Aún no tienes movimientos.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-semibold">Movimientos</h2>
      <ul className="mt-2">
        {movements.map((movement) => (
          <MovementItem
            key={movement.id}
            title={movement.title}
            amount={movement.amount}
            direction={movement.direction}
            createdAt={movement.createdAt}
          />
        ))}
      </ul>
      {status === "loading-more" ? (
        <div className="flex justify-center py-4" role="status">
          <Spinner />
          <span className="sr-only">Cargando más movimientos</span>
        </div>
      ) : null}
      {status === "error-more" ? (
        <div className="mt-3 flex flex-col gap-3" role="alert">
          <p className="text-sm text-danger">
            No se pudieron cargar más movimientos.
          </p>
          <Button type="button" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : null}
      {hasMore ? <div ref={sentinelRef} aria-hidden="true" /> : null}
    </section>
  );
}
