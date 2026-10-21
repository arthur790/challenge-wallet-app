import { MovementItem } from "@/components/molecules/MovementItem/MovementItem";
import type { Movement } from "@/domain/wallet";

type MovementsListProps = {
  movements: Movement[];
};

export function MovementsList({ movements }: MovementsListProps) {
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
    </section>
  );
}
