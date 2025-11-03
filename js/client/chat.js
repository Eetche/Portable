import getCookie from "./cookies.js"
import socket from "./socket.js"

window.onload = () => {
    if (!getCookie("authorized")) {
        window.location.href = "auth.html"
    }
}

let isConnected = false;

socket.on("connect", () => {
    isConnected = true;
    console.log("! client connected: " + socket.id)
    
})
socket.on("server_broadcast_send_message", (message) => {
    SocketListeners.getMessage(message.socketID, undefined, message.text, message.media)
})

const button = document.querySelector("button")
const input = document.querySelector("input")
const content = document.querySelector(".content")

class DataSender {

    static sendMessage(text, mediaDataURL) {
        if (!text) return

        input.value = ""

        socket.emit("send_message", {
            media: mediaDataURL,
            text: text,
            socketID: socket.id
        })
    }
}

class SocketListeners {
    static getMessage(senderID, group, text, mediaDataURL) {
        createMessage(mediaDataURL, text, false)

        console.log(text)
    }
}

function createMessage(media, text, my) {
    const message = document.createElement("div")
    message.classList.add("message")
    
    if (my) {
        message.classList.add("my")
    }

    
    const messageText = document.createElement("span")
    messageText.textContent = text
    
    if (media) {
        const messageMedia = document.createElement("img")
        messageMedia.classList.add("messageMedia")
        messageMedia.src = media
        message.appendChild(messageMedia)
    }

    content.appendChild(message)
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
