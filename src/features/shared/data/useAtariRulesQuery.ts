import useSWR from "swr";
import { z } from "zod";

import { atariRuleSchema } from "../../../schema/atari-rule";
import type { AtariRule } from "../../../types";

const atariRulesSchema = z.array(atariRuleSchema);

const fetchAtariRules = async (url: string): Promise<AtariRule[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch atari-rules.json: ${res.status}`);
  }
  const json: unknown = await res.json();
  return atariRulesSchema.parse(json);
};

export const useAtariRulesQuery = () => {
  const swr = useSWR<AtariRule[], Error>(`${import.meta.env.BASE_URL}data/atari-rules.json`, fetchAtariRules);

  return {
    atariRules: swr.data ?? [],
    isLoading: swr.isLoading,
    error: swr.error,
  };
};
