import { runCli } from "./cli/index.js";
import { createProject } from "./helpers/createProject.js";
import { parseNameAndPath } from "./utils/parseNameAndPath.js";

async function main() {
  const name = await runCli();

  const [appName, path] = parseNameAndPath(name);
  await createProject(path)
}

main();
