import path from "path";
import { scaffoldProject } from "./scaffoldProject.js";

export async function createProject(projectName: string) {
  const projectDir = path.resolve(process.cwd(), projectName);

  await scaffoldProject({ projectName, projectDir });
}
