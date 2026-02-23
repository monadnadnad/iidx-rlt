import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlaySide } from "../types";

type SettingsState = {
  playSide: PlaySide;
  isGroupedTicketListEnabled: boolean;
  updatePlaySide: (side: PlaySide) => void;
  updateGroupedTicketListEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      playSide: "1P",
      isGroupedTicketListEnabled: false,
      updatePlaySide: (side) => set({ playSide: side }),
      updateGroupedTicketListEnabled: (enabled) => set({ isGroupedTicketListEnabled: enabled }),
    }),
    {
      name: "settings",
    }
  )
);
