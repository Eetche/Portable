import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempPath = path.resolve(__dirname, "..", "data", "temp.json");
const appsPath = path.resolve(__dirname, "..", "data", "apps.json");

let isWriting = false;

async function writeTabs(tabs) {
  while (isWriting) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  isWriting = true;

  try {
    const data = await fs.promises.readFile(tempPath, "utf8");
    const parsed = JSON.parse(data);
    parsed.tabs = tabs;
    const strData = JSON.stringify(parsed, null, 2);
    await fs.promises.writeFile(tempPath, strData, "utf8");
  } catch (error) {
    console.log("writeTabs error: " + error);
  } finally {
    isWriting = false;
  }
}

async function writeApps(apps) {
  while (isWriting) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  isWriting = true;

  try {
    const data = await fs.promises.readFile(appsPath, "utf8");
    const parsed = JSON.parse(data);
    parsed.apps = apps;
    const strData = JSON.stringify(parsed, null, 2);
    await fs.promises.writeFile(appsPath, strData, "utf8");
  } catch (error) {
    console.log("writeApps error: " + error);
  } finally {
    isWriting = false;
  }
}

async function getApps() {
    try {
        const appsPath = path.resolve(import.meta.dirname, "..", "data", "apps.json")
        const data = await fs.promises.readFile(appsPath, 'utf8')
        const appsObj = JSON.parse(data)
        return appsObj
    } catch (error) {
        console.error("get-games handle error: " + error)
        return { apps: [] }
    }
}

async function getTabs() {
    try {
        const tempPath = path.resolve(import.meta.dirname, "..", "data", "temp.json")
        const data = await fs.promises.readFile(tempPath, 'utf8')
        const tabsObj = JSON.parse(data)
        return tabsObj
    } catch (error) {
        console.error("get-temp-tabs handle error: " + error)
        return { tabs: [] }
    }
}

export { writeTabs, writeApps, getApps, getTabs };
