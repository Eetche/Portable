import { BrowserWindow, app } from "electron"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Window {

    static createWindow() {
        const window = new BrowserWindow(
            {
                width: 1200,
                height: 800,
                icon: path.join(__dirname, "..", "assets", "icon.ico"),
                title: "Portable",
                webPreferences: {
                    preload: path.join(__dirname, "..", "preload.js"),
                    webSecurity: false,
                    nodeIntegration: false,
                    contextIsolation: true,
                    webviewTag: true,
                    allowRunningInsecureContent: true,
                    experimentalFeatures: true
                }
            }
        )

        window.on('close', () => {
            app.exit(0)
        })


        window.loadFile(path.join(__dirname, "..", "windows", "chat.html"));

        window.webContents.on('did-attach-webview', (event, webContents) => {
            webContents.setWindowOpenHandler(({ url }) => {
                return { action: 'allow' };
            });
        });

        return window

}
}

export default Window
