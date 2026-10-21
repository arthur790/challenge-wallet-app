import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { WalletTemplate } from "@/components/templates/WalletTemplate/WalletTemplate";

export default function HomeLoading() {
  return (
    <WalletTemplate title="Inicio">
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    </WalletTemplate>
  );
}
