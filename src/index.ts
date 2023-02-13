#!/usr/bin/env node

import { startApp } from "./app/startApp.js";

export type AppOptions = {
    projectName: string;
    packages: string[];
    templateDirectory: string;
    userDirectory: string;
    packageManager: "npm" | "yarn" | "pnpm";
};

async function main() {
    await startApp();
}
await main();


