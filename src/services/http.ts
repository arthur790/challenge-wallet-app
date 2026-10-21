export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`http-${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor() {
    super("network");
    this.name = "NetworkError";
  }
}

export async function requestJson(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers instanceof Headers
          ? Object.fromEntries(init.headers.entries())
          : init?.headers),
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<unknown>;
}
