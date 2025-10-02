import { ipcMain, BrowserWindow } from "electron";

import fs from "fs";
import path from "path";

const customsPath = path.join(
  import.meta.dirname,
  "..",
  "data",
  "customization.json"
);

function refreshCustoms(mainColor) {
  BrowserWindow.getAllWindows().forEach(async (window) => {
    if (window.getTitle() == "Portable") {
      await window.webContents.executeJavaScript(`
                document.body.style.backgroundColor = '${mainColor}'
                `);
    }
  });
}

ipcMain.handle("get-customs", async () => {
    return JSON.parse(await fs.promises.readFile(customsPath, 'utf-8'))
})

ipcMain.handle("restore-customs", async () => {
  const customs = await fs.promises.readFile(customsPath, "utf-8");
  const parsed = JSON.parse(customs);

  console.log(parsed)

  refreshCustoms(parsed.customs['main-color']);
});

ipcMain.handle("inject-css", async (event, css) => {

    const customs = await fs.promises.readFile(customsPath, "utf-8");

    try {
        const parsed = JSON.parse(customs);

        parsed.customs["main-color"] = css["main-color"];

        await fs.promises.writeFile(
            customsPath,
            JSON.stringify(parsed, null, 2),
            "utf8"
        );
    } catch (error) {
        // ignore
    }
    refreshCustoms(css['main-color']);
});


ipcMain.handle("remove-css", async (event, key) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return false;

  try {
    await win.webContents.removeInsertedCSS(key);
    injectedCSSKeys.delete(key);
    console.log("css deleted by key:", key);
    return true;
  } catch (error) {
    console.error("css deleting error:", error);
    return false;
  }
});
