import inquirer from "inquirer";
import path from "path";
import { parseNameAndPath } from "./utils/parseNameAndPath.js";
import fs from "fs-extra";
import { PKG_ROOT } from "./consts.js";
import ora from "ora";
import chalk from "chalk";
interface CliResults {
  appName: string;
}
export async function createProject(projectName: string) {
  const projectDir = path.resolve(process.cwd(), projectName);

  await scaffoldProject({ projectName, projectDir });
}

// export async function runCli() {

//   const projectName = await promptAppName();
//   return projectName;
// }

const promptAppName = async (): Promise<string> => {
  const { appName } = await inquirer.prompt<Pick<CliResults, "appName">>({
    name: "appName",
    type: "input",
    message: "What will your project be called?",
    default: "jstack",
    // validate: validateAppName,
    transformer: (input: string) => {
      return input.trim();
    },
  });

  return appName;
};

export async function scaffoldProject({
  projectName,
  projectDir,
}: {
  projectName: string;
  projectDir: string;
}) {
  const srcDir = path.join(PKG_ROOT, "template/base");
  //   if (!noInstall) {
  //     logger.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`);
  //   } else {
  //     logger.info("");
  //   }
  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start();
  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      if (projectName !== ".")
        spinner.info(
          `${chalk.cyan.bold(
            projectName,
          )} exists but is empty, continuing...\n`,
        );
    } else {
      spinner.stopAndPersist();
      const { overwriteDir } = await inquirer.prompt<{
        overwriteDir: "abort" | "clear" | "overwrite";
      }>({
        name: "overwriteDir",
        type: "list",
        message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
          projectName,
        )} already exists and isn't empty. How would you like to proceed?`,
        choices: [
          {
            name: "Abort installation (recommended)",
            value: "abort",
            short: "Abort",
          },
          {
            name: "Clear the directory and continue installation",
            value: "clear",
            short: "Clear",
          },
          {
            name: "Continue installation and overwrite conflicting files",
            value: "overwrite",
            short: "Overwrite",
          },
        ],
        default: "abort",
      });
      if (overwriteDir === "abort") {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === "clear"
          ? "clear the directory"
          : "overwrite conflicting files";

      const { confirmOverwriteDir } = await inquirer.prompt<{
        confirmOverwriteDir: boolean;
      }>({
        name: "confirmOverwriteDir",
        type: "confirm",
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      if (overwriteDir === "clear") {
        spinner.info(
          `Emptying ${chalk.cyan.bold(projectName)} and creating t3 app..\n`,
        );
        fs.emptyDirSync(projectDir);
      }
    }
  }
  const scaffoldedName =
    projectName === "." ? "App" : chalk.cyan.bold(projectName);
  fs.copySync(srcDir, projectDir);
  spinner.succeed(
    `${scaffoldedName} ${chalk.green("scaffolded successfully!")}\n`,
  );
}

async function main() {
  // const name = await runCli();
  const projectName = await promptAppName();

  const [appName, path] = parseNameAndPath(projectName);
  await createProject(path);
}

main();
