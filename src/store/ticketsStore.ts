import { create } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";

import { ticketSchema } from "../schema/ticket";
import { Ticket } from "../types";

type TicketsState = {
  tickets: Ticket[];
  setTickets: (ts: Ticket[]) => void;
  addTicket: (t: Ticket) => void;
  clear: () => void;
};

const makeTicketsStorage = (): PersistStorage<{ tickets: Ticket[] }> => ({
  getItem: (_name: string) => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("tickets");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      const rawTickets = Array.isArray(parsed) ? parsed : [];
      const arr = rawTickets
        .map((ticket) => ticketSchema.safeParse(ticket))
        .flatMap((result) => (result.success ? [result.data] : []));
      return { state: { tickets: arr }, version: 0 } satisfies StorageValue<{ tickets: Ticket[] }>;
    } catch {
      return { state: { tickets: [] }, version: 0 } satisfies StorageValue<{ tickets: Ticket[] }>;
    }
  },
  setItem: (_name: string, value: StorageValue<{ tickets: Ticket[] }>) => {
    if (typeof window === "undefined") return;
    const arr = value?.state?.tickets ?? [];
    localStorage.setItem("tickets", JSON.stringify(arr));
  },
  removeItem: (_name: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("tickets");
  },
});

export const useTicketsStore = create<TicketsState>()(
  persist<TicketsState, [], [], { tickets: Ticket[] }>(
    (set) => ({
      tickets: [],
      setTickets: (ts) => set({ tickets: ts }),
      addTicket: (t) => set((s) => ({ tickets: [...s.tickets, t] })),
      clear: () => set({ tickets: [] }),
    }),
    {
      name: "tickets",
      storage: makeTicketsStorage(),
      partialize: (s) => ({ tickets: s.tickets }),
    }
  )
);
