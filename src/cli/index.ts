import { Command } from "commander";
import inquirer from "inquirer";
import { createProject } from "../helpers/createProject.js";
import { parseNameAndPath } from "../utils/parseNameAndPath.js";
interface CliResults {
  appName: string;
}
export async function runCli() {
  const program = new Command().name("jstack");
  program
    .description(
      "A CLI to generate a nodejs project using typescript, with options for more specialized projects"
    )
    // .argument("<project-name>", "Name of the project to generate")
    .parse(process.argv);

  const projectName = await promptAppName();

  

 return projectName 
}
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
