import { ipcMain, session } from "electron";

ipcMain.handle("get-cookie", (event, url) => {
    try {
        return session.defaultSession.cookies.get(url)
    } catch (error) {
        console.error("cookies handlers error: " + error)
    }
})

ipcMain.handle("set-cookie", async (event, data) => {
  try {
    await session.defaultSession.cookies.set(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
})
