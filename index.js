import { app, ipcMain, BrowserWindow, shell, Menu } from 'electron'

import Window from './js/window.js'
import launchGame from './js/steam.js'
import { writeTabs }from "./js/json.js"

import fs from "fs"
// import "./js/injectCSS.js" disconnect css injecting

ipcMain.handle("open-steam-app", (event, id) => {
    try {
        launchGame(id)
        console.log("open-steam-app is nice")
    } catch (error) {
        console.error("open-steam-app error: " + error)
    }
})

ipcMain.handle("write-tabs", (event, data) => {
	writeTabs(data)
})

ipcMain.handle("get-temp-tabs", async (event) => {
	try {
		const data = await fs.promises.readFile("./data/temp.json", 'utf8')
		const tabsObj = JSON.parse(data)
		return tabsObj
	} catch (error) {
		console.error("get-temp-tabs handle error: " + error)
		return { tabs: [] }
	}
})

app.whenReady().then(() => {
    Window.createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
})

app.on('web-contents-created', (event, contents) => {

	contents.on('context-menu', (e, params) => {
		const win = BrowserWindow.fromWebContents(contents) || BrowserWindow.getFocusedWindow();
		const hasText = !!(params.selectionText && params.selectionText.trim().length);

		const template = [
			{ label: 'Назад', enabled: contents.navigationHistory.canGoBack(), click: () => contents.navigationHistory.goBack() },
			{ label: 'Вперёд', enabled: contents.navigationHistory.canGoForward(), click: () => contents.navigationHistory.goForward() },
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
