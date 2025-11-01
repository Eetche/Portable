import { Server } from "socket.io";
import http from "http"

import { config } from "dotenv";
config()

const server = http.createServer()
const io = new Server(server)

const PORT = process.env.PORT || 9999
const HOSTNAME = process.env.HOSTNAME || "localhost"

server.listen(PORT, HOSTNAME, () => {
    console.log(`! socket server is live on ${PORT} port \n`)
})

io.on('connection', (socket) => {
    console.log(`! client connected: ${socket.id} \n`)

    socket.on("disconnect", () => {
        console.log(`! client disconnected: ${socket.id} \n`)
    })

    /* message object
    {
        media : string,
        text : string,
        socketID: string
    }

    */

    socket.on("send_message", (message) => {
        console.log(`
    GETTING MESSAGE

    media: ${message.media},
    text: ${message.text},
    socketID: ${message.socketID}
            `)

        socket.broadcast.emit("server_broadcast_send_message", message)
    })
})
