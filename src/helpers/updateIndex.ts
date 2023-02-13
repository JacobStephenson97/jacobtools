import getPackageIndex from "../utils/getPackageIndex.js";
import fs from "fs-extra";
import path from "path";
import { AppOptions } from "../index.js";
export function updateIndex(options: AppOptions): void {
    const index = getPackageIndex(options);
    if (index) {
        fs.removeSync(path.join(options.userDirectory, "src/index.ts"));
        fs.copyFileSync(index, path.join(options.userDirectory, "src/index.ts"));
    }
}