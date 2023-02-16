import { ExtraPackages, getPackageJson, IExpectedPackages, KeyOrKeyArray } from "../helpers/packages.js";

export const requiredFastifyPackages: IExpectedPackages = getPackageJson({
    dependencies: "discord.js",
});


export const packageMap = {
    "discord.js": getPackageJson({
        dependencies: "discord.js",
    }),
    "fastify": {
        dependencies: "fastify",
    },
};