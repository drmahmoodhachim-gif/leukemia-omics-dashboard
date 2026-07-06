const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

export interface FetchWithRetryOptions {
  retries?: number;
  baseDelayMs?: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch with exponential backoff on transient server/network failures. */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithRetryOptions
): Promise<Response> {
  const maxRetries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 400;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok || !RETRYABLE_STATUSES.has(res.status) || attempt === maxRetries) {
        return res;
      }
      await sleep(baseDelayMs * 2 ** attempt);
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
      await sleep(baseDelayMs * 2 ** attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export async function fetchJsonWithRetry<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithRetryOptions
): Promise<{ res: Response; data: T }> {
  const res = await fetchWithRetry(input, init, options);
  const data = (await res.json()) as T;
  return { res, data };
}

export function friendlyFetchError(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof TypeError) {
    const msg = err.message.toLowerCase();
    if (msg.includes("fetch") || msg.includes("network")) {
      return "The server is temporarily unavailable. Please wait a moment and try again.";
    }
  }
  if (err instanceof Error && err.message && err.message !== "Failed to fetch") {
    return err.message;
  }
  return fallback;
}
