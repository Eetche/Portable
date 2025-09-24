import { ipcMain } from "electron"

import { writeApps, writeTabs } from "../js/json.js"

import fs from "fs"

import path from "path"

ipcMain.handle("write-tabs", (event, data) => {
	writeTabs(data)
})

ipcMain.handle("get-temp-tabs", async (event) => {
	try {
		const tempPath = path.resolve(import.meta.dirname, "..", "data", "temp.json")
		const data = await fs.promises.readFile(tempPath, 'utf8')
		const tabsObj = JSON.parse(data)
		return tabsObj
	} catch (error) {
		console.error("get-temp-tabs handle error: " + error)
		return { tabs: [] }
	}
})

ipcMain.handle("write-apps", (event, data) => {
	writeApps(data)
})

ipcMain.handle("get-apps", async (event) => {
	try {
		const appsPath = path.resolve(import.meta.dirname, "..", "data", "apps.json")
		const data = await fs.promises.readFile(appsPath, 'utf8')
		const appsObj = JSON.parse(data)
		return appsObj
	} catch (error) {
		console.error("get-games handle error: " + error)
		return { apps: [] }
	}
})
