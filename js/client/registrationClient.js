const registerForm = document.querySelector(".authForm form")

const loginFieldReg = document.getElementById("login")
const passwordFieldReg = document.getElementById("password")
const confirmPasswordFieldReg = document.getElementById("confirmPassword")

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()


    if (passwordFieldReg.value !== confirmPasswordFieldReg.value) {
        alert("Пароли не совпадают")

        return;
    }

    const response = await window.electronAPI.regPOST(loginFieldReg.value, passwordFieldReg.value)

    if (response.success) {
        window.location.href = "auth.html"
    }

})``
