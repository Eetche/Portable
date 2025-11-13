import express from "express"

import fs from "fs"
import { nanoid } from "nanoid";
import bcrypt from "bcrypt"
import path from 'path'
import { fileURLToPath } from "url";

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
      const hashedToken = await bcrypt.hash(nanoid(14), 12);

      const newUser = {
        username: data.username,
        password: hashedPassword,
        token: hashedToken,
        avatar: path.join(__dirname, "..", "media", ""),
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

  console.log(req.body);

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

export default router
