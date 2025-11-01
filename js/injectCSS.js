import { ipcMain, BrowserWindow } from "electron";

import fs from "fs";
import path from "path";

const customsPath = path.join(
  import.meta.dirname,
  "..",
  "data",
  "customization.json"
);

function refreshCustoms(mainColor, secondColor) {
  BrowserWindow.getAllWindows().forEach(async (window) => {
    if (window.getTitle() == "Portable") {
      await window.webContents.executeJavaScript(`
                document.body.style.backgroundColor = '${mainColor}'

                if (document.querySelector(".topbar")) {
                  document.querySelector(".topbar").style.backgroundColor = '${mainColor}'

                  document.querySelector(".tabs").style.backgroundColor = '${secondColor}'
                  document.querySelector(".topbar input").style.backgroundColor = '${secondColor}'
                  document.querySelectorAll(".topbar button").forEach((button) => {
                      button.style.backgroundColor = '${secondColor}'
                    })
                }

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

  refreshCustoms(parsed.customs['main-color'], parsed.customs['second-color']);
});

ipcMain.handle("inject-css", async (event, css) => {

    const customs = await fs.promises.readFile(customsPath, "utf-8");

    try {
        const parsed = JSON.parse(customs);

        parsed.customs["main-color"] = css["main-color"];
        parsed.customs["second-color"] = css["second-color"]

        await fs.promises.writeFile(
            customsPath,
            JSON.stringify(parsed, null, 2),
            "utf8"
        );
    } catch (error) {
        // ignore
    }
    refreshCustoms(css['main-color'], css['second-color']);
});
