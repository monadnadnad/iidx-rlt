import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Song } from "../../../../schema/song";
import type { SongDifficulty } from "../../hooks/useTextageSongOptions";
import { useTextageSongOptions } from "../../hooks/useTextageSongOptions";
import { SongSelect } from "./SongSelect";

vi.mock("../../hooks/useTextageSongOptions", () => ({
  useTextageSongOptions: vi.fn(),
}));

describe("SongSelect", () => {
  const song: Song = {
    id: "1234-spa",
    songId: "1234",
    title: "A",
    titleNormalized: "A",
    version: 7,
    versionName: "7th style",
    url: "https://textage.cc/score/7/a_amuro.html?1AC00",
    difficulty: "spa",
    level: 12,
  };
  const mockedHook = vi.mocked(useTextageSongOptions);

  beforeEach(() => {
    mockedHook.mockReturnValue({
      filteredSongs: [song],
      placeholder: "曲名で検索",
      isLoading: false,
    });
  });

  it("曲を選択できる", async () => {
    const user = userEvent.setup();
    const onSongSelect = vi.fn();
    render(
      <SongSelect
        recommendedSongs={[{ songId: song.songId, difficulty: song.difficulty as SongDifficulty }]}
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
