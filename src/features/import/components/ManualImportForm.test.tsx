import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { vi } from "vitest";

import { ManualImportForm } from "./ManualImportForm";

describe("ManualImportForm", () => {
  it("正しい入力のとき、onImportが呼び出される", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ManualImportForm onImport={onImport} isLoading={false} />);

    await user.click(screen.getByRole("button", { name: "有効期限を入力する（任意）" }));

    const ticketTextbox = screen.getByRole("textbox", { name: "チケット" });
    await user.type(ticketTextbox, "1234567");

    const expirationGroup = screen.getByRole("group", { name: "有効期限" });
    await user.click(expirationGroup);
    const today = dayjs();
    await user.keyboard(today.format("YYYYMMDD"));

    await user.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith({
        laneText: "1234567",
        expiration: today.format("YYYY/MM/DD"),
      });
    });
  });

  it("空のままボタンを押すと、エラーが表示される", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ManualImportForm onImport={onImport} isLoading={false} />);

    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText(/7文字すべて入力してください/)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });
});
