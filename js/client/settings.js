const values = document.querySelectorAll(".value input")

values.forEach(async (value) => {

    const customs = await window.electronAPI.getCustoms()

    value.value = customs.customs[value.id]

    console.log(value)

    value.addEventListener('input', () => {
        colors[value.id] = value.value

        window.electronAPI.injectCSS(colors)
    })
})

const colors = {

}
