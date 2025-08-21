const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),
    injectCSS: () => ipcRenderer.invoke("inject-css"),
    removeCSS: (key) => ipcRenderer.invoke("remove-css", key),
    openWebsite: (url) => ipcRenderer.invoke("open-website", url),
    openSteamApp: (id) => ipcRenderer.invoke("open-steam-app", id)
    
})

ipcRenderer.invoke("inject-css")