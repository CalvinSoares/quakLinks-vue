const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const LEGACY_TOKEN_KEY = "token";
const USER_KEY = "user";
const PENDING_SOCIAL_AUTH_KEY = "pendingSocialAuth";

export type SocialProvider = "google" | "discord";

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setSessionTokens(
  accessToken: string,
  refreshToken?: string | null,
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(LEGACY_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearSessionStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T>() {
  const value = localStorage.getItem(USER_KEY);
  return value ? (JSON.parse(value) as T) : null;
}

interface PendingSocialAuth {
  provider: SocialProvider;
  state: string;
}

export function setPendingSocialAuth(provider: SocialProvider, state: string) {
  const value: PendingSocialAuth = { provider, state };
  sessionStorage.setItem(PENDING_SOCIAL_AUTH_KEY, JSON.stringify(value));
}

export function getPendingSocialProvider(): SocialProvider | null {
  const pending = getPendingSocialAuth();
  return pending?.provider ?? null;
}

export function getPendingSocialState(): string | null {
  const pending = getPendingSocialAuth();
  return pending?.state ?? null;
}

export function getPendingSocialAuth(): PendingSocialAuth | null {
  const rawValue = sessionStorage.getItem(PENDING_SOCIAL_AUTH_KEY);
  if (!rawValue) {
    return null;
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(rawValue);
  } catch {
    return null;
  }

  const provider = (parsedValue as PendingSocialAuth | null)?.provider;
  const state = (parsedValue as PendingSocialAuth | null)?.state;
  if (provider === "google" || provider === "discord") {
    return typeof state === "string" && state.length > 0
      ? { provider, state }
      : null;
  }

  return null;
}

export function clearPendingSocialProvider() {
  sessionStorage.removeItem(PENDING_SOCIAL_AUTH_KEY);
}
