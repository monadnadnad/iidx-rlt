import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useImporter } from "./useImporter";

describe("useImporter", () => {
  const onImportMock = vi.fn();
  const onSuccessMock = vi.fn();
  const onErrorMock = vi.fn();

  beforeEach(() => {
    onImportMock.mockReset();
    onSuccessMock.mockReset();
    onErrorMock.mockReset();
  });

  it("初期状態", () => {
    const { result } = renderHook(() => useImporter(onImportMock));

    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.importedCount).toBe(0);
  });

  it("インポート成功", () => {
    const { result } = renderHook(() => useImporter(onImportMock, { onSuccess: onSuccessMock }));
    const mockTickets = [{ laneText: "1234567" }, { laneText: "7654321" }];

    act(() => {
      result.current.importTickets(JSON.stringify(mockTickets));
    });

    expect(onImportMock).toHaveBeenCalledWith(mockTickets);
    expect(result.current.state.status).toBe("success");
    expect(result.current.state.importedCount).toBe(mockTickets.length);
    expect(result.current.state.error).toBeNull();
    expect(onSuccessMock).toHaveBeenCalledWith(mockTickets.length);
  });

  it("リセットで初期状態に戻る", () => {
    const { result } = renderHook(() => useImporter(onImportMock));

    act(() => {
      result.current.importTickets("");
    });
    expect(result.current.state.status).toBe("error");
    act(() => {
      result.current.resetStatus();
    });

    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.importedCount).toBe(0);
  });

  it("インポート失敗: 空文字列", () => {
    const { result } = renderHook(() => useImporter(onImportMock, { onError: onErrorMock }));

    act(() => {
      result.current.importTickets("");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.error).toBe("インポートするチケットデータがありません。");
    expect(onErrorMock).toHaveBeenCalledWith("インポートするチケットデータがありません。");
  });

  it("インポート失敗: 不正な形式", () => {
    const { result } = renderHook(() => useImporter(onImportMock, { onError: onErrorMock }));

    act(() => {
      result.current.importTickets("test");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.error).toContain("チケットデータの形式が正しくありません。");
    expect(onErrorMock).toHaveBeenCalledWith(expect.stringContaining("チケットデータの形式が正しくありません。"));
  });

  it("インポート失敗: 配列ではない形式", () => {
    const { result } = renderHook(() => useImporter(onImportMock, { onError: onErrorMock }));

    act(() => {
      result.current.importTickets("{}");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.error).toBe("データが配列形式になっていません。");
    expect(onErrorMock).toHaveBeenCalledWith("データが配列形式になっていません。");
  });

  it("インポート失敗: 予期せぬエラー", () => {
    onImportMock.mockImplementationOnce(() => {
      throw new Error("実行時エラー");
    });
    const { result } = renderHook(() => useImporter(onImportMock, { onError: onErrorMock }));

    act(() => {
      result.current.importTickets("[]");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.error).toContain("チケットのインポート中に予期せぬエラーが発生しました。");
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("チケットのインポート中に予期せぬエラーが発生しました。")
    );
  });
});
