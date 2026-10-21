import Link from "next/link";
import { buttonClassName } from "@/components/atoms/Button/Button";
import { BalanceHeader } from "@/components/organisms/BalanceHeader/BalanceHeader";
import { MovementsList } from "@/components/organisms/MovementsList/MovementsList";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { getWallet } from "@/server/store";
import { RequireSession } from "../require-session";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ view?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { view } = await searchParams;
  const selected = Array.isArray(view) ? view[0] : view;

  if (selected === "error") {
    throw new Error("No se pudo cargar tu wallet.");
  }

  const wallet = await getWallet(selected);

  return (
    <RequireSession>
      <WalletTemplate
        title="Inicio"
        primaryAction={
          <Link href="/transaction" className={buttonClassName()}>
            Nueva transacción
          </Link>
        }
      >
        <BalanceHeader name={wallet.user.name} balance={wallet.balance} />
        <MovementsList movements={wallet.movements} />
      </WalletTemplate>
    </RequireSession>
  );
}
