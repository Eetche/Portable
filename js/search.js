const search = document.querySelector(".search")
const input = document.querySelector(".search input")
const searchSvg = document.querySelector(".search svg")

async function find(request) {
    if (request == "") {return}

    window.electronAPI.loadUrl(request);

    console.log(document.textContent)
    
}


search.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        find(input.value)
    }
})

searchSvg.addEventListener("click", () => {
    find(input.value)
})