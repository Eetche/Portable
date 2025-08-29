const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),

    // removeCSS: (key) => ipcRenderer.invoke("remove-css", key),

    openWebsite: (url) => ipcRenderer.invoke("open-website", url),
    openSteamApp: (id) => ipcRenderer.invoke("open-steam-app", id),

    writeTabs: (data) => ipcRenderer.invoke("write-tabs", data),
    getTempTabs: () => ipcRenderer.invoke("get-temp-tabs")

})

// ipcRenderer.invoke("inject-css")
