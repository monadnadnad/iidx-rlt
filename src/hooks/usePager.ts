import type { ChangeEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";

type UsePagerOptions = {
  initialPage?: number;
  initialPerPage?: number;
  perPageOptions?: number[];
};

const DEFAULT_PER_PAGE_OPTIONS = [50, 100];

export const usePager = <T>(items: readonly T[], options: UsePagerOptions = {}) => {
  const { initialPage = 1, initialPerPage = 50, perPageOptions = DEFAULT_PER_PAGE_OPTIONS } = options;

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const totalCount = items.length;
  const pageCount = useMemo(() => {
    if (perPage <= 0) return 1;
    const pages = Math.ceil(totalCount / perPage);
    return Math.max(pages, 1);
  }, [perPage, totalCount]);

  const currentPage = useMemo(() => {
    const maxPage = pageCount === 0 ? 1 : pageCount;
    return Math.min(Math.max(page, 1), maxPage);
  }, [page, pageCount]);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalCount);

  const paginated = useMemo(() => {
    if (perPage <= 0) return [] as T[];
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex, perPage]);

  const handlePageChange = (_: ChangeEvent<unknown> | null, next: number) => {
    setPage(next);
  };

  const handlePerPageChange = (_: MouseEvent<HTMLElement> | null, next: number | null) => {
    if (next !== null) {
      setPerPage(next);
      setPage(1);
    }
  };

  return {
    paginated,
    page: currentPage,
    perPage,
    perPageOptions,
    totalCount,
    pageCount,
    startIndex,
    endIndex,
    setPage,
    setPerPage,
    handlePageChange,
    handlePerPageChange,
  } as const;
};
