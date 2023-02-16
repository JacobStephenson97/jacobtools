import { AppOptions } from "../index.js";

export default function getPackageIndex(options: AppOptions): string {
    const includeFastify = options.packages.includes("fastify");
    const includeDiscord = options.packages.includes("discord.js");
    const includePrisma = options.packages.includes("prisma");

    if (includeFastify && includeDiscord) {
        return `${options.templateDirectory}/index/with_discord_and_fastify.ts`;
    }
    if (includeFastify) {
        return `${options.templateDirectory}/index/with_fastify.ts`;
    }
    else return "";
}