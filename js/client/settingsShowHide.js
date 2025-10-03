const settingsBtn = document.querySelector(".settings")
const settingsMenu = document.querySelector(".settingsMenu")

settingsBtn.addEventListener('click', () => {
    window.electronAPI.openSettings()
})
