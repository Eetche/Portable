const authForm = document.querySelector(".authForm form")
const loginField = document.getElementById("login")
const passwordField =  document.getElementById("password")

authForm.addEventListener('submit', async (event) => {
    event.preventDefault()


    const response = await window.electronAPI.authPOST(loginField.value, passwordField.value)

    if (response.success) {
        localStorage.setItem("authorized", true)
        localStorage.setItem("account", JSON.stringify({
            "username": loginField.value,
            "password": passwordField.value
        }))
        window.location.href = "chat.html"
    } else {
        alert("Неправильный логин или пароль")
    }
})
