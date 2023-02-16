#!/usr/bin/env node

import { startApp } from "./app/startApp.js";
import { getPackageJson } from "./helpers/packages.js";


async function main() {
    console.log(getPackageJson(["fastify", "discord.js"]));
    await startApp();
}
await main();


