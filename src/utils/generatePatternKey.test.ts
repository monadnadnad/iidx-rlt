import { describe, expect, it } from "vitest";
import { generatePatternKey } from "./generatePatternKey";

describe("generatePatternKey", () => {
  it("順序指定なしのパターンで正しいキーを生成する", () => {
    const pattern = {
      scratchSideText: "147",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    };
    expect(generatePatternKey(pattern)).toBe("s:147u|ns:****u");
  });

  it("順序指定ありのパターンで正しいキーを生成する", () => {
    const pattern = {
      scratchSideText: "123",
      isScratchSideUnordered: false,
      nonScratchSideText: "4567",
      isNonScratchSideUnordered: false,
    };
    expect(generatePatternKey(pattern)).toBe("s:123o|ns:4567o");
  });
});
