type ConfirmationStatusProps = {
  title: string;
  description: string;
};

export function ConfirmationStatus({ title, description }: ConfirmationStatusProps) {
  return (
    <section className="flex flex-col gap-2 rounded-3xl border border-line bg-surface px-5 py-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
    </section>
  );
}
