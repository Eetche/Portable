import { ipcMain, dialog, app } from "electron";
import { spawn } from "child_process"

ipcMain.handle("get-dialog-path", async () => {
    const res = await dialog.showOpenDialog({
        properties: ['openFile']
    })

    if (!res.canceled) {
        const fpath = res.filePaths[0]

        const icon = await app.getFileIcon(fpath, {size: 'large'})


        return {
            path: fpath,
            icon: "data:image/png;base64," + icon.toPNG().toString('base64')
        }
    }
})

ipcMain.handle("open-exe", (event, path) => {
    try {

        spawn(path)

    } catch (err) {

        console.log("open-exe error: " + err)

    }
})
