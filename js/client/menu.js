const webviewMenu = document.getElementById("webview")

const menuContainer = document.querySelector(".menuContainer")

const menuChilds = document.querySelectorAll(".menu .menuChild")

const chat = document.querySelector(".chat")

const menuChildHeight = 52
const margin = 10;

menuContainer.addEventListener('mouseover', () => {

    let botPx = 72

    menuChilds.forEach((child) => {
        child.style.bottom = botPx;
        child.style.opacity = 1;
        botPx += menuChildHeight + margin;
    })

    menuContainer.style.height = botPx + 20;
})

menuContainer.addEventListener('mouseout', () => {
    menuChilds.forEach((child) => {
        child.style.bottom = margin
        child.style.opacity = 0
    })

    menuContainer.style.height = "auto"
})

chat.addEventListener('click', () => {
    

    window.electronAPI.loadFile("chat.html")
})
