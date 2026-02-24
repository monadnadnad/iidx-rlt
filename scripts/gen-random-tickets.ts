import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type Ticket = {
  laneText: string;
  expiration: string;
};

type CliOptions = {
  count: number;
  out: string;
  stdout: boolean;
};

const DEFAULT_COUNT = 100;
const MAX_UNIQUE_LANES = 5040;
const DEFAULT_OUTPUT_RELATIVE_PATH = "testdata.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const pad2 = (value: number) => value.toString().padStart(2, "0");

const formatToday = (date: Date) => `${date.getFullYear()}/${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}`;

const makeRandomLaneText = (): string => {
  const digits = ["1", "2", "3", "4", "5", "6", "7"];
  for (let i = digits.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.join("");
};

const parsePositiveInt = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`count must be a positive integer: ${value}`);
  }
  return parsed;
};

const parseArgs = (argv: string[]): CliOptions => {
  let count = DEFAULT_COUNT;
  let out = DEFAULT_OUTPUT_RELATIVE_PATH;
  let stdout = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--stdout") {
      stdout = true;
      continue;
    }

    if (arg === "--count" || arg === "-n") {
      const next = argv[i + 1];
      if (!next) {
        throw new Error(`missing value for ${arg}`);
      }
      count = parsePositiveInt(next);
      i += 1;
      continue;
    }

    if (arg.startsWith("--count=")) {
      count = parsePositiveInt(arg.slice("--count=".length));
      continue;
    }

    if (arg === "--out" || arg === "-o") {
      const next = argv[i + 1];
      if (!next) {
        throw new Error(`missing value for ${arg}`);
      }
      out = next;
      i += 1;
      continue;
    }

    if (arg.startsWith("--out=")) {
      out = arg.slice("--out=".length);
      continue;
    }

    throw new Error(`unknown option: ${arg}`);
  }

  if (count > MAX_UNIQUE_LANES) {
    throw new Error(`count must be <= ${MAX_UNIQUE_LANES} (unique laneText upper bound)`);
  }

  return { count, out, stdout };
};

const generateTickets = (count: number, expiration: string): Ticket[] => {
  const laneTexts = new Set<string>();
  while (laneTexts.size < count) {
    laneTexts.add(makeRandomLaneText());
  }
  return Array.from(laneTexts).map((laneText) => ({ laneText, expiration }));
};

export const generateRandomTickets = async ({ count, out, stdout }: CliOptions) => {
  const expiration = formatToday(new Date());
  const tickets = generateTickets(count, expiration);
  const json = `${JSON.stringify(tickets, null, 2)}\n`;

  if (stdout) {
    process.stdout.write(json);
    return { count, expiration, outputPath: "(stdout)" };
  }

  const outputPath = resolve(projectRoot, out);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, json, "utf-8");
  return { count, expiration, outputPath };
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const result = await generateRandomTickets(options);
  console.log(`Generated ${result.count} tickets (expiration: ${result.expiration})`);
  console.log(`Wrote: ${result.outputPath}`);
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
