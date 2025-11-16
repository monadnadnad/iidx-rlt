import { http, HttpResponse } from "msw";

const MOCK_ATARI_RULES = [
  {
    id: "test-id-1",
    songId: "test-song-id-1",
    difficulty: "spa",
    title: "rage against usual",
    url: "",
    priority: 1,
    description: "",
    patterns: [
      {
        scratchSideText: "147",
        isScratchSideUnordered: true,
        nonScratchSideText: "****",
        isNonScratchSideUnordered: false,
      },
    ],
  },
];

const MOCK_SONGS = [
  {
    id: "1258-spa",
    songId: "1258",
    title: "冥",
    url: "https://textage.cc/score/12/_mei.html?1AC00",
    difficulty: "spa",
    level: 12,
  },
  {
    id: "2022-spa",
    songId: "2022",
    title: "rage against usual",
    url: "https://textage.cc/score/12/rageagst.html?1AC00",
    difficulty: "spa",
    level: 12,
  },
];

const MOCK_SONGS_VERSION = {
  version: "test-version",
  count: MOCK_SONGS.length,
};

export const handlers = [
  http.get("*/iidx-rlt/data/atari-rules.json", () => {
    return HttpResponse.json(MOCK_ATARI_RULES);
  }),
  http.get("*/iidx-rlt/data/songs.json", () => {
    return HttpResponse.json(MOCK_SONGS);
  }),
  http.get("*/iidx-rlt/data/songs.version.json", () => {
    return HttpResponse.json(MOCK_SONGS_VERSION);
  }),
];
