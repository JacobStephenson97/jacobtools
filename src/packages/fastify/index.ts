import { ExtraPackages, getPackageJson, IExpectedPackages, KeyOrKeyArray } from "../../helpers/packages.js";

export const requiredFastifyPackages: IExpectedPackages = getPackageJson({
    dependencies: "fastify",
});
