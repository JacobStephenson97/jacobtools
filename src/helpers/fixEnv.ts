import type { AppOptions } from "../app/startApp.js";
import fs from "fs-extra";
import path from "path";
export async function fixEnv(options: AppOptions) {
  const schemaFile = await fs.readFile(path.join(options.userDirectory, "src", "env", "schema.ts"), "utf-8");
  const newSchema = schemaFile.split("\n").map((line) => {
    if (line.includes("NODE_ENV") && options.packages.includes("fastify")) {
      line = line + "\n  PORT: z.string(),";
    }
    if (line.includes("NODE_ENV") && options.packages.includes("discord.js")) {
      line = line + "\n  DISCORD_TOKEN: z.string(),\n  DISCORD_CLIENT_ID: z.string(),";
    }
    return line;
  });
  fs.writeFileSync(path.join(options.userDirectory, "src", "env", "schema.ts"), newSchema.join("\n"));
  const envFile = await fs.readFile(path.join(options.userDirectory, ".env"), "utf-8");
  const getNewEnv = () => {
    let newEnv = "";
    if (options.packages.includes("fastify")) {
      newEnv = newEnv + "PORT=3000\n";
    }
    if (options.packages.includes("discord.js")) {
      newEnv = newEnv + "DISCORD_TOKEN=\nDISCORD_CLIENT_ID=\n";
    }
    return newEnv;
  };
  const newEnvFile = envFile.concat(getNewEnv());

  fs.writeFileSync(path.join(options.userDirectory, ".env"), newEnvFile.trim());

};