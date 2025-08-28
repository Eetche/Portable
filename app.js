const btnNext = document.querySelector("#next"); // Кнопка закрытия таблички
const helloTable = document.querySelector("#helloTable"); // Табличка
const WindowHello = document.querySelector("#window") // Экран при этой табличке

const WindowAll = document.querySelector("#window-all") // Остальной экран помимо экрана таблички

const leftMenu = document.querySelector("#leftMenu") // Меню слева

const filterImage = document.querySelector("#FilterImg") // Картинка меняющая фильтр при наведение мыши

const animationText = document.querySelector("#animationText") // Текст с анимацией // 

const scrollMoments = document.querySelector("#scrollMomentsValue") // Надпись количества скроллов

const clickMoments = document.querySelector("#clickMoments") // Надпись количества кликов

const browserTxt = document.querySelector("#browser") // Надпись с браузером

const msgTxt = document.querySelector("#messageText")
const msgTable = document.querySelector(".message")
const yesBtns = document.querySelector(".message button")

setTimeout(messageVisible, 200000)

function messageVisible() {
    msgTable.style.visibility = 'visible'
    msgTxt.textContent = 'Ну как? Нравится?'
}

yesBtns.addEventListener('click', function() {
    msgTxt.textContent = 'Я так и знал), спасибо.'
    setTimeout(messageHide , 3000)
})

function messageHide() {
    msgTable.style.visibility = 'hidden'
} 



btnNext.addEventListener('click', function () { // Что будет при клике на кнопку закрытия таблички

    helloTable.classList.add('Hidden')
    btnNext.style.cursor = 'default'
    WindowHello.style.opacity = '0%'
    document.body.style.overflowY = 'visible'
    WindowAll.style.visibility = 'visible'
    document.body.style.backgroundColor = 'black'
})

let google = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'
let mozilla = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'
let MicrosoftEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53' // Браузеры в переменных
let Opera = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 OPR/86.0.4363.59'

if (navigator.userAgent = google) {
    browserTxt.textContent = 'Google Chrome'
}
if (navigator.userAgent == mozilla) {
    browserTxt.textContent = 'Mozilla Firefox'
}
if (navigator.userAgent == MicrosoftEdge) {
    browserTxt.textContent = 'Microsoft Edge'
}
if (navigator.userAgent == Opera) {
    browserTxt.textContent = 'Opera'
}

btnNext.addEventListener('mouseover', function () { // Если на кнопку навели присваивается класс
    btnNext.classList.add('animation')
})

btnNext.addEventListener('mouseout', function () { // Если убирается мышь то класс тоже
    btnNext.classList.remove('animation')
})

leftMenu.addEventListener('mouseover', function () { // Навели на меню - позиция left = 0px
    leftMenu.style.left = '0px'
})

leftMenu.addEventListener('mouseout', function () { // Обратное функции выше
    leftMenu.style.left = '-199px'
})

if (helloTable.style.visible = true) { // Если табличка видна то {}
    WindowHello.style.opacity = '50%'
    document.body.style.overflowY = 'hidden'
    WindowAll.style.visibility = 'hidden'
}

filterImage.addEventListener('mouseover', function () { // На картинку наведена мышь
    filterImage.style.width = '700px'
    filterImage.style.height = '600px'
    filterImage.style.top = '250px'
})

filterImage.addEventListener('mouseout', function () { // С картинки убрана мышь
    filterImage.style.top = '300px'
    filterImage.style.width = '650px'
    filterImage.style.height = '550px'
})

let number = 0

animationText.addEventListener('mouseup', function animationText1() { // Что будет при отпуске мыши на элементе {}
    number++ // +1 к переменной
    if (number >= 2) { // Если переменная больше или равно 2 то {}
        // Ничего не делать
    } else { // Иначе
        animationText.style.color = 'red'
        animationText.style.top = '190px'
        animationText.style.opacity = '0%'
        animationText.style.visibility = 'hidden'
        animationText.style.left = '400px'
        setTimeout(animationText2, 1000) // Всё закончилось, через секунду работает функция
    }

})

function animationText2() {
    animationText.textContent = 'Hello'
    animationText.style.top = '200px'
    animationText.style.opacity = '100%'
    animationText.style.visibility = 'visible'
    animationText2 = false
    setTimeout(animationText3, 1000) // Всё закончилось, через секунду работает функция
}

function animationText3() {
    animationText.style.top = '190px'
    animationText.style.opacity = '0%'
    animationText.style.visibility = 'hidden'
    setTimeout(animationText4, 1000) // Всё закончилось, через секунду работает функция
}

function animationText4() {
    animationText.textContent = 'Bonjour'
    animationText.style.opacity = '100%'
    animationText.style.visibility = 'visible'
    setTimeout(animationText5, 1000) // Всё закончилось, через секунду работает функция
}

function animationText5() {
    animationText.style.opacity = '0%'
    animationText.style.top = '200px'
    animationText.style.visibility = 'hidden'
    setTimeout(animationText6, 1000) // Всё закончилось, через секунду работает функция
}

function animationText6() {
    animationText.style.top = '200px'
    animationText.style.left = '300px'
    animationText.textContent = 'Bye'
    animationText.style.opacity = '100%'
    animationText.style.visibility = 'visible'
    animationText.style.color = 'white'
    number = 0 // Присваивается 0 для чтобы незнаю
}

let scrollMomentsValue = 0

window.addEventListener('wheel', function () { // Крутится мышь? Прибавить к тексту 1
    scrollMomentsValue++
    scrollMoments.textContent = scrollMomentsValue
})

let clickMomentsValue = 0

window.addEventListener('mousedown', function () { // Опущена мышь? Прибавить к тексту 1
    clickMomentsValue++
    clickMoments.textContent = clickMomentsValue
})