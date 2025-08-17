const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),
    
    // Новые методы для управления CSS
    injectCSS: (css) => ipcRenderer.invoke("inject-css", css),
    removeCSS: (key) => ipcRenderer.invoke("remove-css", key),
    
    // Метод для получения информации о текущей странице
    getPageInfo: () => ipcRenderer.invoke("get-page-info")
})

