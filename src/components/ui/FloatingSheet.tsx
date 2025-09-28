import { Box, Divider, Drawer, Paper, useTheme, useMediaQuery } from "@mui/material";

interface FloatingSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const FloatingSheet: React.FC<FloatingSheetProps> = ({ open, onClose, title, children }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const hasCoarsePointer = useMediaQuery("(pointer: coarse)");
  const useBottomSheet = isSm || hasCoarsePointer;

  if (!open) {
    return null;
  }

  const sheetContent = (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {title && (
        <>
          {title}
          <Divider sx={{ mb: 1 }} />
        </>
      )}
      {children}
    </Box>
  );

  if (useBottomSheet) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              height: "auto",
              maxHeight: "50vh",
              overflowY: "auto",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            },
          },
        }}
      >
        {sheetContent}
      </Drawer>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={(theme) => ({
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        zIndex: theme.zIndex.modal,
        width: theme.spacing(50),
        borderRadius: 3,
        boxShadow: theme.shadows[3],
      })}
    >
      {sheetContent}
    </Paper>
  );
};
