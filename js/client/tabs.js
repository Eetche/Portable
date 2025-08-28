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

        webviewTabs.addEventListener("page-title-updated", (event) => {

            const tabEl = document.getElementById(this.activeTabId)

            if (tabEl) {
                tabEl.querySelector('span').textContent = event.title
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

        const closeTab = document.createElement('span')

        closeTab.textContent = "+"
        closeTab.classList.add("closeTab")

        tab.classList.add("tab")

        tab.id = id;

        console.log("newtab id:", newtabCl.id)

        tab.addEventListener('click', () => this.gotoTab(newtabCl.id))
        closeTab.addEventListener('click', () => this.closetab(newtabCl.id))

        tabsDiv.append(tab)

        const tabTitle = document.createElement('span')
        tabTitle.classList.add('tabTitle')
        tabTitle.textContent = newtabCl.title

        tab.appendChild(tabTitle)
        tab.appendChild(closeTab)

        if (this.activeTabId) {
            const prevTab = document.getElementById(this.activeTabId)
            prevTab.classList.remove('active')
        }


        this.activeTabId = newtabCl.id
        this.gotoTab(this.activeTabId)
        tab.classList.add('active')
        showContentTabs()
    }

    closetab(id) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === id)

        if (tabIndex !== -1) {
            this.tabs.splice(tabIndex, 1)
        }

        const tabEl = document.getElementById(id)
        if (tabEl) {
            tabEl.remove()
        }

        if (this.activeTabId === id) {
            this.activeTabId = null
            contentTabs.classList.remove('active')
        }
    }

    gotoTab(id) {
        const tab = this.tabs.find(tab => tab.id === id)


        this.activeTabId = id


        webviewTabs.src = tab.src
        contentTabs.classList.add('active')


        const tabsAll = document.querySelectorAll(".tab")

        tabsAll.forEach((tabEl) => {
            if (tabEl.id == this.activeTabId) {
                tabEl.classList.add('active')
            } else {
                tabEl.classList.remove('active')
            }
        })

        showContentTabs()
    }
}


const tabs = new Tabs()

tabs.newtab()

newtabButton.addEventListener('click', () => {
    tabs.newtab();
})
