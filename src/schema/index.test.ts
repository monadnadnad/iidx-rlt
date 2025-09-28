import { describe, expect, it } from "vitest";

import { manualImportFormSchema } from "./index";

describe("manualImportFormSchema", () => {
  it("permits a valid lane permutation", () => {
    const result = manualImportFormSchema.safeParse({ laneText: "1234567" });

    expect(result.success).toBe(true);
  });

  it("rejects an empty lane text", () => {
    const result = manualImportFormSchema.safeParse({ laneText: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a lane text with duplicate digits", () => {
    const result = manualImportFormSchema.safeParse({ laneText: "1123456" });

    expect(result.success).toBe(false);
  });

  it("rejects a lane text containing an invalid digit", () => {
    const result = manualImportFormSchema.safeParse({ laneText: "1234568" });

    expect(result.success).toBe(false);
  });
});
