import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { JsonImportForm } from "./JsonImportForm";

describe("JsonImportForm", () => {
  it("isLoadingがtrueの場合、入力欄とボタンが無効化される", () => {
    render(<JsonImportForm jsonText="[]" isLoading={true} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "インポート実行" })).toBeDisabled();
  });

  it("テキストが空の場合、インポート実行ボタンが無効化される", () => {
    render(<JsonImportForm jsonText="" isLoading={false} />);
    expect(screen.getByRole("button", { name: "インポート実行" })).toBeDisabled();
  });

  it("テキストが入力されている場合、ボタンが有効化され、クリックするとonImportClickが呼び出される", async () => {
    const user = userEvent.setup();
    const mockOnImportClick = vi.fn();
    render(<JsonImportForm jsonText="[]" isLoading={false} onImportClick={mockOnImportClick} />);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    expect(importButton).toBeEnabled();

    await user.click(importButton);
    expect(mockOnImportClick).toHaveBeenCalled();
  });
});
