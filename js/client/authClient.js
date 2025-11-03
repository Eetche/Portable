const authForm = document.querySelector(".authForm form")
const loginField = document.getElementById("login")
const passwordField =  document.getElementById("password")

authForm.addEventListener('submit', async (event) => {
    event.preventDefault()


    const response = await window.electronAPI.authPOST(loginField.value, passwordField.value)

    if (response.success) {
        document.cookie = "authorized=true"
        window.location.href = "chat.html"
    } else {
        alert("Неправильный логин или пароль")
    }
})