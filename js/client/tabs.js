const tabsDiv = document.querySelector(".tabs")
const contentTabs = document.querySelector("#content")
const newtabButton = document.querySelector(".newtab")

const webviewTabs = document.getElementById("webview")

function showContent() {
	contentTabs.classList.add('active');
}

class Tab {
    constructor(title, id) {
        this.title = title
        this.id = id
        this.src = "https://www.youtube.com"
    }
}

class Tabs {
    constructor() {
        this.tabs = []
        this.count = 0
    }
    
    newtab() {
        
        const newtabCl = new Tab("New tab", this.count)
        
        this.count += 1;
        
        this.tabs.push(newtabCl)
        const tab = document.createElement('div')
        
        
        tab.className = "tab"
        
        tab.id = this.count;

        tab.textContent = "New tab"

        console.log("newtab id:", newtabCl.id)

        tab.addEventListener('click', () => this.gotoTab(newtabCl.id))

        tabsDiv.append(tab)

    }
    
    closetab(index) {
        this.tabs.splice(index - 1, 1) // delete only index's tab
    }
    
    refreshTabs() {
        
    }

    gotoTab(index) {
        webviewTabs.src = this.tabs[index].src
        showContent()
    }
}


const tabs = new Tabs()

newtabButton.addEventListener('click', () => {
    tabs.newtab();
})