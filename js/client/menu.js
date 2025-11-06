const menu = document.querySelector(".menu")

const menuChilds = document.querySelectorAll(".menu .menuChild")

const menuChildHeight = 52
const margin = 10;

menu.addEventListener('mouseover', () => {

    let botPx = 72

    menuChilds.forEach((child) => {
        child.style.bottom = botPx;
        child.style.opacity = 1;
        botPx += menuChildHeight + margin;
    })
})

menu.addEventListener('mouseout', () => {
    menuChilds.forEach((child) => {
        child.style.bottom = margin
        child.style.opacity = 0
    })
})
