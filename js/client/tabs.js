const tabsDiv = document.querySelector(".tabs")
const contentTabs = document.querySelector("#content")
const newtabButton = document.querySelector(".newtab")

const webviewTabs = document.getElementById("webview")

function showContentTabs() {
	contentTabs.classList.add('active');
}

class Tab {
    constructor(title, id) {
        this.title = title
        this.id = id
        this.src = "https://www.google.com"
    }
}

class Tabs {
    constructor() {
        this.tabs = []
        this.count = 0
        this.activeTabId = null

        this.setupWebviewListeners()
    }

    setupWebviewListeners() {
        // webviewTabs.addEventListener("did-finish-load")

        webviewTabs.addEventListener("page-title-updated", (event) => {

            const tabEl = document.getElementById(this.activeTabId)

            if (tabEl) {
                tabEl.textContent = event.title
            }
        })

        webviewTabs.addEventListener('did-navigate', (event) => {
            this.tabs.forEach((tab) => {
                if (tab.id == this.activeTabId) {
                    tab.src = event.url
                }
            })
        })
    }

    newtab() {

        const id = this.count
        const newtabCl = new Tab("New tab", id)

        this.count += 1;

        this.tabs.push(newtabCl)
        const tab = document.createElement('div')

        tab.classList.add("tab")

        tab.id = id;

        tab.textContent = "New tab"

        console.log("newtab id:", newtabCl.id)

        tab.addEventListener('click', () => this.gotoTab(newtabCl.id))

        tabsDiv.append(tab)

    }

    closetab(id) {
        this.tabs.splice(id - 1, 1) // delete only index's tab
    }

    gotoTab(id) {
        this.activeTabId = id
        webviewTabs.src = this.tabs[id].src
        contentTabs.classList.add('active')
        showContentTabs()
    }
}


const tabs = new Tabs()

newtabButton.addEventListener('click', () => {
    tabs.newtab();
})
