import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const items = Array.from({ length: 120 }, (_, i) => i + 1);

  it("ページ番号を更新できる", () => {
    const { result } = renderHook(() => usePagination(items));

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it("表示件数変更でページが1に戻る", () => {
    const { result } = renderHook(() => usePagination(items));

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setItemsPerPage(100);
    });

    expect(result.current.itemsPerPage).toBe(100);
    expect(result.current.currentPage).toBe(1);
  });

  it("現在のページに対応するデータを返す", () => {
    const { result } = renderHook(() => usePagination(items, { initialItemsPerPage: 50 }));

    expect(result.current.paginatedData[0]).toBe(1);

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.paginatedData[0]).toBe(51);
  });
});
