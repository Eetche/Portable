import fs from "fs"
import path from "path"

const tempPath = path.resolve(import.meta.dirname, "..", "data", "temp.json")

console.log("json.js: " + tempPath)

let isWriting = false

async function writeTabs(tabs) {
    while (isWriting) {
        await new Promise(resolve => setTimeout(resolve, 10))
    }

    isWriting = true

    try {
        const data = await fs.promises.readFile(tempPath, 'utf8')
        const parsed = JSON.parse(data)
        parsed.tabs = tabs
        const strData = JSON.stringify(parsed, null, 2)
        await fs.promises.writeFile(tempPath, strData, 'utf8')
    } catch (error) {
        console.log("writeTabs error: " + error)
    } finally {
        isWriting = false
    }
}

export {writeTabs}
