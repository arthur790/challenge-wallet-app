"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MovementsList,
  type MovementsListStatus,
} from "@/components/organisms/MovementsList/MovementsList";
import type { Movement } from "@/domain/wallet";
import { fetchMovementPage } from "@/services/wallet";

type HomeMovementsProps = {
  initialMovements: Movement[];
  nextCursor: string | null;
};

export function HomeMovements({
  initialMovements,
  nextCursor,
}: HomeMovementsProps) {
  const [movements, setMovements] = useState(initialMovements);
  const [cursor, setCursor] = useState(nextCursor);
  const [status, setStatus] = useState<MovementsListStatus>("idle");
  const cursorRef = useRef(nextCursor);
  const requestRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const load = useCallback(async (target: string) => {
    if (requestRef.current) {
      return;
    }

    requestRef.current = target;
    setStatus("loading-more");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const page = await fetchMovementPage(target, controller.signal);

      if (requestRef.current !== target) {
        return;
      }

      setMovements((current) => {
        const seen = new Set(current.map((item) => item.id));
        const next = page.movements.filter((item) => !seen.has(item.id));
        return [...current, ...next];
      });
      cursorRef.current = page.nextCursor;
      setCursor(page.nextCursor);
      setStatus("idle");
    } catch {
      if (controller.signal.aborted || requestRef.current !== target) {
        return;
      }

      setStatus("error-more");
    } finally {
      if (requestRef.current === target) {
        requestRef.current = null;
      }
    }
  }, []);

  const onLoadMore = useCallback(() => {
    const target = cursorRef.current;

    if (target) {
      void load(target);
    }
  }, [load]);

  const onRetry = useCallback(() => {
    const target = cursorRef.current;

    if (target) {
      void load(target);
    }
  }, [load]);

  return (
    <MovementsList
      movements={movements}
      hasMore={cursor !== null}
      status={status}
      onLoadMore={onLoadMore}
      onRetry={onRetry}
    />
  );
}
