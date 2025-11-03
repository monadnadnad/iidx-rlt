import { describe, expect, it } from "vitest";
import { makeTextageUrl } from "./makeTextageUrl";

describe("makeTextageUrl", () => {
  it("1Pの正しいURLを生成する", () => {
    const baseUrl = "https://textage.cc/score/7/a_amuro.html?1AC00";
    const url = makeTextageUrl(baseUrl, "1P", "7654321");

    expect(url).toBe("https://textage.cc/score/7/a_amuro.html?1AC00R0765432101234567");
  });

  it("2Pの正しいURLを生成する", () => {
    const baseUrl = "https://textage.cc/score/7/a_amuro.html?1AC00";
    const url = makeTextageUrl(baseUrl, "2P", "7654321");

    expect(url).toBe("https://textage.cc/score/7/a_amuro.html?2AC00R0765432101234567");
  });
});
