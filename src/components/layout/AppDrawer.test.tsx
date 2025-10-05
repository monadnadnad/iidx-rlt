import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppDrawer } from "./AppDrawer";
import { BrowserRouter } from "react-router-dom";
import { AppNavItem } from "../../types";

const mockTabs: AppNavItem[] = [
  { path: "/import", label: "インポート", icon: <div /> },
  { path: "/tickets", label: "チケット一覧", icon: <div /> },
];

const TestComponent = (props: { tabIndex: number }) => (
  <BrowserRouter>
    <AppDrawer navItems={mockTabs} tabIndex={props.tabIndex} />
  </BrowserRouter>
);

describe("AppDrawer", () => {
  it("tabIndexでタブが選択された状態になること", () => {
    render(<TestComponent tabIndex={1} />);
    const selectedItem = screen.getByRole("link", { name: "チケット一覧" });
    const unselectedItem = screen.getByRole("link", { name: "インポート" });

    expect(selectedItem).toHaveClass("Mui-selected");
    expect(unselectedItem).not.toHaveClass("Mui-selected");
  });

  it("タブが正しいパスにリンクされていること", () => {
    render(<TestComponent tabIndex={0} />);
    expect(screen.getByRole("link", { name: "インポート" })).toHaveAttribute("href", "/import");
    expect(screen.getByRole("link", { name: "チケット一覧" })).toHaveAttribute("href", "/tickets");
  });
});
