import { AmountText } from "@/components/atoms/AmountText/AmountText";
import { SummaryRow } from "@/components/molecules/SummaryRow/SummaryRow";
import type { Receipt } from "@/domain/confirmation";
import { formatMoney } from "@/lib/money";

type ReceiptCardProps = {
  receipt: Receipt;
};

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface px-5 py-5">
      <p className="text-sm font-semibold text-success">Transferencia hecha</p>
      <h2 className="text-lg font-semibold">Comprobante</h2>
      <p className="text-3xl font-semibold tracking-tight">
        <AmountText amount={receipt.amount} />
      </p>
      <dl className="flex flex-col gap-2">
        <SummaryRow label="Destinatario" value={receipt.recipientName} />
        <SummaryRow
          label="Fecha"
          value={dateFormat.format(new Date(receipt.createdAt))}
        />
        <SummaryRow label="Folio" value={receipt.id} />
        <SummaryRow label="Comisión" value="Sin comisión" />
        <SummaryRow label="Saldo después" value={formatMoney(receipt.balanceAfter)} />
      </dl>
    </section>
  );
}
