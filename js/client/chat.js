const socket = io("http://localhost:9999")

window.onload = async () => {
    if (!localStorage.getItem("account")) {
        window.location.href = "auth.html"
    }
}

let isConnected = false;

socket.on("connect", () => {
    isConnected = true;
    console.log("! client connected: " + socket.id)

})
socket.on("server_broadcast_send_message", (message) => {
    SocketListeners.getMessage(message.userID, undefined, message.text, message.media)
})

const button = document.querySelector("button")
const input = document.querySelector("input")
const content = document.querySelector(".content")

class DataSender {

    static async sendMessage(text, mediaDataURL) {
        if (!text) return

        input.value = ""

        const account = JSON.parse(localStorage.getItem("account"));

        const authResponse = await window.electronAPI.authPOST(account.username, account.password)

        const accountInfo = await window.electronAPI.accInfoPOST(account.username, account.password)

        console.log(accountInfo)

        if (authResponse.success) {
            socket.emit("send_message", {
                media: mediaDataURL,
                text: text,
                userID: accountInfo.id
            })

            createMessage(account.username, undefined, undefined, text, true)
        } else {
            return // creating error message
        }

    }
}

class SocketListeners {
    static async getMessage(senderID, group, text, mediaDataURL) {
        const user = await window.electronAPI.accInfoByIdPOST(senderID)

        createMessage(user.username, undefined, mediaDataURL, text, false)

        console.log(text)
    }
}

function createMessage(author, avatar, media, text, my) {
    const message = document.createElement("div")
    message.classList.add("message")

    if (my) {
        message.classList.add("my")
    }

    const authorUsername = document.createElement("span")

    authorUsername.textContent = author


    const messageText = document.createElement("p")
    messageText.textContent = text

    if (media) {
        const messageMedia = document.createElement("img")
        messageMedia.classList.add("messageMedia")
        messageMedia.src = media
        message.appendChild(messageMedia)
    }

    content.appendChild(message)
    message.appendChild(authorUsername)
    message.appendChild(messageText)

}

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        DataSender.sendMessage(input.value, undefined)
    }
})

button.addEventListener('click', () => {
    (isConnected) ? undefined : () => {return}

    DataSender.sendMessage(input.value, undefined)
})
