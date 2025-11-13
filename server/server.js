import { Server } from "socket.io";
import http from "http";
import express from "express";

import bcrypt from "bcrypt";

import fs from "fs";
import path from "path";

import { config } from "dotenv";
config();

import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js"

// const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db", "db.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/media", express.static(path.join(__dirname, "..", "media")));
app.use("/api", authRoutes)

app.post("/api/acc-info", async (req, res) => {
  const db = await fs.promises.readFile(dbPath, "utf-8");

  const dbParsed = JSON.parse(db);

  const bodyParsed = req.body;

  const user = dbParsed.users.find((u) => bodyParsed.username === u.username);

  const isTokenValid = await bcrypt.compare(bodyParsed.token, user.token);

  if (isTokenValid) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(500);
    res.end(undefined);
  }
});

app.post("/api/acc-info-by-id", async (req, res) => {
  const db = await fs.promises.readFile(dbPath, "utf-8");

  const dbParsed = JSON.parse(db);

  const bodyParsed = req.body;

  const user = dbParsed.users.find((u) => bodyParsed.id == u.id);

  // ONLY PUBLIC INFO

  if (user) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ username: user.username })); // maybe avatar and other acc info
  } else {
    res.writeHead(500);
    res.end(undefined);
  }
});

app.get("/users/:slug", async (req, res) => {
  const slug = req.params.slug;

  const db = await fs.promises.readFile(dbPath, "utf-8");

  const dbParsed = JSON.parse(db);

  const user = dbParsed.users.find((u) => u.username == slug);

  if (user) {
    const profile = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.username} profile</title>
</head>
<body>
    <div class="container">
      <div class"header">
        <h1>Профиль пользователя</h1>
        <img
          src=${user.avatar || ""}
          alt="Аватар пользователя"
          style={{ borderRadius: '50%', width: '150px', height: '150px', marginBottom: '1rem' }}
        />
        <h2>${user.username || ""}</h2>
        <p>${user.bio || ""}</p>
      </div>
    </div>
</body>
</html>

    `;

    res.end(profile);
  } else {
    const profile = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Don't have this user
</body>
</html>`;

    res.end(profile);
  }
});



const server = http.createServer(app);
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
