import fs from "fs"
import path from "path"

const tempPath = path.join(import.meta.dirname, "..", "data", "temp.json")

function writeTabs(tabs) {

    fs.readFile(tempPath, 'utf-8', (err, data) => {
        if (err) {
            console.log("writeTabs readFile error: " + err)
        }

        const parsed = JSON.parse(data)

        parsed.tabs = tabs

        const strData = JSON.stringify(parsed, null, 2)

        console.log(strData)

        fs.writeFile(tempPath, strData, 'utf-8', (err) => {
            if (err) {
                console.log("writeTabs writeFile error: " + err)
            }
        })
    })

}

export {writeTabs}
