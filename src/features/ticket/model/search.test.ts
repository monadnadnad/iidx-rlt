import { describe, expect, it } from "vitest";

import type { SearchFormValues } from "./search";
import { normalizeTicketSearchForm } from "./search";

describe("normalizeTicketSearchForm", () => {
  it("入力が undefined のときデフォルト値で補完する", () => {
    expect(normalizeTicketSearchForm()).toStrictEqual({
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    });
  });

  it("空文字をワイルドカードで補完する", () => {
    const input: SearchFormValues = {
      scratchSideText: "",
      isScratchSideUnordered: true,
      nonScratchSideText: "",
      isNonScratchSideUnordered: true,
    };

    expect(normalizeTicketSearchForm(input)).toStrictEqual({
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    });
  });

  it("部分入力をワイルドカードで補完する", () => {
    const input: SearchFormValues = {
      scratchSideText: "12",
      isScratchSideUnordered: true,
      nonScratchSideText: "456",
      isNonScratchSideUnordered: false,
    };

    expect(normalizeTicketSearchForm(input)).toStrictEqual({
      scratchSideText: "12*",
      isScratchSideUnordered: true,
      nonScratchSideText: "456*",
      isNonScratchSideUnordered: false,
    });
  });
});
