import {contextBridge, ipcRenderer} from 'electron'

import {writeTabs} from './js/json.js'

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),

    // removeCSS: (key) => ipcRenderer.invoke("remove-css", key),

    openWebsite: (url) => ipcRenderer.invoke("open-website", url),
    openSteamApp: (id) => ipcRenderer.invoke("open-steam-app", id),

    writeTabs: (data) => writeTabs(data),

})

// ipcRenderer.invoke("inject-css")
