const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),
    loadFile: (fileName) => ipcRenderer.send("load-file", fileName),

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

    getCustoms: () => ipcRenderer.invoke("get-customs"),

    getURLIcon: (url) => ipcRenderer.invoke("get-url-icon", url),

    authPOST: (username, password) => ipcRenderer.invoke("auth-post", username, password),
    regPOST: (username, password) => ipcRenderer.invoke("reg-post", username, password),
    accInfoPOST: (username, password) => ipcRenderer.invoke("acc-info", username, password),
    accInfoByIdPOST: (id) => ipcRenderer.invoke("acc-info-by-id", id),

    getCookie: (url) => ipcRenderer.invoke("get-cookie", url),
    setCookie: (data) => ipcRenderer.invoke("set-cookie", data)
})

ipcRenderer.invoke("restore-customs")
