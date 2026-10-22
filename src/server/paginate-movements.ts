import type { Movement, MovementPage } from "@/domain/wallet";

export const MOVEMENT_PAGE_SIZE = 10;

export function paginateMovements(
  movements: readonly Movement[],
  cursor: string | null,
): MovementPage {
  if (cursor === null) {
    return pageFrom(movements, 0);
  }

  const index = movements.findIndex((movement) => movement.id === cursor);

  if (index === -1) {
    return { movements: [], nextCursor: null };
  }

  return pageFrom(movements, index + 1);
}

function pageFrom(movements: readonly Movement[], start: number): MovementPage {
  const page = movements.slice(start, start + MOVEMENT_PAGE_SIZE);
  const last = page.at(-1);
  const hasMore = start + page.length < movements.length;

  return {
    movements: [...page],
    nextCursor: hasMore && last ? last.id : null,
  };
}
