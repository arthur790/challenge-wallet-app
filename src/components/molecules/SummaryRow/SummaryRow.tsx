type SummaryRowProps = {
  label: string;
  value: string;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="min-w-0 break-all text-right font-semibold">{value}</span>
    </div>
  );
}
