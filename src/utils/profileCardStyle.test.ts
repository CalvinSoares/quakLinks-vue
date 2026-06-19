import { describe, expect, it } from "vitest";
import {
  buildProfileCardStyle,
  resolveProfileCardBackground,
} from "./profileCardStyle";

describe("profileCardStyle", () => {
  it("combines hex color with opacity slider", () => {
    expect(resolveProfileCardBackground("#1f2937", 0.5)).toBe(
      "rgba(31, 41, 55, 0.5)",
    );
  });

  it("ignores alpha embedded in 8-digit hex", () => {
    expect(resolveProfileCardBackground("#1f293780", 0.4)).toBe(
      "rgba(31, 41, 55, 0.4)",
    );
  });

  it("hides card styles when disabled", () => {
    expect(
      buildProfileCardStyle({
        showProfileCard: false,
        profileCardColor: "#ffffff",
        profileCardOpacity: 0.8,
      }),
    ).toEqual({
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    });
  });
});
