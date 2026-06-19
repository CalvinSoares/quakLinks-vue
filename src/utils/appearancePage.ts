import type { Block, Page } from "@/store/page";
import { mapLinksFromBlocks } from "@/store/page";

export type AppearanceFormState = Record<string, unknown>;

const SAVEABLE_PAGE_FIELDS = [
  "title",
  "bio",
  "avatarUrl",
  "theme",
  "backgroundType",
  "backgroundColor",
  "backgroundUrl",
  "textColor",
  "iconColor",
  "buttonColor",
  "pageLayout",
  "linkStyle",
  "layoutLinkStyle",
  "showProfileCard",
  "profileCardColor",
  "profileCardOpacity",
  "useStandardIconColors",
  "glowEffect",
  "showViewCount",
  "gradientDirection",
  "gradientColorA",
  "gradientColorB",
  "backgroundVideoUrl",
  "cursorUrl",
  "titleEffect",
] as const;

export function normalizeBackgroundType(value: string | null | undefined) {
  const normalized = (value ?? "solid").toLowerCase();
  if (normalized === "color") return "solid";
  return normalized;
}

export function applyPageToForm(form: AppearanceFormState, page: Page) {
  Object.assign(form, {
    title: page.title ?? "",
    bio: page.bio ?? "",
    location: page.location ?? "",
    backgroundType: normalizeBackgroundType(page.backgroundType),
    gradientDirection: page.gradientDirection ?? "to bottom",
    gradientColorA: page.gradientColorA ?? "#1E3A8A",
    gradientColorB: page.gradientColorB ?? "#4C1D95",
    backgroundColor: page.backgroundColor ?? "#1E293B",
    backgroundUrl: page.backgroundUrl ?? null,
    backgroundVideoUrl: page.backgroundVideoUrl ?? null,
    backgroundOverlay: page.backgroundOverlay ?? "none",
    backgroundBlur: page.backgroundBlur ?? 0,
    pageLayout: page.pageLayout ?? "standard",
    textColor: page.textColor ?? "#FFFFFF",
    iconColor: page.iconColor ?? "#CCCCCC",
    useStandardIconColors: page.useStandardIconColors ?? true,
    glowEffect: page.glowEffect ?? "none",
    fontFamily: page.fontFamily ?? "Inter",
    titleEffect: page.typewriterEffect ? "typewriter" : (page.titleEffect ?? "none"),
    linkStyle: page.linkStyle ?? "classic",
    layoutLinkStyle: page.layoutLinkStyle ?? "list",
    buttonStyle: page.buttonStyle ?? "solid",
    buttonColor: page.buttonColor ?? null,
    buttonRoundness: page.buttonRoundness ?? "rounded-lg",
    buttonShadow: page.buttonShadow ?? false,
    avatarUrl: page.avatarUrl ?? null,
    cursorUrl: page.cursorUrl ?? null,
    profileRingType: page.profileRingType ?? "none",
    profileRingColors:
      page.profileRingColors && page.profileRingColors.length > 0
        ? [...page.profileRingColors]
        : ["#FFFFFF", "#8B5CF6"],
    showProfileCard: page.showProfileCard ?? true,
    profileCardColor: page.profileCardColor ?? "#1f293780",
    profileCardOpacity: page.profileCardOpacity ?? 0.2,
    showViewCount: page.showViewCount ?? true,
    shuffleAudios: page.shuffleAudios ?? false,
    showAudioPlayer: page.showAudioPlayer ?? true,
    showEmbeds: page.showEmbeds ?? true,
  });
}

export function buildPageSavePayload(
  form: AppearanceFormState,
  baseline: AppearanceFormState,
): Partial<Page> {
  const payload: Partial<Page> = {};

  for (const field of SAVEABLE_PAGE_FIELDS) {
    const formValue = form[field];
    const baselineValue = baseline[field];

    if (JSON.stringify(formValue) !== JSON.stringify(baselineValue)) {
      (payload as Record<string, unknown>)[field] = formValue;
    }
  }

  return payload;
}

export function buildPreviewPage(
  form: AppearanceFormState,
  page: Page | null,
  options: {
    blocks: Block[];
    isBodyGradient: boolean;
  },
): Record<string, unknown> {
  const blocks = options.blocks;
  return {
    slug: page?.slug ?? "preview",
    user: page?.user ?? null,
    viewCount: page?.viewCount ?? 0,
    audios: page?.audios ?? [],
    title: String(form.title ?? page?.title ?? ""),
    bio: String(form.bio ?? page?.bio ?? ""),
    location: String(form.location ?? page?.location ?? ""),
    avatarUrl: (form.avatarUrl as string | null) ?? page?.avatarUrl ?? null,
    backgroundType: normalizeBackgroundType(
      String(form.backgroundType ?? page?.backgroundType ?? "solid"),
    ),
    gradientDirection:
      (form.gradientDirection as string) ?? page?.gradientDirection ?? "to bottom",
    gradientColorA:
      (form.gradientColorA as string) ?? page?.gradientColorA ?? "#1E3A8A",
    gradientColorB:
      (form.gradientColorB as string) ?? page?.gradientColorB ?? "#4C1D95",
    backgroundColor:
      (form.backgroundColor as string) ?? page?.backgroundColor ?? "#1E293B",
    backgroundUrl:
      (form.backgroundUrl as string | null) ?? page?.backgroundUrl ?? null,
    backgroundVideoUrl:
      (form.backgroundVideoUrl as string | null) ?? page?.backgroundVideoUrl ?? null,
    backgroundOverlay:
      (form.backgroundOverlay as string) ?? page?.backgroundOverlay ?? "none",
    backgroundBlur: Number(form.backgroundBlur ?? page?.backgroundBlur ?? 0),
    pageLayout: (form.pageLayout as Page["pageLayout"]) ?? page?.pageLayout ?? "standard",
    textColor: (form.textColor as string) ?? page?.textColor ?? "#FFFFFF",
    iconColor: (form.iconColor as string) ?? page?.iconColor ?? "#CCCCCC",
    fontFamily: (form.fontFamily as string) ?? page?.fontFamily ?? "Inter",
    buttonStyle: (form.buttonStyle as string) ?? page?.buttonStyle ?? "solid",
    buttonColor: (form.buttonColor as string | null) ?? page?.buttonColor ?? null,
    buttonRoundness:
      (form.buttonRoundness as string) ?? page?.buttonRoundness ?? "rounded-lg",
    buttonShadow: Boolean(form.buttonShadow ?? page?.buttonShadow ?? false),
    useStandardIconColors: Boolean(
      form.useStandardIconColors ?? page?.useStandardIconColors ?? true,
    ),
    glowEffect: (form.glowEffect as string) ?? page?.glowEffect ?? "none",
    titleEffect: (form.titleEffect as string) ?? page?.titleEffect ?? "none",
    linkStyle: (form.linkStyle as string) ?? page?.linkStyle ?? "classic",
    layoutLinkStyle:
      (form.layoutLinkStyle as string) ?? page?.layoutLinkStyle ?? "list",
    showProfileCard: Boolean(form.showProfileCard ?? page?.showProfileCard ?? true),
    profileCardColor:
      (form.profileCardColor as string) ?? page?.profileCardColor ?? "#1f293780",
    profileCardOpacity: Number(
      form.profileCardOpacity ?? page?.profileCardOpacity ?? 0.2,
    ),
    showViewCount: Boolean(form.showViewCount ?? page?.showViewCount ?? true),
    profileRingType:
      (form.profileRingType as string) ?? page?.profileRingType ?? "none",
    profileRingColors:
      (form.profileRingColors as string[]) ?? page?.profileRingColors ?? [],
    cursorUrl: (form.cursorUrl as string | null) ?? page?.cursorUrl ?? null,
    shuffleAudios: Boolean(form.shuffleAudios ?? page?.shuffleAudios ?? false),
    showAudioPlayer: Boolean(form.showAudioPlayer ?? page?.showAudioPlayer ?? true),
    showEmbeds: Boolean(form.showEmbeds ?? page?.showEmbeds ?? true),
    isBodyGradient: options.isBodyGradient,
    blocks,
    links: mapLinksFromBlocks(blocks),
  };
}
