import type { Template } from "@/store/templates";

type SnapshotRecord = Record<string, unknown>;

function asRecord(value: unknown): SnapshotRecord {
  return value && typeof value === "object" ? (value as SnapshotRecord) : {};
}

export function mapTemplateToPreviewPage(template: Template): SnapshotRecord | null {
  const snap = asRecord(template.pageSnapshot);
  if (!snap.title && !snap.backgroundType && !template.previewImageUrl) {
    return null;
  }

  const blocks = (template.blockSnapshots ?? []).map((raw, index) => {
    const block = asRecord(raw);
    return {
      id: `preview-block-${index}`,
      pageId: "preview",
      type: block.type ?? "LINK",
      order: Number(block.displayOrder ?? index),
      isVisible: Boolean(block.visible ?? true),
      content: asRecord(block.content),
      title: block.title ?? null,
      textContent: block.textContent ?? null,
      url: block.url ?? null,
    };
  });

  const audios = (template.audioSnapshots ?? []).map((raw, index) => {
    const audio = asRecord(raw);
    return {
      id: `preview-audio-${index}`,
      title: String(audio.title ?? ""),
      url: String(audio.url ?? ""),
      type: audio.type ?? "DIRECT",
      coverUrl: audio.coverUrl ?? null,
      isActive: Boolean(audio.active ?? true),
      order: Number(audio.displayOrder ?? index),
    };
  });

  return {
    id: "preview",
    slug: "preview",
    title: snap.title ?? template.name,
    bio: snap.bio ?? "",
    avatarUrl: snap.avatarUrl ?? null,
    theme: snap.theme ?? "default",
    backgroundType: snap.backgroundType ?? "solid",
    backgroundColor: snap.backgroundColor ?? "#0f172a",
    backgroundUrl: snap.backgroundUrl ?? null,
    backgroundVideoUrl: snap.backgroundVideoUrl ?? null,
    textColor: snap.textColor ?? "#ffffff",
    iconColor: snap.iconColor ?? "#ffffff",
    buttonColor: snap.buttonColor ?? "#fbbf24",
    pageLayout: snap.pageLayout ?? "standard",
    linkStyle: snap.linkStyle ?? "classic",
    layoutLinkStyle: snap.layoutLinkStyle ?? "list",
    showProfileCard: Boolean(snap.showProfileCard ?? false),
    profileCardColor: snap.profileCardColor ?? "#000000",
    profileCardOpacity: Number(snap.profileCardOpacity ?? 0.5),
    useStandardIconColors: Boolean(snap.useStandardIconColors ?? true),
    glowEffect: snap.glowEffect ?? null,
    showViewCount: Boolean(snap.showViewCount ?? false),
    gradientDirection: snap.gradientDirection ?? null,
    gradientColorA: snap.gradientColorA ?? null,
    gradientColorB: snap.gradientColorB ?? null,
    cursorUrl: snap.cursorUrl ?? null,
    titleEffect: snap.titleEffect ?? null,
    customCss: snap.customCss ?? null,
    backgroundOverlay: snap.backgroundOverlay ?? "none",
    backgroundBlur: Number(snap.backgroundBlur ?? 0),
    viewCount: Number(snap.viewCount ?? 0),
    links: [],
    user: null,
    blocks,
    audios,
  };
}

export function hasRenderablePreview(template: Template): boolean {
  return Boolean(template.pageSnapshot) || Boolean(template.previewImageUrl);
}
