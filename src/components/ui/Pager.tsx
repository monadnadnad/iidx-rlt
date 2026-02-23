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
  headerControls?: React.ReactNode;
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
  headerControls,
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
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
            }}
          >
            {hasRange ? `${totalCount}件中 ${start}～${end}件` : `${totalCount}件`}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "nowrap",
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            {headerControls}
            {showToggle && (
              <ToggleButtonGroup
                value={itemsPerPage}
                exclusive
                onChange={onItemsPerPageChange}
                size="small"
                color="primary"
                aria-label="表示件数"
                sx={{ flexShrink: 0 }}
              >
                {itemsPerPageOptions.map((option) => (
                  <ToggleButton key={option} value={option}>
                    {option}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </Box>
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
