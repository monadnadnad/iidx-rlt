import { Alert, AlertColor, Snackbar, useMediaQuery, useTheme } from "@mui/material";

interface AppSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

export const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 2000,
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{
        ...(isSm && { bottom: `calc(${theme.spacing(9)} + env(safe-area-inset-bottom))` }),
      }}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};
