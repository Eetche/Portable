const dataChange = document.querySelector(".dataChange")
const settings = document.querySelector(".settings")
const closeSettings = document.querySelector(".closeSettings")


dataChange.addEventListener("click", () => {
    settings.style.opacity = 1
    settings.style.top = "50%"

    settings.style.display = "flex"
})

closeSettings.addEventListener("click", () => {
    settings.style.opacity = 0
    settings.style.top = "-120%"

    setTimeout(() => {
        settings.style.display = "none"
    }, 200)
})

const whichValues = [
    {
        option: "account",
        values: "accountValues"
    }
]

function setOptionsListeners() {
    whichValues.forEach((whichValue) => {
        const option = document.querySelector(`.${whichValue.option}`)
        option.addEventListener("click", () => {

        })
    })
}
