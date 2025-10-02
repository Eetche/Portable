const settingsBtn = document.querySelector(".settings")
const settingsMenu = document.querySelector(".settingsMenu")

window.electronAPI.openSettings()
settingsBtn.addEventListener('click', () => {
    window.electronAPI.openSettings()
})
