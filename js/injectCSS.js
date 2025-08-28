import { ipcMain, BrowserWindow } from "electron"
import path from 'path'

ipcMain.handle("inject-css", async () => {

    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false

    try {

        const staticCSS = fs.readFileSync(path.resolve(__dirname, 'styles', 'integrate.css'), 'utf8')

        win.webContents.insertCSS(staticCSS)
    } catch (error) {
        console.error("CSS integration error", error)
        return false
    }
})

ipcMain.handle("remove-css", async (event, key) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false

    try {
        await win.webContents.removeInsertedCSS(key)
        injectedCSSKeys.delete(key)
        console.log("css deleted by key:", key)
        return true
    } catch (error) {
        console.error("css deleting error:", error)
        return false
    }
})
