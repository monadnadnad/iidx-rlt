import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  createChartInfoToSongsSchema,
  iidxDataTableChartInfoSchema,
  iidxDataTableNormalizedTitleSchema,
  iidxDataTableSongInfoSchema,
  iidxDataTableTextageTagSchema,
  iidxDataTableTitleSchema,
  sortSongs,
  TARGET_DIFFICULTIES,
  TARGET_LEVELS,
  type ChartInfo,
} from "./schema";

const OUTPUT_RELATIVE_PATH = "public/data/songs.json";
const VERSION_OUTPUT_RELATIVE_PATH = "public/data/songs.version.json";
const DATA_SOURCE_URL = "https://chinimuruhi.github.io/IIDX-Data-Table/textage/";

type SongsVersion = {
  version: string;
  count: number;
};

type ResourceKey = "title" | "textage-tag" | "chart-info" | "song-info" | "normalized-title";

const RESOURCE_FILENAMES: Record<ResourceKey, string> = {
  title: "title.json",
  "textage-tag": "textage-tag.json",
  "chart-info": "chart-info.json",
  "song-info": "song-info.json",
  "normalized-title": "normalized-title.json",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../..");

const ensureTrailingSlash = (value: string) => (value.endsWith("/") ? value : `${value}/`);

const fetchJsonResource = async (resource: ResourceKey): Promise<unknown> => {
  const filename = RESOURCE_FILENAMES[resource];
  const resourceUrl = new URL(filename, ensureTrailingSlash(DATA_SOURCE_URL));
  const response = await fetch(resourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${resourceUrl.href}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as unknown;
};

export const generateSongsData = async () => {
  const [titlesRaw, textageTagsRaw, chartInfoRaw, songInfoRaw, normalizedTitlesRaw] = await Promise.all([
    fetchJsonResource("title"),
    fetchJsonResource("textage-tag"),
    fetchJsonResource("chart-info"),
    fetchJsonResource("song-info"),
    fetchJsonResource("normalized-title"),
  ]);

  const titlesMap = new Map(Object.entries(iidxDataTableTitleSchema.parse(titlesRaw)));
  const textageTagsMap = new Map(Object.entries(iidxDataTableTextageTagSchema.parse(textageTagsRaw)));
  const chartInfoRecord = iidxDataTableChartInfoSchema.parse(chartInfoRaw);
  const songInfoMap = new Map(Object.entries(iidxDataTableSongInfoSchema.parse(songInfoRaw)));
  const normalizedTitlesMap = new Map(Object.entries(iidxDataTableNormalizedTitleSchema.parse(normalizedTitlesRaw)));

  const parser = createChartInfoToSongsSchema({
    titlesById: titlesMap,
    textageTagsById: textageTagsMap,
    songInfoById: songInfoMap,
    normalizedTitlesById: normalizedTitlesMap,
    targetDifficulties: TARGET_DIFFICULTIES,
    targetLevels: TARGET_LEVELS,
  });

  const songs = Object.entries(chartInfoRecord).flatMap(([id, value]) => {
    const chartInfo: ChartInfo = { ...value, id };
    return parser.parse(chartInfo);
  });

  const sortedSongs = sortSongs(songs);
  const outputPath = resolve(projectRoot, OUTPUT_RELATIVE_PATH);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(sortedSongs, null, 2)}\n`, "utf-8");

  const songsVersion: SongsVersion = {
    version: new Date().toISOString(),
    count: sortedSongs.length,
  };
  const versionOutputPath = resolve(projectRoot, VERSION_OUTPUT_RELATIVE_PATH);
  await mkdir(dirname(versionOutputPath), { recursive: true });
  await writeFile(versionOutputPath, `${JSON.stringify(songsVersion, null, 2)}\n`, "utf-8");

  return { count: sortedSongs.length, outputPath, versionOutputPath, version: songsVersion.version };
};

const main = async () => {
  const { count, outputPath, versionOutputPath, version } = await generateSongsData();
  console.log(`Generated ${count} songs to ${outputPath}`);
  console.log(`Wrote version metadata (${version}) to ${versionOutputPath}`);
};

const isExecutedDirectly = () => {
  const entryFile = process.argv[1];
  if (!entryFile) {
    return false;
  }
  return pathToFileURL(entryFile).href === import.meta.url;
};

if (isExecutedDirectly()) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
