import { useMemo, useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export const usePagination = <T>(items: readonly T[], options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialItemsPerPage = 50 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalCount = items.length;
  const pageCount = useMemo(
    () => (itemsPerPage > 0 ? Math.ceil(totalCount / itemsPerPage) : 0),
    [totalCount, itemsPerPage]
  );

  const clampPage = (page: number) => {
    if (pageCount === 0) return 1;
    return Math.min(Math.max(page, 1), pageCount);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(clampPage(page));
  };

  const handleItemsPerPageChange = (next: number | null) => {
    if (next !== null) {
      setItemsPerPage(next);
      setCurrentPage(1);
    }
  };

  const page = clampPage(currentPage);

  const paginatedData = useMemo(() => {
    if (itemsPerPage <= 0) return [] as T[];
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, page, itemsPerPage]);

  return {
    currentPage: page,
    itemsPerPage,
    totalCount,
    pageCount,
    paginatedData,
    setPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
  };
};
