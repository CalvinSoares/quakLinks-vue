type Rgb = { r: number; g: number; b: number };

function parseHexColor(hex: string): Rgb | null {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length !== 6 && normalized.length !== 8) {
    return null;
  }

  const rgbPart = normalized.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(rgbPart)) {
    return null;
  }

  return {
    r: Number.parseInt(rgbPart.slice(0, 2), 16),
    g: Number.parseInt(rgbPart.slice(2, 4), 16),
    b: Number.parseInt(rgbPart.slice(4, 6), 16),
  };
}

function parseRgbColor(color: string): Rgb | null {
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) {
    return null;
  }

  return {
    r: Number.parseInt(match[1]!, 10),
    g: Number.parseInt(match[2]!, 10),
    b: Number.parseInt(match[3]!, 10),
  };
}

export function resolveProfileCardBackground(
  color: string | null | undefined,
  opacity: number | null | undefined,
): string {
  const alpha = opacity ?? 0.2;
  const fallback = `rgba(107, 114, 128, ${alpha})`;

  if (!color) {
    return fallback;
  }

  const rgb = parseHexColor(color) ?? parseRgbColor(color);
  if (!rgb) {
    return fallback;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function buildProfileCardStyle(page: {
  showProfileCard?: boolean;
  profileCardColor?: string | null;
  profileCardOpacity?: number | null;
}) {
  if (!page.showProfileCard) {
    return {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    };
  }

  return {
    backgroundColor: resolveProfileCardBackground(
      page.profileCardColor,
      page.profileCardOpacity,
    ),
    backdropFilter: "blur(16px)",
    "-webkit-backdrop-filter": "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
  };
}
