import { create } from "zustand";

export type SnackbarSeverity = "success" | "error" | "info" | "warning";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  show: (message: string, severity?: SnackbarSeverity) => void;
  close: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "success",
  show: (message, severity = "success") => set({ open: true, message, severity }),
  close: () => set({ open: false }),
}));
