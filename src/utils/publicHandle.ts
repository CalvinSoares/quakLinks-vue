import api from "@/services/api";

export type PublicHandleMessages = {
  required: string;
  tooShort: string;
  reserved: string;
};

export const reservedPublicHandles = new Set([
  "login",
  "register",
  "dashboard",
  "analytics",
  "settings",
  "plans",
  "templates",
  "pages",
  "appearance",
  "verify-email",
  "reset-password",
  "esqueci-senha",
  "auth",
  "api",
  "_public",
]);

export function normalizePublicHandle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "");
}

export function validatePublicHandle(
  value: string,
  messages: PublicHandleMessages,
): string | null {
  if (!value) return messages.required;
  if (value.length < 3) return messages.tooShort;
  if (reservedPublicHandles.has(value)) return messages.reserved;
  return null;
}

export async function isPublicHandleAvailable(value: string): Promise<boolean> {
  try {
    await api.get(`/public/pages/${encodeURIComponent(value)}`);
    return false;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return true;
    }
    throw err;
  }
}
