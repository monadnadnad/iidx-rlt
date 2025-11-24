import { Box, Pagination, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React from "react";

type PagerProps = {
  totalCount: number;
  page: number;
  pageCount: number;
  itemsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onItemsPerPageChange: (event: React.MouseEvent<HTMLElement>, next: number | null) => void;
  itemsPerPageOptions?: number[];
  children?: React.ReactNode;
  maxWidth?: number | string;
};

const defaultItemsPerPageOptions = [50, 100];

export const Pager: React.FC<PagerProps> = ({
  totalCount,
  page,
  pageCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = defaultItemsPerPageOptions,
  children,
  maxWidth,
}) => {
  const hasRange = totalCount > 0 && itemsPerPage > 0;
  const start = hasRange ? (page - 1) * itemsPerPage + 1 : 0;
  const end = hasRange ? Math.min(start + itemsPerPage - 1, totalCount) : 0;
  const showToggle = itemsPerPageOptions.length > 1;

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Stack spacing={1.25} alignItems="stretch" sx={{ width: "100%", maxWidth }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {hasRange ? `${totalCount}件中 ${start}～${end}件` : `${totalCount}件`}
          </Typography>
          {showToggle && (
            <ToggleButtonGroup
              value={itemsPerPage}
              exclusive
              onChange={onItemsPerPageChange}
              size="small"
              color="primary"
              aria-label="表示件数"
            >
              {itemsPerPageOptions.map((option) => (
                <ToggleButton key={option} value={option}>
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Box>

        {children}

        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination count={pageCount} page={page} onChange={onPageChange} />
          </Box>
        )}
      </Stack>
    </Box>
  );
};
