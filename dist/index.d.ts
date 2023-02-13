type AppOptions = {
    projectName: string;
    packages: string[];
    templateDirectory: string;
    userDirectory: string;
    packageManager: "npm" | "yarn" | "pnpm";
};

export { AppOptions };
