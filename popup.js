let openWindow = document.getElementById('openWindow');

chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
    openWindow.innerText = tabs[0].url
});