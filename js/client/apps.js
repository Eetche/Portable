const games = document.querySelectorAll(".games .app");

const gamesBlock = document.querySelector(".games")

const websites = document.querySelectorAll(".websites .app");
const webview = document.getElementById("webview");
const contentApps = document.getElementById("content");
const appsBlock = document.querySelector(".apps");

const newgameBtn = document.querySelector(".newgameButton");
const newwebsiteBtn = document.querySelector(".newwebsiteButton");
const createApp = document.querySelector(".createApp");
const createAppBtn = document.querySelector(".createApp button");
const createAppInput = document.querySelector(".createAppInput");
const createAppInputFile = document.querySelector(".createAppInputFile");


const closeCreateApp = document.querySelector(".createApp svg")


class Apps {
	constructor() {
		this.apps = []

		this.restoreApps()
	}

	createAppBlock(iconSrc) {
		const appBlock = document.createElement('div')
		appBlock.classList.add("app")

		const appIconBlock = document.createElement('div')
		appIconBlock.classList.add("app-icon")

		const imgBlock = document.createElement("img")

		imgBlock.src = iconSrc

		appIconBlock.appendChild(imgBlock)

		appBlock.appendChild(appIconBlock)

		gamesBlock.appendChild(appBlock)
	}

	async restoreApps() {
		const response = await window.electronAPI.getApps()
		this.apps = response.apps

		console.log


		this.apps.forEach((app) => {
			console.log(app.icon)
			this.newgame(app.title, app.icon)
		})
	}

	async newgame(title, iconSrc) {
			const appBlock = document.createElement('div')
			appBlock.classList.add("app")

			const appIconBlock = document.createElement('div')
			appIconBlock.classList.add("app-icon")

			appBlock.appendChild(appIconBlock)

			const imgBlock = document.createElement('img')
			imgBlock.src = iconSrc

			console.log(iconSrc)


			let executeF = ""

			this.apps.forEach((app) => {
				if (app.title == title) {
					executeF = app.execute
				}
			})


			appBlock.addEventListener('click', () => {
				window.electronAPI.openExecute(executeF)
			})



			gamesBlock.appendChild(appBlock)
			appBlock.appendChild(imgBlock)
	}
}

const appsObj = new Apps()


createAppBtn.addEventListener("click", async () => {
	if (createAppInput.value === "") {
		alert("Please fill in all fields");
		return;
	}

	const res = await window.electronAPI.getDialogPath()

	if (res) {


			const newApp = {
				title: createAppInput.value,
				execute: res.path,
				icon: res.icon
			}

			console.log(appsObj)

			appsObj.apps.push(newApp)

			window.electronAPI.writeApps(appsObj.apps);

			appsObj.newgame(newApp.title, res.icon)
	}


	createApp.style.display = "none";
});

closeCreateApp.addEventListener('click', () => {
	createApp.style.display = "none"
})

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
			console.error("website switch error")
		}
	});
});

games.forEach((game) => {
	game.addEventListener('click', () => {
		try {
			switch (game.id) {
				case "dota2":
					window.electronAPI.openSteamApp(570)
					break;

				default:
					break;
			}
		} catch (err) {
			console.error("error in games switch: " + err)
		}
	})
})


newgameBtn.addEventListener("click", () => {
	createApp.style.display = "flex"
})
