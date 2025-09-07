import { ipcMain } from "electron"

import { writeApps, writeTabs } from "../js/json.js"

import fs from "fs"

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

ipcMain.handle("write-apps", (event, data) => {
	writeApps(data)
})

ipcMain.handle("get-apps", async (event) => {
	try {
		const data = await fs.promises.readFile("./data/apps.json", 'utf8')
		const appsObj = JSON.parse(data)
		return appsObj
	} catch (error) {
		console.error("get-games handle error: " + error)
		return { apps: [] }
	}
})
