import { render, screen } from "@testing-library/react";
import { TicketList } from "./TicketList";
import { describe, it, expect, vi } from "vitest";

vi.mock("./TicketRow", () => ({
  TicketRow: ({
    ticket,
    onSelect,
  }: {
    ticket: { laneText: string };
    onSelect?: (ticket: { laneText: string }) => void;
  }) => <div onClick={() => onSelect?.(ticket)}>{ticket.laneText}</div>,
}));

describe("TicketList", () => {
  it("チケットが無い場合は何も表示しない", () => {
    const { container } = render(<TicketList tickets={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("チケットがある場合は一覧を表示する", () => {
    const tickets = [{ laneText: "1234567" }, { laneText: "7654321" }];

    render(<TicketList tickets={tickets} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });

  it("onRowSelectが指定されている場合は呼び出される", () => {
    const onRowSelect = vi.fn();
    const tickets = [{ laneText: "1234567" }];

    render(<TicketList tickets={tickets} onRowSelect={onRowSelect} />);

    screen.getByText("1234567").click();

    expect(onRowSelect).toHaveBeenCalledWith(tickets[0]);
  });
});
