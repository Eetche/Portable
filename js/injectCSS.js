import { ipcMain, BrowserWindow } from "electron"
import path from 'path'

ipcMain.handle("inject-css", async () => {

    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false

    try {
        const defaultCursorPath = path.resolve(import.meta.dirname, 'media', 'default4x.png')
        const pointerCursorPath = path.resolve(import.meta.dirname, 'media', 'pointer4x.png')

        const inlineCSS = `
            html, body, span, input[type="text"] {
                cursor: url("file:///${defaultCursorPath.replace(/\\/g, '/')}"), auto !important;
            }

            button, input[type="submit"], input[type="button"], a, .btn, [role="button"], a:-webkit-any-link, div[role="slider"] {
                cursor: url("file:///${pointerCursorPath.replace(/\\/g, '/')}"), pointer !important;
            }
        `

        // const staticCSS = fs.readFileSync(path.resolve(__dirname, 'styles', 'integrate.css'), 'utf8')

        // win.webContents.insertCSS(staticCSS)
    } catch (error) {
        console.error("CSS integration error", error)
        return false
    }
})

// ipcMain.handle("remove-css", async (event, key) => {
//     const win = BrowserWindow.getFocusedWindow()
//     if (!win) return false

//     try {
//         await win.webContents.removeInsertedCSS(key)
//         injectedCSSKeys.delete(key)
//         console.log("css deleted by key:", key)
//         return true
//     } catch (error) {
//         console.error("css deleting error:", error)
//         return false
//     }
// })
