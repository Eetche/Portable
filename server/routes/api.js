import express from "express"

import fs from "fs"
import { nanoid } from "nanoid";
import bcrypt from "bcrypt"
import path from 'path'
import { fileURLToPath } from "url";

import serverConfig from "../../js/client/serverConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "db", "db.json");

const router = express.Router()

router.post("/auth", async (req, res) => {
  try {
    const data = req.body;
    const database = await fs.promises.readFile(dbPath, "utf-8");
    const databaseParsed = JSON.parse(database);

    const user = databaseParsed.users.find((u) => u.username === data.username);

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (isPasswordValid) {
      const refreshedToken = nanoid(14);
      const refreshedHashedToken = await bcrypt.hash(refreshedToken, 12);

      user.token = refreshedHashedToken;

      res.cookie("token", refreshedToken)
      res.cookie("username", data.username)

      await fs.promises.writeFile(
        dbPath,
        JSON.stringify(databaseParsed, null, 2)
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          token: refreshedToken,
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

router.post("/reg", async (req, res) => {
  try {
    const data = req.body;
    const database = await fs.promises.readFile(dbPath, "utf-8");
    const databaseParsed = JSON.parse(database);

    const user = databaseParsed.users.find(
      (u) => u.username === data.username || u.password === data.password
    );

    if (user) {
      console.error("database already has user with same password or login");
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
        })
      );
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const token = nanoid(14)
      const hashedToken = await bcrypt.hash(token, 12);

      res.cookie("token", token)
      res.cookie("username", data.username)

      const newUser = {
        username: data.username,
        password: hashedPassword,
        token: hashedToken,
        avatar: `http://${serverConfig.hostname}:${serverConfig.port}/media/people.png`,
        id: nanoid(10),
      };

      databaseParsed.users.push(newUser);

      const stringifyDB = JSON.stringify(databaseParsed, null, 2);

      await fs.promises.writeFile(dbPath, stringifyDB, "utf8");

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

router.post("/auth-token", async (req, res) => {
  const database = await fs.promises.readFile(dbPath, "utf-8");

  const dbParsed = JSON.parse(database);

  const user = dbParsed.users.find((u) => req.body.username === u.username);

  if (!user) {
    res.writeHead(500, {"content-type": "application/json"})
    res.end("unknown user")
  }

  const isTokenValid = await bcrypt.compare(req.body.token, user.token);

  if (isTokenValid) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
      })
    );
  } else {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
      })
    );
  }
});

router.post("/change-account-data", async (req, res) => {
  console.log(req.body)

  if (!req.body.token || !req.body.username) {
    res.end("have no required data")
  }

  const database = await fs.promises.readFile(dbPath, 'utf-8');
  const dbParsed = JSON.parse(database)

  /* MUST BE FILLED

  token, required
  username, required
  newUsername,
  newPassword,
  newBio,
  newAvatar

  */

  const user = dbParsed.users.find((u) => decodeURI(req.body.username) === decodeURI(u.username))

  if (!user) {
    console.log("change-account-data: don't have user")
    return
  }

  const isTokenValid = await bcrypt.compare(req.body.token, user.token)

  if (!isTokenValid) {
    res.end("invalid token")
  }

  user.username = req.body.newUsername || "<blank>";
  user.password = req.body.newPassword || user.password;
  user.bio = req.body.newBio;
  user.avatar = req.body.newAvatar || "/media/people.png"

  await fs.promises.writeFile(dbPath, JSON.stringify(dbParsed, null , 2), 'utf-8')

  res.writeHead(200, {"content-type": "application/json"})
  res.end(JSON.stringify({
    success: true
  }))

})

router.post("/upload-avatar", async (req, res) => {
  try {  
      const file = req.body.avatar
    
      const buffer = await file.arrayBuffer()
    
      const bytes = new Uint8Array(buffer)
    
      const filePath = path.join(__dirname, "..", "uploads", file.name)
    
      await fs.promises.writeFile(filePath, Buffer.from(bytes))

      res.writeHead(200, "application/json")
      res.end(JSON.stringify({
        success: true
      }))
  } catch (error) {
      res.writeHead(500, "application/json")
      res.end(JSON.stringify({
        success: false
      }))
  }
})

export default router
