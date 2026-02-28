import { describe, expect, it } from "vitest";

import type { Ticket } from "../../../types";
import { groupTicketsByLaneText } from "./ticketGrouping";

describe("groupTicketsByLaneText", () => {
  it("同一 laneText を件数でまとめる", () => {
    const tickets: Ticket[] = [{ laneText: "1234567" }, { laneText: "7654321" }, { laneText: "1234567" }];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped).toStrictEqual([
      { laneText: "1234567", count: 2 },
      { laneText: "7654321", count: 1 },
    ]);
  });

  it("laneText 昇順でソートする", () => {
    const tickets: Ticket[] = [{ laneText: "7654321" }, { laneText: "1234567" }, { laneText: "5555555" }];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped.map((row) => row.laneText)).toStrictEqual(["1234567", "5555555", "7654321"]);
  });

  it("空配列なら空配列を返す", () => {
    const tickets: Ticket[] = [];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped).toStrictEqual([]);
  });
});
