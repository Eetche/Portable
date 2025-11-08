import { Server } from "socket.io";
import http from "http";
import express from "express"

import { nanoid } from "nanoid";

import fs from "fs";
import path from "path";

import { config } from "dotenv";
config();

import { fileURLToPath } from "url";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/auth", async (req, res) => {

  console.log(req.body)

    try {
      const data = req.body
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

app.post("/api/reg", async (req, res) => {
    try {
      const data = req.body
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

app.post("/api/acc-info", async (req, res) => {
    const db = await fs.promises.readFile(path.join(__dirname, "db", "db.json"), 'utf-8')

    const dbParsed = JSON.parse(db)

    const bodyParsed = req.body

    const user = dbParsed.users.find((u) => bodyParsed.username == u.username && bodyParsed.password == u.password)

    if (user) {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(500)
      res.end(undefined)
    }
  })

app.post("/api/acc-info-by-id", async (req, res) => {
      const db = await fs.promises.readFile(path.join(__dirname, "db", "db.json"), 'utf-8')

      const dbParsed = JSON.parse(db)

      const bodyParsed = req.body

      const user = dbParsed.users.find((u) => bodyParsed.id == u.id)

      console.log("FINDED USER:", user)

      if (user) {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ username: user.username })) // maybe avatar and other acc info
      } else {
        res.writeHead(500)
        res.end(undefined)
      }
    })

const server = http.createServer(app)
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
        userID : string
    }

    */

  socket.on("send_message", (message) => {
    console.log(`
    GETTING MESSAGE

    media: ${message.media},
    text: ${message.text},
    userID: ${message.userID}
            `);

    socket.broadcast.emit("server_broadcast_send_message", message);
  });
});
