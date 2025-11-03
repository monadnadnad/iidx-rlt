import { AtariRule, HighlightColor, PlaySide, Ticket } from "../types";
import { matchTicket } from "./match";
import { generatePatternKey, parsePatternKey } from "./pattern";

const GOLD_QUALITY_THRESHOLD = 5;
const GOLD_QUANTITY_THRESHOLD = 5;
const SILVER_QUALITY_THRESHOLD = 2;
const SILVER_QUANTITY_THRESHOLD = 3;

type RulesByPatternKey = Map<string, AtariRule[]>;
type RulesByChart = Map<string, AtariRule[]>;

const createChartKey = (songId: AtariRule["songId"], difficulty: AtariRule["difficulty"]) => `${songId}#${difficulty}`;

interface IAtariMap {
  // チケット全体に対して計算してもいいが、当たりパターン自体少ないのでルールを全探索する
  getRulesForTicket(ticket: Ticket, playSide: PlaySide): AtariRule[] | undefined;
  getRulesForSong(songId: AtariRule["songId"], difficulty: AtariRule["difficulty"]): AtariRule[] | undefined;
  getColorForTicket(ticket: Ticket, playSide: PlaySide): HighlightColor | undefined;
}

export const getHighlightColor = (rules: AtariRule[]): HighlightColor => {
  if (rules.length === 0) {
    return undefined;
  }
  const matchCount = rules.length;
  const maxPriority = Math.max(...rules.map((r) => r.priority), 0);
  if (maxPriority >= GOLD_QUALITY_THRESHOLD || matchCount >= GOLD_QUANTITY_THRESHOLD) {
    return "gold";
  }
  if (maxPriority >= SILVER_QUALITY_THRESHOLD || matchCount >= SILVER_QUANTITY_THRESHOLD) {
    return "silver";
  }
  return "bronze";
};

const createRulesByPatternKey = (allRules: AtariRule[]): RulesByPatternKey => {
  const rulesByPatternKey = new Map<string, AtariRule[]>();
  for (const rule of allRules) {
    for (const pattern of rule.patterns) {
      const key = generatePatternKey(pattern);
      const rules = rulesByPatternKey.get(key) ?? [];
      rules.push(rule);
      rulesByPatternKey.set(key, rules);
    }
  }
  return rulesByPatternKey;
};

const createRulesByChart = (allRules: AtariRule[]): RulesByChart => {
  const rulesByChart = new Map<string, AtariRule[]>();
  for (const rule of allRules) {
    const key = createChartKey(rule.songId, rule.difficulty);
    const rules = rulesByChart.get(key) ?? [];
    rules.push(rule);
    rulesByChart.set(key, rules);
  }
  return rulesByChart;
};

const getRulesForTicket = (
  ticket: Ticket,
  playSide: PlaySide,
  rulesByPatternKey: RulesByPatternKey
): AtariRule[] | undefined => {
  const matchedRules: AtariRule[] = [];
  // 20 ~ 増えすぎても100パターンくらいを全探索
  for (const [key, rules] of rulesByPatternKey.entries()) {
    const pattern = parsePatternKey(key);
    if (matchTicket(ticket, pattern, playSide)) {
      matchedRules.push(...rules);
    }
  }
  return matchedRules.length > 0 ? matchedRules.sort((a, b) => b.priority - a.priority) : undefined;
};

export const createAtariMap = (atariRules: AtariRule[]): IAtariMap => {
  const rulesByPatternKey = createRulesByPatternKey(atariRules);
  const rulesByChart = createRulesByChart(atariRules);

  return {
    getRulesForTicket: (ticket: Ticket, playSide: PlaySide): AtariRule[] | undefined => {
      return getRulesForTicket(ticket, playSide, rulesByPatternKey);
    },
    getRulesForSong: (songId: AtariRule["songId"], difficulty: AtariRule["difficulty"]): AtariRule[] | undefined => {
      return rulesByChart.get(createChartKey(songId, difficulty));
    },
    getColorForTicket: (ticket: Ticket, playSide: PlaySide): HighlightColor => {
      const rules = getRulesForTicket(ticket, playSide, rulesByPatternKey);
      if (!rules) {
        return undefined;
      }
      return getHighlightColor(rules);
    },
  };
};
