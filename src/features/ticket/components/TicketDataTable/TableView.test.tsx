import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableView } from "./TableView";

vi.mock("./RowItem", () => ({
  RowItem: ({
    ticket,
    onSelect,
  }: {
    ticket: { laneText: string };
    onSelect?: (ticket: { laneText: string }) => void;
  }) => (
    <div role="listitem" onClick={() => onSelect?.(ticket)}>
      {ticket.laneText}
    </div>
  ),
}));

describe("TableView", () => {
  it("チケットが無い場合は何も表示しない", () => {
    const { container } = render(<TableView tickets={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("チケットがある場合は一覧を表示する", () => {
    const tickets = [{ laneText: "1234567" }, { laneText: "7654321" }];

    render(<TableView tickets={tickets} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });
});
