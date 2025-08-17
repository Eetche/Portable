const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs')
const path = require('path')

const createWindow = () => {
    const window = new BrowserWindow(
        {
            width: 1000,
            height: 800,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                webSecurity: false,
                nodeIntegration: false,
                contextIsolation: true
            }
        }
    )

    window.loadFile("windows/index.html");

}

// Хранилище для ключей внедренного CSS
const injectedCSSKeys = new Map()

// Обработчик для внедрения CSS через preload
ipcMain.handle("inject-css", async (event, css) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false
    
    try {
        const key = await win.webContents.insertCSS(css)
        injectedCSSKeys.set(key, css)
        console.log("CSS внедрен с ключом:", key)
        return key
    } catch (error) {
        console.error("Ошибка при внедрении CSS:", error)
        return false
    }
})

// Обработчик для удаления CSS
ipcMain.handle("remove-css", async (event, key) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false
    
    try {
        await win.webContents.removeInsertedCSS(key)
        injectedCSSKeys.delete(key)
        console.log("CSS удален с ключом:", key)
        return true
    } catch (error) {
        console.error("Ошибка при удалении CSS:", error)
        return false
    }
})

// Обработчик для получения информации о странице
ipcMain.handle("get-page-info", async (event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null
    
    try {
        const url = win.webContents.getURL()
        const title = await win.webContents.getTitle()
        return { url, title }
    } catch (error) {
        console.error("Ошибка при получении информации о странице:", error)
        return null
    }
})

ipcMain.on("load-url", async (event, url) => {
    const win = BrowserWindow.getFocusedWindow() 
    
    try {
        // Загружаем URL
        await win.loadURL(`https://www.google.com/search?q=${url}`)
        
        // Ждем полной загрузки страницы
        await new Promise(resolve => {
            win.webContents.once('did-finish-load', resolve)
        })
        
        // Получаем абсолютные пути к файлам курсоров
        const defaultCursorPath = path.resolve(__dirname, 'media', 'default4x.png')
        const pointerCursorPath = path.resolve(__dirname, 'media', 'pointer4x.png')
        
        // Способ 1: Встроенный CSS с правильными путями
        const inlineCSS = `
            html, body {
                cursor: url("file:///${defaultCursorPath.replace(/\\/g, '/')}"), auto !important;
            }
                        
            button, input[type="submit"], input[type="button"], a, .btn, [role="button"] {
                cursor: url("file:///${pointerCursorPath.replace(/\\/g, '/')}"), pointer !important;
            }
            
            /* Дополнительные стили для Google */
            .g, .rc, .r {
                border: 2px solid #4285f4 !important;
                border-radius: 8px !important;
                margin: 10px 0 !important;
                padding: 10px !important;
            }
            
            /* Изменение цвета фона */
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            }
        `
        
        await win.webContents.insertCSS(inlineCSS)
        console.log("css is integrated")
        console.log("Default cursor path:", defaultCursorPath)
        console.log("Pointer cursor path:", pointerCursorPath)
        
        // Способ 2: Загрузка CSS из файла
        const cssFilePath = path.join(__dirname, 'styles', 'integrate.css')
        if (fs.existsSync(cssFilePath)) {
            const fileCSS = fs.readFileSync(cssFilePath, 'utf-8')
                .replace(/__dirname__/g, __dirname)
                .replace(/file:\/\/__dirname__/g, `file:///${__dirname.replace(/\\/g, '/')}`)
            
            await win.webContents.insertCSS(fileCSS)
            console.log("css successfully integrated")
        }
        
    } catch (error) {
        console.error("css integration error", error)
    }
})

app.whenReady().then(() => {
   createWindow();
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
})

