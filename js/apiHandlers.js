import axios from "axios";
import { ipcMain } from "electron";

ipcMain.handle("auth-post", async (event, username, password) => {
  try {
    const { data, status } = await axios.post(
      "http://localhost:9999/api/auth",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("auth-post ok:", status, data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(
        "auth-post http error:",
        error.response.status,
        error.response.data
      );
      return error.response.data;
    }
    console.error("auth-post request error:", error.message);
    return { success: false, message: error.message };
  }
});

ipcMain.handle("reg-post", async (event, username, password) => {
  try {
    const { data, status } = await axios.post(
      "http://localhost:9999/api/reg",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("reg-post ok:", status, data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(
        "reg-post http error:",
        error.response.status,
        error.response.data
      );
      return error.response.data;
    }
    console.error("reg-post request error:", error.message);
    return { success: false, message: error.message };
  }
});

ipcMain.handle("acc-info", async (event, username, token) => {
  try {
    const { data, status } = await axios.post(
      "http://localhost:9999/api/acc-info",
      { username, token },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("acc-info ok:", status, data)
    return data
  } catch (error) {

    console.error("acc-info error:", error.message)
    return undefined

  }
});

ipcMain.handle("acc-info-by-id", async (event, id) => {
  try {
    const { data, status } = await axios.post(
      "http://localhost:9999/api/acc-info-by-id",
      {id},
      {headers: {"Content-Type": "application/json"}})

      console.log("acc-info-by-id ok:", status, data)

      return data

  } catch (error) {
    console.error("acc-info-by-id error:", error.message)
  }
})

ipcMain.handle("auth-token", async (event, username, token) => {
try {
    const { data, status } = await axios.post(
      "http://localhost:9999/api/auth-token",
      {username, token},
      {headers: {"Content-Type": "application/json"}})

      console.log("auth-token ok:", status, data)

      return data

  } catch (error) {
    console.error("auth-token error:", error.message)
  }
})
