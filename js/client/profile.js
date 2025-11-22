const dataChange = document.querySelector(".dataChange")
const settings = document.querySelector(".settings")
const closeSettings = document.querySelector(".closeSettings")

const allValuesContainers = document.querySelectorAll(".valuesContainer")

const allValues = document.querySelectorAll(".value")

const confirmSettings = document.querySelector("button.confirmButton")

window.onload = () => {
    setOptionsListeners()
}


dataChange.addEventListener("click", () => {
    settings.style.opacity = 1
    settings.style.top = "50%"

    settings.style.display = "flex"
})

closeSettings.addEventListener("click", () => {
    settings.style.opacity = 0
    settings.style.top = "-120%"

    setTimeout(() => {
        settings.style.display = "none"
    }, 200)
})

const whichValues = [
    {
        option: "account",
        values: "accountValues"
    }
]

function setOptionsListeners() {
    whichValues.forEach((whichValue) => {
        const option = document.querySelector(`.${whichValue.option}`)
        const values = document.querySelector(`.${whichValue.values}`)
        option.addEventListener("click", () => {
            allValuesContainers.forEach((otherValues) => {
                otherValues.style.display = "none"
            })

            values.style.display = "flex"
        })
    })
}

confirmSettings.addEventListener("click", async () => {
    let newUsername, newPassword, newBio, newAvatar;

    allValues.forEach((input) => {
        switch (input.id) {
            case "usernameValue":
                newUsername = document.getElementById("usernameValue").value
                break;

            case "avatarValue":
                const avatar = document.getElementById("avatarValue").files[0]
                if (avatar) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        newAvatar = e.target.result
                    }
                    reader.readAsDataURL(avatar)
                }

            default:
                break;
        }
    })

    const localStorageAccount = JSON.parse(localStorage.getItem("account"))

    let changeAccountReq = await fetch("/api/change-account-data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            username: localStorageAccount.username,
            token: localStorageAccount.token,

            newUsername: newUsername || "<blank>",
            newPassword: newPassword,
            newBio: newBio,
            newAvatar: newAvatar || "/media/people.png"
        })
    })

    changeAccountReq = await changeAccountReq.json()

    if (changeAccountReq.success) {
        localStorage.setItem("account", JSON.stringify({
            username: newUsername,
            token: localStorageAccount.token
    
        }))
    
        document.cookie = `username=${newUsername}`

    } else {
        console.log("change acccount request is not success")
    }


})
