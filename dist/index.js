// src/index.ts
import inquirer from "inquirer";
import path3 from "path";
import fs2 from "fs-extra";
import chalk from "chalk";

// src/consts.ts
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var templateDirectory = path.join(__dirname, "../template");
var baseTemplateDirectory = path.join(templateDirectory, "base");

// src/utils/getPackageIndex.ts
function getPackageIndex(options) {
  const includeFastify = options.packages.includes("fastify");
  const includeDiscord = options.packages.includes("discord.js");
  const includePrisma = options.packages.includes("prisma");
  if (includeFastify) {
    return `${options.templateDirectory}/index/with_fastify.ts`;
  } else
    return "";
}

// src/helpers/updateIndex.ts
import fs from "fs-extra";
import path2 from "path";
function updateIndex(options) {
  const index = getPackageIndex(options);
  if (index) {
    fs.removeSync(path2.join(options.userDirectory, "src/index.ts"));
    fs.copyFileSync(index, path2.join(options.userDirectory, "src/index.ts"));
  }
}

// src/helpers/packages.ts
var extraPackages = {
  dependencies: {
    "fastify": "^4.13.0",
    "discord.js": "^13.0.0-dev.163e9b9.163e9b9",
    "prisma": "^3.0.2"
  },
  devDependencies: {}
};
function getPackageJson(packages) {
  const devDependencies = {};
  const dependencies = {};
  for (const dependencyType in packages) {
    const pckge = packages[dependencyType];
    if (dependencyType === "dependencies") {
      dependencies[pckge] = extraPackages.dependencies[pckge];
    } else {
      devDependencies[pckge] = extraPackages.devDependencies[pckge];
    }
  }
  return { devDependencies, dependencies };
}

// src/packages/fastify/index.ts
var requiredFastifyPackages = getPackageJson({
  dependencies: "fastify"
});

// src/index.ts
async function main() {
  const options = {
    projectName: "jstack",
    packages: [],
    userDirectory: path3.resolve(process.cwd(), "jstack"),
    templateDirectory
  };
  const { projectName } = await inquirer.prompt({
    name: "projectName",
    type: "input",
    message: "What will your project be called?",
    default: "jstack",
    transformer: (input) => {
      return input.trim();
    }
  });
  options.userDirectory = path3.resolve(process.cwd(), projectName);
  if (fs2.existsSync(options.userDirectory)) {
    if (fs2.readdirSync(options.userDirectory).length === 0) {
      if (projectName !== ".")
        console.log(`${projectName} exists but is empty, continuing...`);
    } else {
      const { overwrite } = await inquirer.prompt({
        name: "overwrite",
        type: "confirm",
        message: `${projectName} exists and is not empty. Overwrite?`,
        default: false
      });
      if (!overwrite) {
        console.log("Aborting.");
        process.exit(1);
      }
      await fs2.emptyDir(options.userDirectory);
    }
  }
  try {
    fs2.copySync(baseTemplateDirectory, options.userDirectory);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  options.packages = (await inquirer.prompt({
    name: "optIns",
    type: "checkbox",
    message: "What would you like to include?",
    choices: [
      "Fastify",
      "Discord.js",
      "Prisma"
    ]
  })).optIns.map((e) => e.toLowerCase());
  if (options.packages.includes("Discord.js")) {
    console.log("Dicord.js not implemented yet, skipping...");
    options.packages = options.packages.filter((e) => e !== "Discord.js");
  }
  if (options.packages.includes("Prisma")) {
    console.log("Prisma not implemented yet, skipping...");
    options.packages = options.packages.filter((e) => e !== "Prisma");
  }
  const currentPckg = await fs2.readJSON(path3.join(options.userDirectory, "package.json"));
  if (options.packages.includes("fastify")) {
    const deps = requiredFastifyPackages;
    fs2.writeJSONSync(path3.join(options.userDirectory, "package.json"), {
      ...currentPckg,
      dependencies: {
        ...currentPckg.dependencies,
        ...deps.dependencies
      }
    });
  }
  updateIndex(options);
  void finished(projectName);
}
await main();
async function finished(projectName) {
  console.log(`${chalk.green(`cd ${projectName}`)}`);
  process.exit(0);
}
//# sourceMappingURL=index.js.map