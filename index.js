const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const window = new BrowserWindow(
        {
            width: 800,
            height: 600
        }
    )

    window.loadFile("windows/index.html");

}

app.whenReady().then(() => { 
   createWindow(); 
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
})