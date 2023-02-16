import _ from "lodash";
import { AvailablePackages } from "../app/startApp.js";

export const extraPackages = {
    "fastify": {
        dependencies: {
            "fastify": "^4.13.0",
        },
        devDependencies: {

        }
    },
    "discord.js": {
        dependencies: {
            "discord.js": "^14.7.1",
        },
        devDependencies: {

        }
    }

};

export type ExtraPackages = typeof extraPackages;
export type KeyOrKeyArray<K extends keyof ExtraPackages> =
    | (keyof ExtraPackages[K])[];
// Path: src\packages\fastify\index.ts


export function getPackageJson(packages: AvailablePackages[]) {
    let dependencies = {};


    for (const pckg of packages) {
        console.log(pckg);
        _.merge(dependencies, extraPackages[pckg]);
    }
    // console.log("🚀 ~ file: packages.ts:24 ~ getPackageJson ~ packages", packages);
    // for (const dependencyType in packages) {
    //     const pckge = packages[dependencyType as keyof typeof packages];
    //     for (const pckg in pckge) {
    //         console.log("🚀 ~ file: packages.ts:24 ~ getPackageJson ~ pckg", pckg);

    //         if (dependencyType === "dependencies") {
    //             dependencies[pckg as keyof typeof packages.dependencies] = extraPackages.dependencies[pckge as keyof typeof extraPackages.devDependencies];
    //         } else {
    //             devDependencies[pckg as keyof typeof packages.devDependencies] = extraPackages.devDependencies[pckge as keyof typeof extraPackages.devDependencies];
    //         }
    //     }
    // }
    return dependencies;
}


export type IExpectedPackages = ReturnType<typeof getPackageJson>;