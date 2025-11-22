import { useCallback } from "react";
import { useSnackbarStore } from "../store/snackbarStore";

export const useClipboard = () => {
  const showSnackbar = useSnackbarStore((s) => s.show);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSnackbar("クリップボードにコピーしました", "success");
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        showSnackbar(`コピーに失敗しました: ${message}`, "error");
      }
    },
    [showSnackbar]
  );

  return { copyToClipboard };
};
