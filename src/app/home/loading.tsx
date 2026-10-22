import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";

export default function HomeLoading() {
  return (
    <WalletTemplate title="Cargando">
      <p className="sr-only" role="status">
        Cargando tu saldo y tus movimientos
      </p>
      <div aria-hidden="true" className="flex flex-col gap-6">
        <div className="rounded-3xl bg-accent/10 px-5 py-6">
          <Skeleton className="h-4 w-32 bg-accent/15" />
          <Skeleton className="mt-4 h-10 w-44 bg-accent/15" />
        </div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </WalletTemplate>
  );
}
