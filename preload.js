const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),

    // removeCSS: (key) => ipcRenderer.invoke("remove-css", key),

    openWebsite: (url) => ipcRenderer.invoke("open-website", url),
    openSteamApp: (id) => ipcRenderer.invoke("open-steam-app", id),

    openExecute: (path) => ipcRenderer.invoke("open-exe", path),
    getDialogPath: () => ipcRenderer.invoke("get-dialog-path"),

    writeTabs: (data) => ipcRenderer.invoke("write-tabs", data),
    getTempTabs: () => ipcRenderer.invoke("get-temp-tabs"),

    writeApps: (data) => ipcRenderer.invoke("write-apps", data),
    getApps: () => ipcRenderer.invoke("get-apps"),

    updateUserTasks: () => ipcRenderer.invoke("update-user-tasks"),

    openSettings: () => ipcRenderer.invoke("open-settings"),
    closeSettings: () => ipcRenderer.invoke("close-settings"),

    injectCSS: (css) => ipcRenderer.invoke("inject-css", css),

    getCustoms: () => ipcRenderer.invoke("get-customs")
})

ipcRenderer.invoke("restore-customs")
