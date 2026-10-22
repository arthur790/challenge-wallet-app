import { AmountText } from "@/components/atoms/AmountText/AmountText";

type BalanceHeaderProps = {
  balance: number;
};

export function BalanceHeader({ balance }: BalanceHeaderProps) {
  return (
    <section className="shrink-0 rounded-3xl bg-accent px-5 py-6 text-white">
      <p className="text-sm font-medium text-white">Saldo disponible</p>
      <p className="mt-1 text-4xl font-semibold tracking-tight">
        <AmountText amount={balance} />
      </p>
    </section>
  );
}
