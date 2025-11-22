import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("onRowSelectが指定されている場合は呼び出される", () => {
    const onRowSelect = vi.fn();
    const tickets = [{ laneText: "1234567" }];

    render(<TableView tickets={tickets} onRowSelect={onRowSelect} />);

    screen.getByText("1234567").click();

    expect(onRowSelect).toHaveBeenCalledWith(tickets[0]);
  });
});
