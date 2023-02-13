import inquirer from "inquirer";
import path from "path";
import { templateDirectory, baseTemplateDirectory } from "../consts.js";
import { installDeps } from "../helpers/installDeps.js";
import { updateIndex } from "../helpers/updateIndex.js";
import { requiredFastifyPackages } from "../packages/fastify/index.js";
import { getUserPackageManager } from "../utils/getPackageManager.js";
import fs from "fs-extra";
import chalk from "chalk";

export type AppOptions = {
    projectName: string;
    packages: string[];
    templateDirectory: string;
    userDirectory: string;
    packageManager: "npm" | "yarn" | "pnpm";
};

export async function startApp() {

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
    if (options.packages.includes("discord.js")) {
        console.log("Dicord.js not implemented yet, skipping...");
        options.packages = options.packages.filter((e) => e !== "Discord.js");
    }
    if (options.packages.includes("prisma")) {
        console.log("Prisma not implemented yet, skipping...");
        options.packages = options.packages.filter((e) => e !== "Prisma");
    }


    //copy base directory 
    try {
        fs.copySync(baseTemplateDirectory, options.userDirectory);
        fs.renameSync(options.userDirectory + "/_env", options.userDirectory + "/.env");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    //update package.json
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
    //get correct index file from template/index
    updateIndex(options);

    await installDeps(options);
    void finished(projectName, options);
}

async function finished(projectName: string, options: AppOptions) {
    console.log(`${chalk.green(`cd ${projectName}`)}`);
    console.log(`${chalk.green(`${options.packageManager} run dev`)}`);
    process.exit(0);
};
