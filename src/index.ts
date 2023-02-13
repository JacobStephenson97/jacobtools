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

export type AppOptions = {
    projectName: string;
    packages: string[];
    templateDirectory: string;
    userDirectory: string;
    packageManager: "npm" | "yarn" | "pnpm";
};

async function main() {
    const options: AppOptions = {
        projectName: "jstack",
        packages: [],
        userDirectory: path.resolve(process.cwd(), "jstack"),
        templateDirectory,
        packageManager: getUserPackageManager()
    };

    console.log(options.packageManager);


    const { projectName } = await inquirer.prompt<{ projectName: string; }>({
        name: "projectName",
        type: "input",
        message: "What will your project be called?",
        default: "jstack",
        transformer: (input) => {
            return input.trim();
        }
    });

    options.userDirectory = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(options.userDirectory)) {
        if (fs.readdirSync(options.userDirectory).length === 0) {
            if (projectName !== ".")
                console.log(`${projectName} exists but is empty, continuing...`);
        } else {
            const { overwrite } = await inquirer.prompt<{ overwrite: boolean; }>({
                name: "overwrite",
                type: "confirm",
                message: `${projectName} exists and is not empty. Overwrite?`,
                default: false
            });
            if (!overwrite) {
                console.log("Aborting.");
                process.exit(1);
            }
            await fs.emptyDir(options.userDirectory);
        }
    }
    try {
        fs.copySync(baseTemplateDirectory, options.userDirectory);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }


    options.packages = (await inquirer.prompt<{ optIns: string[]; }>({
        name: "optIns",
        type: "checkbox",
        message: "What would you like to include?",
        choices: [
            "Fastify",
            "Discord.js",
            "Prisma"
        ],
    })).optIns.map((e) => e.toLowerCase());

    //remove the packages from the list for now
    if (options.packages.includes("Discord.js")) {
        console.log("Dicord.js not implemented yet, skipping...");
        options.packages = options.packages.filter((e) => e !== "Discord.js");
    }
    if (options.packages.includes("Prisma")) {
        console.log("Prisma not implemented yet, skipping...");
        options.packages = options.packages.filter((e) => e !== "Prisma");
    }

    //TODO: add the packages to the package.json
    const currentPckg = await fs.readJSON(path.join(options.userDirectory, "package.json"));
    if (options.packages.includes("fastify")) {
        const deps = requiredFastifyPackages;
        fs.writeJSONSync(path.join(options.userDirectory, "package.json",), {
            ...currentPckg,
            dependencies: {
                ...currentPckg.dependencies,
                ...deps.dependencies
            }
        }, { spaces: 2 });
    }

    //TODO: Find and move the correct index.ts file
    updateIndex(options);
    await installDeps(options);
    void finished(projectName, options);
}
await main();


async function finished(projectName: string, options: AppOptions) {
    console.log(`${chalk.green(`cd ${projectName}`)}`);
    console.log(`${chalk.green(`${options.packageManager} run dev`)}`);
    process.exit(0);
};
