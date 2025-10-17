import { ipcMain, BrowserWindow } from "electron";


function faviconURL(pageUrl, size) {
  return `https://www.google.com/s2/favicons?domain=${new URL(pageUrl).hostname}&sz=${size || 20}`;
}

ipcMain.handle("get-url-icon", (event, url) => {

    try {
        return faviconURL(url, 64)
    } catch (error) {
        console.log("get-url-icon error: " + error)
    }



})
