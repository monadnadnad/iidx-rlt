import { AtariRule, HighlightColor, PlaySide, Ticket } from "../types";
import { matchTicket } from "./match";
import { generatePatternKey, parsePatternKey } from "./pattern";

const GOLD_QUALITY_THRESHOLD = 5;
const GOLD_QUANTITY_THRESHOLD = 5;
const SILVER_QUALITY_THRESHOLD = 2;
const SILVER_QUANTITY_THRESHOLD = 3;

type RulesByPatternKey = Map<string, AtariRule[]>;
type RulesBySong = Map<string, AtariRule[]>;

interface IAtariMap {
  // チケット全体に対して計算してもいいが、当たりパターン自体少ないのでルールを全探索する
  getRulesForTicket(ticket: Ticket, playSide: PlaySide): AtariRule[] | undefined;
  getRulesForSong(title: string): AtariRule[] | undefined;
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

const createRulesBySong = (allRules: AtariRule[]): RulesBySong => {
  const rulesBySong = new Map<string, AtariRule[]>();
  for (const rule of allRules) {
    const rules = rulesBySong.get(rule.title) ?? [];
    rules.push(rule);
    rulesBySong.set(rule.title, rules);
  }
  return rulesBySong;
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
  const rulesBySong = createRulesBySong(atariRules);

  return {
    getRulesForTicket: (ticket: Ticket, playSide: PlaySide): AtariRule[] | undefined => {
      return getRulesForTicket(ticket, playSide, rulesByPatternKey);
    },
    getRulesForSong: (title: string): AtariRule[] | undefined => {
      return rulesBySong.get(title);
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
