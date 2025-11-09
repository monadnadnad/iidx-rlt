import { z } from "zod";

type LaneTextSchemaOptions = {
  allowWildcard?: boolean;
  requireFullLength?: boolean;
};

const hasDuplicateDigits = (value: string) => {
  const digits = value.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size !== digits.length;
};

export const createLaneTextSchema = (length: number, options: LaneTextSchemaOptions = {}) => {
  const allowWildcard = options.allowWildcard ?? false;
  const requireFullLength = options.requireFullLength ?? !allowWildcard;

  const characters = allowWildcard ? "[1-7*]" : "[1-7]";
  const regex = new RegExp(`^${characters}*$`);
  const message = `指定できるのは1-7${allowWildcard ? "と*" : ""}だけです`;

  let schema = z
    .string()
    .max(length, `${length}文字以内で入力してください`)
    .regex(regex, message)
    .refine((val) => !hasDuplicateDigits(val), { message: "重複している鍵盤があります" });

  if (requireFullLength) {
    schema = schema.length(length, `${length}文字すべて入力してください`);
  }

  return schema;
};
