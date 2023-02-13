import chalk from "chalk";
import { exec } from "child_process";
import ora from "ora";
import { promisify } from "util";
import { AppOptions } from "../index.js";
export const execa = promisify(exec);


export async function installDeps(options: AppOptions) {
    console.log(
        `\n${chalk.blue("Using")} ${chalk.bold(
            chalk.yellow(options.packageManager.toUpperCase())
        )} ${chalk.bold(chalk.blue("as package manager"))}`
    );
    const spinner = ora("Installing dependencies").start();
    try {
        await execa(`${options.packageManager} install`, { cwd: options.userDirectory });
        spinner.succeed("Installed dependencies");
    } catch (e) {
        spinner.fail(`Couldn't install template dependencies: ${(e)}`);
        process.exit(1);
    }
}