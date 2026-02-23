import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GroupedRowItem } from "./GroupedRowItem";

describe("GroupedRowItem", () => {
  it("laneText と件数データが表示される", () => {
    render(<GroupedRowItem laneText="1234567" count={3} />);

    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByTestId("grouped-ticket-count")).toHaveAttribute("data-count", "3");
  });

  it("textageUrl がない場合リンクは非表示", () => {
    render(<GroupedRowItem laneText="1234567" count={1} />);

    expect(screen.queryByRole("link", { name: "Textageで確認" })).toBeNull();
  });

  it("textageUrl がある場合リンクを表示", () => {
    render(<GroupedRowItem laneText="1234567" count={1} textageUrl="https://example.com" />);

    expect(screen.getByRole("link", { name: "Textageで確認" })).toHaveAttribute("href", "https://example.com");
  });
});
