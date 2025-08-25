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
					showContentApps();
					webview.src = "https://www.youtube.com";
					break;
				default:
					break;
			}
		} catch (error) {
			console.error("website switch error")
		}
	});
});
