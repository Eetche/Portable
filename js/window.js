import { Menu, BrowserWindow } from "electron"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Window {

    static setupContextMenu(win) {
        win.webContents.on('context-menu', (event, params) => {
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
        })
    }

    static createWindow() {
        const window = new BrowserWindow(
            {
                width: 1000,
                height: 800,
                webPreferences: {
                    preload: path.join(__dirname, "..", "preload.js"),
                    webSecurity: false,
                    nodeIntegration: false,
                    contextIsolation: true,
                    webviewTag: true
                }
            }
        )

        window.loadFile(path.join(__dirname, "..", "windows", "index.html"));

        this.setupContextMenu(window)

        return window

    }
}

export default Window