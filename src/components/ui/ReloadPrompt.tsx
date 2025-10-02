import CloseIcon from "@mui/icons-material/Close";
import { Alert, Button, IconButton, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

export const ReloadPrompt = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleUpdate = async () => {
    await updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      open={needRefresh}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{
        ...(isSm && { bottom: `calc(${theme.spacing(9)} + env(safe-area-inset-bottom))` }),
      }}
      onClose={handleClose}
    >
      <Alert
        severity="info"
        action={
          <>
            <Button color="inherit" size="small" onClick={handleUpdate}>
              更新
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
        onClose={handleClose}
      >
        新しいバージョンが利用可能です
      </Alert>
    </Snackbar>
  );
};
