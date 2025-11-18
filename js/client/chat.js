import serverConfig from "./serverConfig.js";

const socket = io(`http://${serverConfig.hostname}:${serverConfig.port}`);

window.onload = async () => {
  if (!localStorage.getItem("account")) {
    window.location.href = "/auth";
  }
};

let isConnected = false;

socket.on("connect", () => {
  isConnected = true;
  console.log("! client connected: " + socket.id);
});
socket.on("server_broadcast_send_message", (message) => {
  SocketListeners.getMessage(
    message.userID,
    undefined,
    message.text,
    message.media
  );
});

document.cookie = "username=123"

const button = document.querySelector("button");
const input = document.querySelector("input");
const content = document.querySelector(".content");

class DataSender {
  static async sendMessage(text, mediaDataURL) {
    if (!text) return;

    input.value = "";

    const account = JSON.parse(localStorage.getItem("account"));

    createMessage(account.username, undefined, undefined, text, true);

    const isTokenValid = await fetch(
      `http://${serverConfig.hostname}:${serverConfig.port}/api/auth-token`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          username: account.username,
          token: account.token,
        }),
      }
    )

    if (!account) {
      window.location.href = "/auth";
      return;
    }

    const accountInfo = await fetch(`http://${serverConfig.hostname}:${serverConfig.port}/api/acc-info`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        username: account.username,
        token: account.token
      })
    })

    const accountInfoResponse = await accountInfo.json()

    if (isTokenValid) {
      socket.emit("send_message", {
        media: mediaDataURL,
        text: text,
        userID: accountInfoResponse.id,
      });
    } else {
      window.location.href = "/auth";
      return; // creating error message
    }
  }
}

class SocketListeners {
  static async getMessage(senderID, group, text, mediaDataURL) {
    let user = await fetch(`http://${serverConfig.hostname}:${serverConfig.port}/api/acc-info-by-id`, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({
        id: senderID
      })
    })

    user = await user.json()

    createMessage(user.username, user.avatar, mediaDataURL, text, false);
  }
}

function createMessage(author, avatar, media, text, my) {
  const message = document.createElement("div");
  message.classList.add("message");

  if (my) {
    message.classList.add("my");
  }

  const authorUsername = document.createElement("span");

  authorUsername.textContent = author;

  const messageText = document.createElement("p");
  messageText.textContent = text;

  if (media) {
    const messageMedia = document.createElement("img");
    messageMedia.classList.add("messageMedia");
    messageMedia.src = media;
    message.appendChild(messageMedia);
  }

  content.appendChild(message);
  message.appendChild(authorUsername);
  message.appendChild(messageText);
}

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    DataSender.sendMessage(input.value, undefined);
  }
});

button.addEventListener("click", () => {
  isConnected
    ? undefined
    : () => {
        return;
      };

  DataSender.sendMessage(input.value, undefined);
});
