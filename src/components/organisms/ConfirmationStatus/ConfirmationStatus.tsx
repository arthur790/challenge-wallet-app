import { Button } from "@/components/atoms/Button/Button";

type ConfirmationStatusProps = {
  title: string;
  description: string;
  onRetry?: () => void;
};

export function ConfirmationStatus({
  title,
  description,
  onRetry,
}: ConfirmationStatusProps) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface px-5 py-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </section>
  );
}
