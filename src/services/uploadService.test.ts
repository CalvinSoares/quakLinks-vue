import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { uploadFileWithSignedUrl } from "./uploadService";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    default: {
      ...actual.default,
      put: vi.fn().mockResolvedValue({ status: 200 }),
    },
  };
});

describe("uploadFileWithSignedUrl", () => {
  it("gera signed url, envia o arquivo e conclui o asset", async () => {
    const file = new File(["duck"], "duck.png", { type: "image/png" });

    const result = await uploadFileWithSignedUrl(file, "avatar");

    expect(axios.put).toHaveBeenCalledWith(
      "https://upload.example.com/signed-put",
      file,
      expect.objectContaining({
        headers: {
          "Content-Type": "image/png",
        },
      })
    );
    expect(result).toBe("https://cdn.example.com/file.png");
  });
});
