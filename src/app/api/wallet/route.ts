import { getWallet } from "@/server/store";

export async function GET(request: Request) {
  const view = new URL(request.url).searchParams.get("view") ?? undefined;

  if (view === "error") {
    return Response.json({ error: "wallet-unavailable" }, { status: 500 });
  }

  const wallet = await getWallet(view);
  return Response.json(wallet);
}
