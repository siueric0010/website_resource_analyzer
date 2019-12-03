// openWindow refers to the button inside the window which is opened by pressing the icon on a valid website with "." in its url
let openWindow = document.getElementById('openWindow');
let listOfDomains = document.getElementById('listOfDomains');
let reloadButton = document.getElementById('reload');
let selectUserAgent = document.getElementById('userAgent');
var userAgentDictionary = {
    "iPhone": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",
    "Android": "Mozilla/5.0 (Linux; Android 7.1.2; AFTMM Build/NS6265; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36",
    "Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Linux": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    "MacOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15"

};
// Allow user to reload the list of domains
reloadButton.addEventListener("click", function() {
    chrome.storage.local.get(['info', 'domainCounter'], function (result) {
        var stringList = "List: \n";
        for(domain of result.info) {
            stringList += domain + "\n\n";
        }
        
        listOfDomains.innerText = stringList + "\nDomain Count: " + result.domainCounter;
    });
});



// Allow user to choose UA
selectUserAgent.addEventListener("change", (event) =>{
    var userAgentString = userAgentDictionary[event.target.value];
    chrome.storage.local.set({'userAgentString': userAgentString}, ()=>{});
}, false);




// Check if the tab is the current tab, if so then set the buttontext to be the url
chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
    openWindow.innerText = extractDomain(tabs[0].url);
    chrome.storage.local.get(['info', 'domainCounter'], function (result) {
        var stringList = "List: \n";
        for(domain of result.info) {
            stringList += domain + "\n\n";
        }
        
        listOfDomains.innerText = stringList + "\nDomain Count: " + result.domainCounter;
    });
});

// Grabs the domain + subdomains from URL (after the first // and before the first /)
function extractDomain(url) {
    return url.split("//")[1].split("/")[0];
}
