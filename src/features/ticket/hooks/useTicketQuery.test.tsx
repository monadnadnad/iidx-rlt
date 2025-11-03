import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTicketQuery } from "./useTicketQuery";
import { SongInfo } from "../../../types";

const mockSong: SongInfo = {
  id: "1234-spa",
  songId: "1234",
  title: "A",
  url: "https://textage.cc/score/7/a_amuro.html?1AC00",
  difficulty: "spa",
  level: 12,
};

describe("useTicketQuery", () => {
  describe("handleFilterModeChange", () => {
    it("モードを変更すると、選択中の曲がリセットされ、ページが1に戻ること", () => {
      const { result } = renderHook(() => useTicketQuery());

      act(() => {
        result.current.handleTextageSongChange(mockSong);
        result.current.handlePageChange(5);
      });

      expect(result.current.query.textageSong).toStrictEqual(mockSong);
      expect(result.current.query.currentPage).toBe(5);

      act(() => {
        result.current.handleFilterModeChange("all");
      });

      expect(result.current.query.filterMode).toBe("all");
      expect(result.current.query.textageSong).toBeNull();
      expect(result.current.query.currentPage).toBe(1);
    });
  });

  describe("handleTextageSongChange", () => {
    it("曲を選択すると、ページが1に戻ること", () => {
      const { result } = renderHook(() => useTicketQuery());

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(result.current.query.currentPage).toBe(5);

      act(() => {
        result.current.handleTextageSongChange(mockSong);
      });

      expect(result.current.query.textageSong).toStrictEqual(mockSong);
      expect(result.current.query.currentPage).toBe(1);
    });
  });

  describe("handleItemsPerPageChange", () => {
    it("表示件数を変更すると、ページが1に戻ること", () => {
      const { result } = renderHook(() => useTicketQuery());

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(result.current.query.currentPage).toBe(5);

      act(() => {
        result.current.handleItemsPerPageChange(100);
      });

      expect(result.current.query.itemsPerPage).toBe(100);
      expect(result.current.query.currentPage).toBe(1);
    });
  });

  describe("handlePageChange", () => {
    it("ページ番号が正しく更新されること", () => {
      const { result } = renderHook(() => useTicketQuery());
      act(() => {
        result.current.handlePageChange(10);
      });

      expect(result.current.query.currentPage).toBe(10);
    });
  });
});
