import type { AxiosRequestConfig } from "axios";

function createIdempotencyKey(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function withIdempotencyKey(
  prefix: string,
  config: AxiosRequestConfig = {},
): AxiosRequestConfig {
  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      "Idempotency-Key": createIdempotencyKey(prefix),
    },
  };
}
