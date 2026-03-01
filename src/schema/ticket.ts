import { z } from "zod";

import { createLaneTextSchema } from "../utils/laneText";

const expirationSchema = z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/, "有効期限はYYYY/MM/DD形式で入力してください");

export const ticketSchema = z.object({
  laneText: createLaneTextSchema(7, { allowWildcard: false, requireFullLength: true }),
  expiration: expirationSchema.optional(),
});
