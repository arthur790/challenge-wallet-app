import { AmountText } from "@/components/atoms/AmountText/AmountText";
import { Badge } from "@/components/atoms/Badge/Badge";

type MovementItemProps = {
  title: string;
  amount: number;
  direction: "in" | "out";
  createdAt: string;
};

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

export function MovementItem({
  title,
  amount,
  direction,
  createdAt,
}: MovementItemProps) {
  const tone = direction === "in" ? "text-success" : "text-danger";

  return (
    <li className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 flex items-center gap-2 text-xs text-muted">
          <Badge tone={direction}>{direction === "in" ? "Entrada" : "Salida"}</Badge>
          {dateFormat.format(new Date(createdAt))}
        </span>
      </span>
      <span className={`text-sm font-semibold ${tone}`}>
        {direction === "out" ? "−" : "+"}
        <AmountText amount={amount} />
      </span>
    </li>
  );
}
