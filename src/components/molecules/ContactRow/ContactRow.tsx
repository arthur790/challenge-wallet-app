type ContactRowProps = {
  name: string;
  identifier: string;
  selected: boolean;
  onSelect: () => void;
};

export function ContactRow({
  name,
  identifier,
  selected,
  onSelect,
}: ContactRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left ${
        selected ? "border-accent bg-accent/5" : "border-line bg-surface"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold">{name}</span>
        <span className="block text-sm text-muted">{identifier}</span>
      </span>
    </button>
  );
}
