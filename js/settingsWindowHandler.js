import { ipcMain, BrowserWindow, app } from "electron";
import path from "path"

let settingsWindow;

app.on("ready", () => {
  settingsWindow = new BrowserWindow({
    width: 900,
    height: 800,
    parent: BrowserWindow.getFocusedWindow(),
    icon: path.join(import.meta.dirname, "..", "assets", "icon.ico"),
    title: "Settings",
    show: false,
    webPreferences: {
      preload: path.resolve(import.meta.dirname, "..", "preload.js")
    }
  });

  settingsWindow.loadFile(path.join(import.meta.dirname, "..", "windows", "settings.html"))

  settingsWindow.on('close', (event) => {
    event.preventDefault()
    settingsWindow.hide()
  })
});

ipcMain.handle("open-settings", (event) => {
    if (settingsWindow) {

        settingsWindow.show();
    }
});

ipcMain.handle("close-settings", (event) => {
    if (settingsWindow) {

        settingsWindow.hide();
    }
});
