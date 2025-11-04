import { Server } from "socket.io";
import http from "http";

import { nanoid } from "nanoid";

import fs from "fs";
import path from "path";

import { config } from "dotenv";
config();

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "POST" && req.url === "/api/auth") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const database = await fs.promises.readFile(
          path.join(__dirname, "db", "db.json"),
          "utf-8"
        );
        const databaseParsed = JSON.parse(database);

        console.log("req data:", data);
        console.log("db users:", databaseParsed.users);

        const user = databaseParsed.users.find(
          (u) => u.username === data.username && u.password === data.password
        );

        console.log("matched user:", user);

        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
            })
          );
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
            })
          );
        }
      } catch (error) {
        console.error("Auth handler error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false }));
      }
    });
  }

  if (req.method === "POST" && req.url === "/api/reg") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const database = await fs.promises.readFile(
          path.join(__dirname, "db", "db.json"),
          "utf-8"
        );
        const databaseParsed = JSON.parse(database);

        console.log("req data:", data);
        console.log("db users:", databaseParsed.users);

        const user = databaseParsed.users.find(
          (u) => u.username === data.username || u.password === data.password
        );

        if (user) {
            console.error("database already has user with same password or login")
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
            })
          );
        } else {
            const newUser = {
                username: data.username,
                password: data.password,
                id: nanoid()
            }

            databaseParsed.users.push(newUser)

            const stringifyDB = JSON.stringify(databaseParsed, null, 2)

            await fs.promises.writeFile(path.join(__dirname, "db", "db.json"), stringifyDB, 'utf8')

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
            })
          );
        }
      } catch (error) {
        console.error("Reg handler error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false }));
      }
    });
  }
});
const io = new Server(server);

const PORT = process.env.PORT || 9999;
const HOSTNAME = process.env.HOSTNAME || "localhost";

server.listen(PORT, HOSTNAME, () => {
  console.log(`! socket server is live on ${HOSTNAME}:${PORT} \n`);
});

io.on("connection", (socket) => {
  console.log(`! client connected: ${socket.id} \n`);

  socket.on("disconnect", () => {
    console.log(`! client disconnected: ${socket.id} \n`);
  });

  /* message object
    {
        media : string,
        text : string,
        socketID : string
    }

    */

  socket.on("send_message", (message) => {
    console.log(`
    GETTING MESSAGE

    media: ${message.media},
    text: ${message.text},
    socketID: ${message.socketID}
            `);

    socket.broadcast.emit("server_broadcast_send_message", message);
  });
});
