// Пример использования CSS методов через electronAPI

// Функция для внедрения кастомного CSS
async function injectCustomCSS() {
    const customCSS = `
        /* Кастомные стили для любой страницы */
        body {
            font-family: 'Arial', sans-serif !important;
        }
        
        /* Подсветка ссылок */
        a {
            color: #ff6b6b !important;
            text-decoration: underline !important;
        }
        
        a:hover {
            color: #ee5a52 !important;
            text-decoration: none !important;
        }
        
        /* Кастомные кнопки */
        button {
            background: linear-gradient(45deg, #667eea, #764ba2) !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        
        button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
        }
    `
    
    try {
        const key = await window.electronAPI.injectCSS(customCSS)
        if (key) {
            console.log("Кастомный CSS внедрен с ключом:", key)
            // Сохраняем ключ для возможного удаления позже
            window.customCSSKey = key
        }
    } catch (error) {
        console.error("Ошибка при внедрении CSS:", error)
    }
}

// Функция для удаления внедренного CSS
async function removeCustomCSS() {
    if (window.customCSSKey) {
        try {
            const success = await window.electronAPI.removeCSS(window.customCSSKey)
            if (success) {
                console.log("CSS успешно удален")
                window.customCSSKey = null
            }
        } catch (error) {
            console.error("Ошибка при удалении CSS:", error)
        }
    }
}

// Функция для получения информации о текущей странице
async function getCurrentPageInfo() {
    try {
        const pageInfo = await window.electronAPI.getPageInfo()
        if (pageInfo) {
            console.log("Текущая страница:", pageInfo.title)
            console.log("URL:", pageInfo.url)
        }
    } catch (error) {
        console.error("Ошибка при получении информации о странице:", error)
    }
}

// Экспортируем функции для использования в других скриптах
window.cssManager = {
    inject: injectCustomCSS,
    remove: removeCustomCSS,
    getPageInfo: getCurrentPageInfo
}

// Автоматически внедряем CSS при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log("Renderer скрипт загружен")
    // Можно добавить автоматическое внедрение CSS здесь
})
