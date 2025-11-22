import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Ticket } from "../../../../types";
import { RowItem } from "./RowItem";

const mockTicket: Ticket = { laneText: "1234567", expiration: "2999/12/31" };

describe("RowItem", () => {
  it("チケット情報が表示される", () => {
    render(<RowItem ticket={mockTicket} />);

    expect(screen.getByText(mockTicket.laneText)).toBeInTheDocument();
    expect(screen.getByText(`有効期限: ${mockTicket.expiration}`)).toBeInTheDocument();
  });

  it("textageUrlがない場合リンクは非表示", () => {
    render(<RowItem ticket={mockTicket} />);

    expect(screen.queryByRole("link", { name: "Textageで確認" })).toBeNull();
  });

  it("textageUrlがある場合リンクを表示", () => {
    render(<RowItem ticket={mockTicket} textageUrl="https://example.com" />);

    expect(screen.getByRole("link", { name: "Textageで確認" })).toHaveAttribute("href", "https://example.com");
  });

  it("リンククリックでonTextageFollowが呼ばれる", async () => {
    const user = userEvent.setup();
    const onTextageFollow = vi.fn();
    render(<RowItem ticket={mockTicket} textageUrl="https://example.com" onTextageFollow={onTextageFollow} />);

    await user.click(screen.getByRole("link", { name: "Textageで確認" }));

    expect(onTextageFollow).toHaveBeenCalledWith(mockTicket.laneText);
  });

  it("行クリックでonSelectが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<RowItem ticket={mockTicket} onSelect={onSelect} />);

    await user.click(screen.getByText(mockTicket.laneText));

    expect(onSelect).toHaveBeenCalledWith(mockTicket);
  });
});
