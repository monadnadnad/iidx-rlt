import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TicketRow } from "./TicketRow";
import { Ticket } from "types";

const mockTicket: Ticket = { laneText: "1234567", expiration: "2999/12/31" };

describe("TicketRow", () => {
  it("チケット情報が表示されること", () => {
    render(<TicketRow ticket={mockTicket} />);

    expect(screen.getByText(mockTicket.laneText)).toBeInTheDocument();
    expect(screen.getByText(`${mockTicket.expiration} まで`)).toBeInTheDocument();
  });

  it("textageUrlが指定されていない場合はリンクが表示されないこと", () => {
    render(<TicketRow ticket={mockTicket} />);

    expect(screen.queryByRole("link", { name: "Textageで確認" })).toBeNull();
  });

  it("textageUrlが指定された場合にリンクが表示されること", () => {
    render(<TicketRow ticket={mockTicket} textageUrl="https://example.com" />);

    expect(screen.getByRole("link", { name: "Textageで確認" })).toHaveAttribute("href", "https://example.com");
  });

  it("リンクのクリックでonTextageFollowが呼び出されること", async () => {
    const user = userEvent.setup();
    const onTextageFollow = vi.fn();
    render(<TicketRow ticket={mockTicket} textageUrl="https://example.com" onTextageFollow={onTextageFollow} />);

    await user.click(screen.getByRole("link", { name: "Textageで確認" }));

    expect(onTextageFollow).toHaveBeenCalledWith(mockTicket.laneText);
  });

  it("行をクリックするとonSelectが呼び出されること", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TicketRow ticket={mockTicket} onSelect={onSelect} />);

    await user.click(screen.getByText(mockTicket.laneText));

    expect(onSelect).toHaveBeenCalledWith(mockTicket);
  });
});
