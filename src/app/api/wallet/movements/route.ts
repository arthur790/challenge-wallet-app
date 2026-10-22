import { listMovements } from "@/server/store";

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("cursor");
  const cursor = raw && raw.length > 0 ? raw : null;

  return Response.json(listMovements({ cursor }));
}
