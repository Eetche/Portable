const websitesCreate = document.querySelector(".createWebsite")
const closeWebsitesCreate = document.querySelector(".createWebsite svg")
const newWebsiteBtn = document.querySelector(".newwebsiteButton")

const contentWebsites = document.querySelector("#content")

const createWebsiteInput = document.querySelector(".createWebsite input")

const createWebsiteBtn = document.querySelector(".createWebsite button")

const websitesBlock = document.querySelector(".websites")

const webview = document.querySelector("webview")

newWebsiteBtn.addEventListener('click', () => {
 websitesCreate.style.display = "flex"
})

closeWebsitesCreate.addEventListener('click', () => {
    websitesCreate.style.display = "none"
})

createWebsiteBtn.addEventListener('click', async () => {
    const response = await window.electronAPI.getApps()

    const newWebsiteObj = {
        url: createWebsiteInput.value,
        id: Date.now()
    }

    response.websites.push(newWebsiteObj)

    window.electronAPI.writeApps(response)

    const icon = await window.electronAPI.getURLIcon(newWebsiteObj.url)

    newWebsite(newWebsiteObj.url, newWebsiteObj.id, icon)

    websitesCreate.style.display = "none"
})

  async function deleteApp(appBlock, id) {
    const response = await window.electronAPI.getApps();

    const updatedApps = response.websites.filter((app) => app.id !== id);
    console.log(updatedApps)

    await window.electronAPI.writeApps(updatedApps);
    if (websitesBlock.contains(appBlock)) {
      appBlock.style.opacity = 0;

      setTimeout(() => {
        websitesBlock.removeChild(appBlock);
      }, 150);
    }
  }

function newWebsite(url, id, icon) {
        const appendWebsite = document.createElement('div')
        const appendWebsiteImg = document.createElement('img')
        appendWebsiteImg.src = icon
        appendWebsite.classList.add("website")

        const deleteAppBtn = document.createElement("img");
        deleteAppBtn.classList.add("delete-app");
        deleteAppBtn.src = import.meta.dirname + "/../../media/close.svg";

        appendWebsite.appendChild(appendWebsiteImg)
        appendWebsite.appendChild(deleteAppBtn)
        websitesBlock.appendChild(appendWebsite)


        deleteAppBtn.addEventListener('click', () => {
            deleteApp(deleteAppBtn, id)
        })


        appendWebsite.addEventListener('click', () => {
            contentWebsites.classList.add('active')
            webview.src = url
        })
}

async function restoreWebsites() {
    const apps = await window.electronAPI.getApps()

    apps.websites.forEach(async website => {
        const icon = await window.electronAPI.getURLIcon(website.url)

        newWebsite(website.url, website.id, icon)
    });

}

restoreWebsites()
