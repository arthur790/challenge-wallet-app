import Link from "next/link";
import { buttonClassName } from "@/components/atoms/Button/Button";
import { BalanceHeader } from "@/components/organisms/BalanceHeader/BalanceHeader";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";
import { getWallet, listMovements } from "@/server/store";
import { RequireSession } from "../require-session";
import { HomeMovements } from "./home-movements";

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
  const movementPage = listMovements({ cursor: null, view: selected });

  return (
    <RequireSession>
      <WalletTemplate title={`Hola, ${wallet.user.name}`}>
        <BalanceHeader balance={wallet.balance} />
        <Link href="/transaction" className={`${buttonClassName()} shrink-0`}>
          Nueva transacción
        </Link>
        <HomeMovements
          key={selected ?? "ready"}
          initialMovements={movementPage.movements}
          nextCursor={movementPage.nextCursor}
        />
      </WalletTemplate>
    </RequireSession>
  );
}
