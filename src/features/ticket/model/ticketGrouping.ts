import type { Ticket } from "../../../types";

export type GroupedTicketRow = {
  laneText: string;
  count: number;
};

export const groupTicketsByLaneText = (tickets: readonly Ticket[]): GroupedTicketRow[] => {
  const counts = new Map<string, number>();
  for (const ticket of tickets) {
    counts.set(ticket.laneText, (counts.get(ticket.laneText) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([laneText, count]) => ({ laneText, count }))
    .sort((a, b) => a.laneText.localeCompare(b.laneText));
};
