import {
  Alert,
  AlertColor,
  AlertProps,
  Snackbar,
  SnackbarOrigin,
  SnackbarProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

type SnackbarPassthrough = Omit<SnackbarProps, "open" | "onClose" | "anchorOrigin" | "message">;

export type AppSnackbarProps = SnackbarPassthrough & {
  open: boolean;
  onClose: () => void;
  message?: React.ReactNode;
  severity?: AlertColor;
  action?: AlertProps["action"];
  alertProps?: Omit<AlertProps, "severity" | "onClose" | "action">;
  anchorOrigin?: SnackbarOrigin;
};

export const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  onClose,
  message,
  severity = "info",
  action,
  alertProps,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  autoHideDuration = 2000,
  sx,
  children,
  ...snackbarProps
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      sx={{
        ...(isSm && { bottom: `calc(${theme.spacing(9)} + env(safe-area-inset-bottom))` }),
        ...sx,
      }}
      {...snackbarProps}
    >
      <Alert severity={severity} onClose={onClose} action={action} {...alertProps}>
        {children ?? message}
      </Alert>
    </Snackbar>
  );
};
