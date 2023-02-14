import { z } from "zod";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();


const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
});
const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error);
  throw new Error("Invalid environment variables");
}
export const env = parsed.data;
