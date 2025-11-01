const socket = io("http://localhost:9999")

let isConnected = false;

socket.on("connect", () => {
    isConnected = true;
    console.log("! client connected: " + socket.id)

})
socket.on("server_broadcast_send_message", (message) => {
    SocketListeners.getMessage(message.socketID, undefined, message.text, message.media)
})

const button = document.querySelector("button")

class DataSender {

    static sendMessage(text, mediaDataURL) {
        socket.emit("send_message", {
            media: mediaDataURL,
            text: text,
            socketID: socket.id
        })
    }
}

class SocketListeners {
    static getMessage(senderID, group, text, mediaDataURL) {
        const message = document.createElement("p")
        message.textContent = text
        document.body.appendChild(message)

        console.log(text)
    }
}

button.addEventListener('click', () => {
    (isConnected) ? undefined : () => {return}

    DataSender.sendMessage("hello guys", undefined)
})
