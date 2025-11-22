import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

import { AppSnackbar } from "./AppSnackbar";

export const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleClose = () => setNeedRefresh(false);

  return (
    <AppSnackbar
      open={needRefresh}
      onClose={handleClose}
      message="新しいバージョンが利用可能です"
      severity="info"
      autoHideDuration={null}
      action={
        <>
          <Button color="inherit" size="small" onClick={() => updateServiceWorker(true)}>
            更新
          </Button>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};
