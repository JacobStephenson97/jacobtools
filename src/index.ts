#!/usr/bin/env node

import { startApp } from "./app/startApp.js";
import { getPackageJson } from "./helpers/packages.js";


async function main() {
    await startApp();
}
await main();


