#!/usr/bin/env node

import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { baseTemplateDirectory, templateDirectory } from "./consts.js";
import getPackageIndex from "./utils/getPackageIndex.js";
import { updateIndex } from "./helpers/updateIndex.js";
import { getPackageJson } from "./helpers/packages.js";
import { requiredFastifyPackages } from "./packages/fastify/index.js";
import { getUserPackageManager } from "./utils/getPackageManager.js";
import { installDeps } from "./helpers/installDeps.js";
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


