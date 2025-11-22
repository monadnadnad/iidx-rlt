import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "./useClipboard";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockShowSnackbar = vi.fn();
vi.mock("../store/snackbarStore", () => ({
  useSnackbarStore: () => mockShowSnackbar,
}));

describe("useClipboard", () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("navigator", {
      clipboard: { writeText: mockWriteText },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("コピー成功時に、成功メッセージ付きでshowSnackbarが呼ばれること", async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard("test");
    });

    expect(mockWriteText).toHaveBeenCalledWith("test");
    expect(mockShowSnackbar).toHaveBeenCalledWith("クリップボードにコピーしました", "success");
  });

  it("コピー失敗時に、失敗メッセージ付きでshowSnackbarが呼ばれること", async () => {
    const error = new Error("コピー失敗");
    mockWriteText.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard("test");
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith(`コピーに失敗しました: ${error.message}`, "error");
  });
});
