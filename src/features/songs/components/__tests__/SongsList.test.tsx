import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import type { Song } from "../../../../schema/song";
import { getTheme } from "../../../../theme";
import type { SongSummaryRow } from "../../model/songSummaryRow";
import { SongsList } from "../SongsList";

const createSong = (overrides: Partial<Song>): Song => ({
  id: "default-id",
  songId: "default-song",
  title: "default-title",
  titleNormalized: "default-title",
  version: 1,
  versionName: "1st style",
  url: "https://example.com",
  difficulty: "spa",
  level: 12,
  ...overrides,
});

const renderWithTheme = (ui: ReactElement) => render(<ThemeProvider theme={getTheme("light")}>{ui}</ThemeProvider>);

describe("SongsList", () => {
  it("難易度チップ押下で対象譜面を選択する", async () => {
    const user = userEvent.setup();
    const onSelectChart = vi.fn();

    const sph = createSong({ id: "song-a-sph", songId: "song-a", title: "A", difficulty: "sph", level: 10 });
    const spa = createSong({ id: "song-a-spa", songId: "song-a", title: "A", difficulty: "spa", level: 12 });

    const rows: SongSummaryRow[] = [
      {
        songId: "song-a",
        title: "A",
        titleNormalized: "a",
        versionName: "9th style",
        chartsByDifficulty: {
          sph,
          spa,
        },
      },
    ];

    renderWithTheme(<SongsList rows={rows} onSelectChart={onSelectChart} />);

    await user.click(screen.getByRole("button", { name: "A SPA ☆12 を開く" }));

    expect(onSelectChart).toHaveBeenCalledWith(spa);
  });

  it("未該当難易度は非活性チップとして表示する", () => {
    const sph = createSong({ id: "song-a-sph", songId: "song-a", title: "A", difficulty: "sph", level: 10 });
    const rows: SongSummaryRow[] = [
      {
        songId: "song-a",
        title: "A",
        titleNormalized: "a",
        versionName: "9th style",
        chartsByDifficulty: {
          sph,
        },
      },
    ];

    renderWithTheme(<SongsList rows={rows} />);

    expect(screen.getByText("SPA ☆--")).toBeInTheDocument();
    expect(screen.getByText("SPL ☆--")).toBeInTheDocument();
  });
});
