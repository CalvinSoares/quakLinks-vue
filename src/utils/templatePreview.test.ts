import { describe, expect, it } from "vitest";
import type { Template } from "@/store/templates";
import {
  hasRenderablePreview,
  mapTemplateToPreviewPage,
} from "./templatePreview";

const baseTemplate: Template = {
  id: "template-1",
  name: "Dark Duck",
  previewImageUrl: "https://cdn.example.com/preview.png",
  visibility: "PUBLIC",
  createdAt: "2026-01-01T00:00:00Z",
  creator: {
    id: "user-1",
    name: "Quack User",
    displayHandle: "quackuser",
  },
  tags: [{ name: "dark" }],
  blockCount: 2,
  applyCount: 10,
  _count: { favoritedBy: 12 },
    pageSnapshot: {
    title: "Duck Links",
    bio: "Bio text",
    backgroundType: "solid",
    backgroundColor: "#0f172a",
    textColor: "#ffffff",
    showViewCount: true,
    viewCount: 321,
  },
  blockSnapshots: [
    {
      type: "LINK",
      title: "Portfolio",
      url: "https://example.com",
      displayOrder: 0,
      visible: true,
      content: {},
    },
  ],
  audioSnapshots: [],
};

describe("templatePreview", () => {
  it("mapeia snapshots para o shape consumido pelo PageRenderer", () => {
    const page = mapTemplateToPreviewPage(baseTemplate);

    expect(page).not.toBeNull();
    expect(page?.title).toBe("Duck Links");
    const blocks = page?.blocks as Array<{ type: string; title: string }>;
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.type).toBe("LINK");
    expect(blocks[0]?.title).toBe("Portfolio");
    expect(page?.viewCount).toBe(321);
  });

  it("detecta preview renderizavel com imagem ou snapshot", () => {
    expect(hasRenderablePreview(baseTemplate)).toBe(true);
    expect(
      hasRenderablePreview({
        ...baseTemplate,
        pageSnapshot: undefined,
        previewImageUrl: "https://cdn.example.com/preview.png",
      }),
    ).toBe(true);
    expect(
      hasRenderablePreview({
        ...baseTemplate,
        pageSnapshot: undefined,
        previewImageUrl: "",
      }),
    ).toBe(false);
  });
});
