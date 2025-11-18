import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadConfig() {
    const serverConfig = JSON.parse(await fs.promises.readFile(path.join(__dirname, "config.json")))

    return serverConfig
}

export default loadConfig
