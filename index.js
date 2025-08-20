import { app, BrowserWindow, ipcMain, Menu} from 'electron'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url"

import { spawn } from 'child_process'

import Window from './js/window.js'
import launchGame from './js/steam.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const zapret = spawn("cmd.exe", ['\c', 'start', '', '"general (ALT3).bat"'], {
//     cwd: "C:\\Users\\user\\Desktop\\zapret-discord-youtube-main",
//     detached: true,
//     windowsHide: true,
//     stdio: 'ignore'
// }).unref()
const injectedCSSKeys = new Map()

// Обработчик для внедрения CSS через preload
ipcMain.handle("inject-css", async (event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false

    try {
        const defaultCursorPath = path.resolve(__dirname, 'media', 'default4x.png')
        const pointerCursorPath = path.resolve(__dirname, 'media', 'pointer4x.png')

        const inlineCSS = `
            html, body, span, input[type="text"] {
                cursor: url("file:///${defaultCursorPath.replace(/\\/g, '/')}"), auto !important;
            }
                        
            button, input[type="submit"], input[type="button"], a, .btn, [role="button"], a:-webkit-any-link, div[role="slider"] {
                cursor: url("file:///${pointerCursorPath.replace(/\\/g, '/')}"), pointer !important;
            }
        `

        const staticCSS = fs.readFileSync(path.resolve(__dirname, 'styles', 'integrate.css'), 'utf8')
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
        console.log("CSS удален с ключом:", key)
        return true
    } catch (error) {
        console.error("Ошибка при удалении CSS:", error)
        return false
    }
})

ipcMain.handle("get-page-info", async (event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null

    try {
        const url = win.webContents.getURL()
        const title = await win.webContents.getTitle()
        return { url, title }
    } catch (error) {
        console.error("Ошибка при получении информации о странице:", error)
        return null
    }
})

ipcMain.handle("open-steam-app", (event, id) => {
    try {
        launchGame(id)
        console.log("open-steam-app is nice")
    } catch (error) {
        console.error("open-steam-app error")   
    }
})

app.whenReady().then(() => {
    Window.createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
})


app.on('web-contents-created', (event, contents) => {
	if (contents.getType() !== 'webview') return;

	contents.on('context-menu', (e, params) => {
		const win = BrowserWindow.fromWebContents(contents) || BrowserWindow.getFocusedWindow();
		const hasText = !!(params.selectionText && params.selectionText.trim().length);

		const template = [
			{ label: 'Назад', enabled: contents.canGoBack(), click: () => contents.goBack() },
			{ label: 'Вперёд', enabled: contents.canGoForward(), click: () => contents.goForward() },
			{ type: 'separator' },
			{ role: 'cut', enabled: params.editFlags.canCut },
			{ role: 'copy', enabled: hasText },
			{ role: 'paste', enabled: params.editFlags.canPaste },
			{ type: 'separator' },
			...(params.linkURL ? [{ label: 'Открыть ссылку в браузере', click: () => shell.openExternal(params.linkURL) }] : []),
			{ type: 'separator' },
			{ label: 'Инспектировать элемент', click: () => contents.inspectElement(params.x, params.y) },
			{ role: 'toggleDevTools', label: 'DevTools' }
		];

		Menu.buildFromTemplate(template).popup({ window: win });
	});
});