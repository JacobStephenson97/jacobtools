import inquirer from "inquirer";
import path from "path";
import { templateDirectory, baseTemplateDirectory } from "../consts.js";
import { installDeps } from "../helpers/installDeps.js";
import { updateIndex } from "../helpers/updateIndex.js";
import { getUserPackageManager } from "../utils/getPackageManager.js";
import fs from "fs-extra";
import chalk from "chalk";
import { getPackageJson } from "../helpers/packages.js";
import _ from "lodash";
import { fixEnv } from "../helpers/fixEnv.js";
export type AvailablePackages = "fastify" | "discord.js" | "prisma";

export type AppOptions = {
    projectName: string;
    packages: AvailablePackages[];
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


    options.packages = (await inquirer.prompt<{ optIns: AvailablePackages[]; }>({
        name: "optIns",
        type: "checkbox",
        message: "What would you like to include?",
        choices: [
            "fastify",
            "discord.js",
            "prisma"
        ],
    })).optIns;


    if (options.packages.includes("prisma")) {
        console.log("Prisma not implemented yet, skipping...");
        options.packages = options.packages.filter((e) => e !== "prisma");
    }


    //copy base directory 
    try {
        fs.copySync(baseTemplateDirectory, options.userDirectory);
        fs.renameSync(options.userDirectory + "/_env", options.userDirectory + "/.env");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    const deps = getPackageJson(
        options.packages,
    );
    //update package.json
    const currentPckg = await fs.readJSON(path.join(options.userDirectory, "package.json"));

    const newPackages = _.merge(currentPckg, deps);
    if (options.packages.includes("fastify")) {
        fs.writeJSONSync(path.join(options.userDirectory, "package.json",), newPackages, { spaces: 2 });

    }
    //get correct index file from template/index
    updateIndex(options);
    //update env
    await fixEnv(options);
    await installDeps(options);
    void finished(projectName, options);
};

async function finished(projectName: string, options: AppOptions) {
    console.log(`${chalk.green(`cd ${projectName}`)}`);
    console.log(`${chalk.green(`${options.packageManager} run dev`)}`);
    process.exit(0);
};
