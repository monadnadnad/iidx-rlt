import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  createChartInfoToSongsSchema,
  iidxDataTableChartInfoSchema,
  iidxDataTableTextageTagSchema,
  iidxDataTableTitleSchema,
  sortSongs,
  TARGET_DIFFICULTIES,
  TARGET_LEVELS,
  type ChartInfo,
} from "./schema";

const OUTPUT_RELATIVE_PATH = "public/data/songs.json";
const DATA_SOURCE_DIR = ".";

type ResourceKey = "title" | "textage-tag" | "chart-info";

const RESOURCE_FILENAMES: Record<ResourceKey, string> = {
  title: "title.json",
  "textage-tag": "textage-tag.json",
  "chart-info": "chart-info.json",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../..");

const loadJsonResource = async (resource: ResourceKey, basePath: string): Promise<unknown> => {
  const filename = RESOURCE_FILENAMES[resource];
  const filePath = resolve(projectRoot, basePath, filename);
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as unknown;
};

export const generateSongsData = async () => {
  const [titlesRaw, textageTagsRaw, chartInfoRaw] = await Promise.all([
    loadJsonResource("title", DATA_SOURCE_DIR),
    loadJsonResource("textage-tag", DATA_SOURCE_DIR),
    loadJsonResource("chart-info", DATA_SOURCE_DIR),
  ]);

  const titlesMap = new Map(Object.entries(iidxDataTableTitleSchema.parse(titlesRaw)));
  const textageTagsMap = new Map(Object.entries(iidxDataTableTextageTagSchema.parse(textageTagsRaw)));
  const chartInfoRecord = iidxDataTableChartInfoSchema.parse(chartInfoRaw);

  const parser = createChartInfoToSongsSchema({
    titlesById: titlesMap,
    textageTagsById: textageTagsMap,
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

  return { count: sortedSongs.length, outputPath };
};

const main = async () => {
  const { count, outputPath } = await generateSongsData();
  console.log(`Generated ${count} songs to ${outputPath}`);
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
