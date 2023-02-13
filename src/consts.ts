import path from "path";
import { fileURLToPath } from "url";
console.log(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");
