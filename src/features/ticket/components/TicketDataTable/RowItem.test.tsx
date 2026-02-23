import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

  it("expiration がない場合はプレースホルダーを表示する", () => {
    render(<RowItem ticket={{ laneText: "7654321" }} />);

    expect(screen.getByText("有効期限: -")).toBeInTheDocument();
  });
});
