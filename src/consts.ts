import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const templateDirectory = path.join(__dirname, "../template");
export const baseTemplateDirectory = path.join(templateDirectory, "base");