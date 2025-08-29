const tabsDiv = document.querySelector(".tabs")
const contentTabs = document.querySelector("#content")
const newtabButton = document.querySelector(".newtab")

const webviewTabs = document.getElementById("webview")

function showContentTabs() {
	contentTabs.classList.add('active');
}

class Tab {
    constructor(title, id, src) {
        this.title = title
        this.id = id
        this.src = src
    }
}

class Tabs {
    constructor() {
        this.tabs = []
        this.cacheTabs = []

        this.count = 0
        this.activeTabId = null

        this.setupWebviewListeners()

        this.restoreTempTabs()

    }

    createTab(title, id) {
        const tab = document.createElement('div')

        const closeTab = document.createElement('span')

        closeTab.textContent = "+"
        closeTab.classList.add("closeTab")

        tab.classList.add("tab")

        tab.id = id;

        tab.addEventListener('click', () => this.gotoTab(id))
        closeTab.addEventListener('click', () => this.closetab(id))

        tabsDiv.append(tab)

        const tabTitle = document.createElement('span')
        tabTitle.classList.add('tabTitle')
        tabTitle.textContent = title

        tab.appendChild(tabTitle)
        tab.appendChild(closeTab)

    }

    async restoreTempTabs() {
        const tabsData = await window.electronAPI.getTempTabs()

        this.tabs = tabsData.tabs

        tabsData.tabs.forEach((tab) => {
            this.createTab(tab.title, tab.id)
        })
    }

    setupWebviewListeners() {

        webviewTabs.addEventListener("page-title-updated", (event) => {

            const tabEl = document.getElementById(this.activeTabId)

            this.tabs.forEach((tab) => {
                if (tab.id == this.activeTabId) {
                    tab.title = event.title
                }
            })


            if (tabEl) {
                tabEl.querySelector('span').textContent = event.title
            }

            window.electronAPI.writeTabs(this.tabs)

        })

        webviewTabs.addEventListener('did-navigate', async (event) => {

            this.tabs.forEach((tab) => {
                if (tab.id == this.activeTabId) {
                    tab.src = event.url
                }
            })

            window.electronAPI.writeTabs(this.tabs)
        })

        webviewTabs.addEventListener('did-navigate-in-page', (event) => {
            this.tabs.forEach((tab) => {
                if (tab.id == this.activeTabId) {
                    tab.src = event.url
                }
            })

            window.electronAPI.writeTabs(this.tabs)
        })
    }

    newtab() {


        const id = this.count
        const newtabCl = new Tab("New tab", id, "https://www.google.com")

        this.count += 1;

        console.log(this.tabs)

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
            if (prevTab) {
                prevTab.classList.remove('active')
            }
        }

        function getThisTabObject() {
            return {id: newtabCl.id, src: newtabCl.src, title: newtabCl.title}
        }

        // caching tabs

        console.log(this.tabs)

        window.electronAPI.writeTabs(this.tabs)

        //


        this.activeTabId = newtabCl.id
        this.gotoTab(this.activeTabId)
        tab.classList.add('active')
        showContentTabs()
    }

    closetab(id) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === id)

        if (tabIndex !== -1) {
            this.tabs.splice(tabIndex, 1)
            window.electronAPI.writeTabs(this.tabs)
        }

        const tabEl = document.getElementById(id)
        if (tabEl) {
            webviewTabs.src = "https://www.google.com"
            tabEl.remove()
        }

        if (this.activeTabId === id) {
            this.activeTabId = null
            contentTabs.classList.remove('active')
        }
    }

    gotoTab(id) {
        const tab = this.tabs.find(tab => tab.id === id)

        if (!tab) {
            console.error(`tab with id: ${id} is not defined`)
            return
        }


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

newtabButton.addEventListener('click', () => {
    tabs.newtab();
})
