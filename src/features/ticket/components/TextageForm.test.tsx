import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SongInfo } from "../../../types";
import { TextageForm } from "./TextageForm";

describe("TextageForm", () => {
  const song: SongInfo = {
    id: "1234-spa",
    songId: "1234",
    title: "A",
    url: "https://textage.cc/score/7/a_amuro.html?1AC00",
    difficulty: "spa",
    level: 12,
  };
  const allSongsData: SongInfo[] = [song];
  const atariSongsData: SongInfo[] = [song];

  it("曲を選択できる", async () => {
    const user = userEvent.setup();
    const onSongSelect = vi.fn();
    render(
      <TextageForm
        allSongs={allSongsData}
        atariSongs={atariSongsData}
        selectedSong={null}
        onSongSelect={onSongSelect}
        searchMode="recommend"
      />
    );

    const autocomplete = screen.getByLabelText("楽曲を選択");
    await user.click(autocomplete);
    await user.type(autocomplete, "A");
    const optionElements = await screen.findAllByRole("option");

    expect(optionElements.length).toBeGreaterThan(0);

    await user.click(optionElements[0]);

    expect(onSongSelect).toHaveBeenCalledWith(song);
  });
});
