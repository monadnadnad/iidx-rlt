import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppSnackbar } from "./AppSnackbar";

describe("AppSnackbar", () => {
  it("openがfalseなら何も描画されない", () => {
    const { container } = render(<AppSnackbar open={false} onClose={() => {}} message="" severity="success" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("messagが正しく表示される", () => {
    render(<AppSnackbar open={true} onClose={() => {}} message="テストメッセージ" severity="error" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("テストメッセージ");
  });

  it("ボタンをクリックするとonCloseが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<AppSnackbar open={true} onClose={handleClose} message="テスト" severity="success" />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
