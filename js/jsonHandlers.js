import { ipcMain } from "electron"

import { writeApps, writeTabs, getApps, getTabs } from "../js/json.js"

ipcMain.handle("write-tabs", (event, data) => {
	writeTabs(data)
})

ipcMain.handle("get-temp-tabs", async (event) => {
	return getTabs()
})

ipcMain.handle("write-apps", (event, data) => {
	writeApps(data)
})

ipcMain.handle("get-apps", async (event) => {
	return getApps()
})