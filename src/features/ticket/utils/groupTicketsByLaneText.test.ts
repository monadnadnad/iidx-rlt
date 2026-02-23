import { describe, expect, it } from "vitest";

import type { Ticket } from "../../../types";
import { groupTicketsByLaneText } from "./groupTicketsByLaneText";

describe("groupTicketsByLaneText", () => {
  it("同一 laneText が 1 行にまとまる", () => {
    const tickets: Ticket[] = [{ laneText: "1234567" }, { laneText: "1234567" }, { laneText: "7654321" }];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped).toHaveLength(2);
    expect(grouped.map((v) => v.laneText)).toStrictEqual(["1234567", "7654321"]);
  });

  it("count が正しい", () => {
    const tickets: Ticket[] = [{ laneText: "1234567" }, { laneText: "1234567" }, { laneText: "1234567" }];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped).toStrictEqual([{ laneText: "1234567", count: 3 }]);
  });

  it("laneText 昇順で安定して並ぶ", () => {
    const tickets: Ticket[] = [{ laneText: "7654321" }, { laneText: "1234567" }, { laneText: "2345671" }];

    const grouped = groupTicketsByLaneText(tickets);

    expect(grouped.map((v) => v.laneText)).toStrictEqual(["1234567", "2345671", "7654321"]);
  });
});
