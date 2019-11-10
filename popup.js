// openWindow refers to the button inside the window which is opened by pressing the icon on a valid website with "." in its url
let openWindow = document.getElementById('openWindow');

// Check if the tab is the current tab, if so then set the buttontext to be the url
chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
    openWindow.innerText = extractDomain(tabs[0].url);
});

// Grabs the domain + subdomains from URL (after the first // and before the first /)
function extractDomain(url) {
    return url.split("//")[1].split("/")[0];
}

