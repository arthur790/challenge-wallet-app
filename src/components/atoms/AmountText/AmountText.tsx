import { formatMoney } from "@/lib/money";

type AmountTextProps = {
  amount: number;
};

export function AmountText({ amount }: AmountTextProps) {
  return <span className="tabular-nums">{formatMoney(amount)}</span>;
}
