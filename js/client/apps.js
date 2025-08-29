const games = document.querySelectorAll(".games .app");
const websites = document.querySelectorAll(".websites .app");
const webview = document.getElementById("webview");
const contentApps = document.getElementById("content");
const appsBlock = document.querySelector(".apps");

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
