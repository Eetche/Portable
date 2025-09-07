import { ipcMain, dialog } from "electron";
import { spawn } from "child_process"

ipcMain.handle("get-dialog-path", async () => {
    const res = await dialog.showOpenDialog({
        properties: ['openFile']
    })

    if (!res.canceled) {
        const fpath = res.filePaths[0]


        return fpath
    }
})

ipcMain.handle("open-exe", (event, path) => {
    try {

        spawn(path)

    } catch (err) {

        console.log("open-exe error: " + err)

    }
})
