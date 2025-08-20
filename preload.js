const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI", {
    loadUrl: (url) => ipcRenderer.send("load-url", url),
    injectCSS: () => ipcRenderer.invoke("inject-css"),
    removeCSS: (key) => ipcRenderer.invoke("remove-css", key),
    openWebsite: (url) => ipcRenderer.invoke("open-website", url),
    openSteamApp: (id) => ipcRenderer.invoke("open-steam-app", id)
    
})

ipcRenderer.invoke("inject-css")


// window.addEventListener("DOMContentLoaded", () => {
//     const div = document.createElement('div');

//     document.querySelector('html').style.marginTop = "40px"

//     div.style = `
//         position: fixed;
//         left: 0px;
//         top: 0px;
//         width: 100%;
//         height: 40px;
//         background-color: rgb(30,30,30);
//         border-bottom: 1px solid rgba(255,255,255, 0.1);
//         margin-bottom: 50px;
//         z-index: 9999;
//     `

//     document.body.appendChild(div)


// })