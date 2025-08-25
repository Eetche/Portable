import fs from "fs"
import path from "path"

const tempPath = path.join(import.meta.dirname, "..", "data", "temp.json")

function writeTabs(tabs) {
    const stringTabs = JSON.stringify({tabs: tabs})

    fs.readFile(tempPath, 'utf-8', (err, data) => {
        if (err) {
            console.log("writeTabs readFile error: " + err)
        }

        console.log(data)

        fs.writeFile(tempPath, stringTabs, 'utf-8', (err) => {
            if (err) {
                console.log("writeTabs writeFile error: " + err)
            }
        })
    })

}

export {writeTabs}
