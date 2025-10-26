import { z } from "zod";

const validateDuplicate = (val: string) => {
  const digits = val.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size === digits.length;
};

const createLaneTextSchema = (length: number, allowWildcard: boolean) => {
  const characters = allowWildcard ? "[1-7*]" : "[1-7]";
  const regex = new RegExp(`^${characters}*$`);
  const message = `指定できるのは1-7${allowWildcard ? "と*" : ""}だけです`;

  const baseSchema = z
    .string()
    .max(length, `${length}文字以内で入力してください`)
    .regex(regex, message)
    .refine(validateDuplicate, { message: "重複している鍵盤があります" });

  return allowWildcard ? baseSchema : baseSchema.length(length, `${length}文字すべて入力してください`);
};

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, true),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, true),
  isNonScratchSideUnordered: z.boolean(),
});
export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const atariRuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  priority: z.number(),
  description: z.string(),
  patterns: z.array(searchFormSchema),
});
export const atariRulesSchema = z.array(atariRuleSchema);

export const manualImportFormSchema = z.object({
  laneText: createLaneTextSchema(7, false),
  expiration: z.string().optional(),
});
export type ManualImportFormValues = z.input<typeof manualImportFormSchema>;
export type ManualImportFormSubmission = z.infer<typeof manualImportFormSchema>;
