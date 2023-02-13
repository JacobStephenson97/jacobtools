export const extraPackages = {
    dependencies: {
        "fastify": "^4.13.0",
        "discord.js": "^13.0.0-dev.163e9b9.163e9b9",
        "prisma": "^3.0.2",
    },
    devDependencies: {

    }
};

export type ExtraPackages = typeof extraPackages;
export type KeyOrKeyArray<K extends keyof ExtraPackages> =
    | keyof ExtraPackages[K]
    | (keyof ExtraPackages[K])[];
// Path: src\packages\fastify\index.ts

export function getPackageJson(packages: { [K in keyof ExtraPackages]?: KeyOrKeyArray<K> }) {
    const devDependencies: { [K in keyof ExtraPackages["devDependencies"]]?: string } = {};
    const dependencies: { [K in keyof ExtraPackages["dependencies"]]?: string } = {};
    for (const dependencyType in packages) {
        const pckge = packages[dependencyType as keyof typeof packages];
        if (dependencyType === "dependencies") {
            dependencies[pckge as keyof typeof packages.devDependencies] = extraPackages.dependencies[pckge as keyof typeof extraPackages.devDependencies];
        } else {
            devDependencies[pckge as keyof typeof packages.devDependencies] = extraPackages.devDependencies[pckge as keyof typeof extraPackages.devDependencies];
        }
    }
    return { devDependencies, dependencies };
}


export type IExpectedPackages = ReturnType<typeof getPackageJson>;