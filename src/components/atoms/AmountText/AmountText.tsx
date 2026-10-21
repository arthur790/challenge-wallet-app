import { formatMoney } from "@/lib/money";

type AmountTextProps = {
  amount: number;
};

export function AmountText({ amount }: AmountTextProps) {
  return <span>{formatMoney(amount)}</span>;
}
