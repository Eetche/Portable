const games = document.querySelectorAll(".games .app");

const gamesBlock = document.querySelector(".games");

const websites = document.querySelectorAll(".websites .app");
const webview = document.getElementById("webview");
const contentApps = document.getElementById("content");
const appsBlock = document.querySelector(".apps");

const newgameBtn = document.querySelector(".newgameButton");
const newwebsiteBtn = document.querySelector(".newwebsiteButton");
const createApp = document.querySelector(".createApp");
const createAppBtn = document.querySelector(".createApp button");
const createAppInput = document.querySelector(".createAppInput");

const closeCreateApp = document.querySelector(".createApp svg");

class Apps {
  constructor() {
    this.apps = [];
    this.restoreApps();
  }

  async restoreApps() {
    const response = await window.electronAPI.getApps();
    this.apps = response.apps;

    this.apps.forEach((app) => {
      this.newgame(app.title, app.icon, app.id, app.execute);
    });
  }

  async deleteApp(appBlock, id) {
    const response = await window.electronAPI.getApps();

    const updatedApps = response.apps.filter((app) => app.id !== id);
    this.apps = updatedApps;

    await window.electronAPI.writeApps(updatedApps);
	window.electronAPI.updateUserTasks()
    if (gamesBlock.contains(appBlock)) {
      appBlock.style.opacity = 0;

      setTimeout(() => {
        gamesBlock.removeChild(appBlock);
      }, 150);
    }
  }

  async newgame(title, iconSrc, id, executePath) {
    const appBlock = document.createElement("div");
    appBlock.classList.add("app");

    const appIconBlock = document.createElement("div");
    appIconBlock.classList.add("app-icon");

    const imgBlock = document.createElement("img");
    imgBlock.src = iconSrc;

    const deleteAppBtn = document.createElement("img");
    deleteAppBtn.classList.add("delete-app");
    deleteAppBtn.src = import.meta.dirname + "/../../media/close.svg";

    deleteAppBtn.addEventListener("click", async () => {
      this.deleteApp(appBlock, id);
    });

    imgBlock.addEventListener("click", () => {
      if (executePath) {
        window.electronAPI.openExecute(executePath);
      }
    });

    appBlock.appendChild(appIconBlock);
    appBlock.appendChild(imgBlock);
    appBlock.appendChild(deleteAppBtn);

    gamesBlock.appendChild(appBlock);

	window.electronAPI.updateUserTasks()
  }
}

const appsObj = new Apps();

createAppBtn.addEventListener("click", async () => {
  if (createAppInput.value === "") {
    alert("Please fill in all fields");
    return;
  }

  const res = await window.electronAPI.getDialogPath();

  if (res) {
    const newApp = {
      title: createAppInput.value,
      execute: res.path,
      icon: res.icon,
      id: Date.now(),
    };

    appsObj.apps.push(newApp);

    await window.electronAPI.writeApps(appsObj.apps);

    appsObj.newgame(newApp.title, newApp.icon, newApp.id, newApp.execute);
  }

  createApp.style.display = "none";
});

closeCreateApp.addEventListener("click", () => {
  createApp.style.display = "none";
});

function showContentApps() {
  contentApps.classList.add("active");
  if (appsBlock) appsBlock.style.display = "none";
}

websites.forEach((website) => {
  website.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      switch (website.id) {
        case "youtube":
          webview.src = "https://www.youtube.com";
          break;
        case "twitch":
          webview.src = "https://www.twitch.tv";
          break;
        default:
          break;
      }
      showContentApps();
    } catch (error) {
      console.error("website switch error");
    }
  });
});

games.forEach((game) => {
  game.addEventListener("click", () => {
    try {
      switch (game.id) {
        case "dota2":
          window.electronAPI.openSteamApp(570);
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("error in games switch: " + err);
    }
  });
});

newgameBtn.addEventListener("click", () => {
  createApp.style.display = "flex";
});
