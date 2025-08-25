const webviewS = document.getElementById('webview');
const content = document.getElementById('content');
const apps = document.querySelector('.apps');

const addressInput = document.getElementById('address');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const homeBtn = document.getElementById('homeBtn');

function showHome() {
	content.classList.remove('active');
	if (apps) apps.style.display = '';
    addressInput.value = '';
	webviewS.src = ""
}

function showContentAddress() {
	content.classList.add('active');
	if (apps) apps.style.display = 'none';
}

function normalizeToUrl(text) {
	let s = text.trim();
	if (!s) return null;
	const hasScheme = /^\w+:\/\//i.test(s);
	const looksLikeDomain = /\./.test(s) && !/\s/.test(s);
	if (!hasScheme) {
		if (looksLikeDomain) return 'https://' + s;
		return 'https://www.google.com/search?q=' + encodeURIComponent(s);
	}
	return s;
}

function navigate(raw) {
	const url = normalizeToUrl(raw);
	if (!url) return;
	webviewS.src = url;
	showContent();
}

addressInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
        console.log("search")
        navigate(addressInput.value)
    }
});

backBtn.addEventListener('click', () => {
	if (webviewS.navigationHistory.canGoBack()) webviewS.goBack();
});
forwardBtn.addEventListener('click', () => {
	if (webviewS.navigationHistory.canGoForward()) webviewS.goForward();
});
reloadBtn.addEventListener('click', () => {
	webviewS.reload();
});
homeBtn.addEventListener('click', () => {
	showHome()
});

webviewS.addEventListener('did-navigate', (e) => {
	addressInput.value = e.url || '';
});
webviewS.addEventListener('did-navigate-in-page', (e) => {
	addressInput.value = e.url || '';
});
webviewS.addEventListener('will-navigate', (e) => {
	addressInput.value = e.url || '';
});
