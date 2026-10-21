import { AmountText } from "@/components/atoms/AmountText/AmountText";

type BalanceHeaderProps = {
  name: string;
  balance: number;
};

export function BalanceHeader({ name, balance }: BalanceHeaderProps) {
  return (
    <section className="rounded-3xl bg-accent px-5 py-6 text-white">
      <p className="text-sm text-white/80">{name}</p>
      <p className="mt-4 text-sm text-white/80">Saldo disponible</p>
      <p className="mt-1 text-4xl font-semibold tracking-tight">
        <AmountText amount={balance} />
      </p>
    </section>
  );
}
