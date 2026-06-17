export function deriveCreatorHandle(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "");
  return slug || "creator";
}

export function buildTemplateShareUrl(templateId: string): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/dashboard/templates?preview=${templateId}`;
  }
  return `/dashboard/templates?preview=${templateId}`;
}

export async function copyTemplateShareLink(templateId: string): Promise<void> {
  await navigator.clipboard.writeText(buildTemplateShareUrl(templateId));
}

export function formatTemplateStat(value: number, locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function resolveTemplateBlockCount(
  template: {
    blockCount?: number;
    blockSnapshots?: unknown[];
  } | null | undefined,
): number {
  if (!template) return 0;
  if (typeof template.blockCount === "number" && !Number.isNaN(template.blockCount)) {
    return template.blockCount;
  }
  if (Array.isArray(template.blockSnapshots)) {
    return template.blockSnapshots.length;
  }
  return 0;
}
