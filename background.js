var requestUrls = [];
var domainCounter = 0;
var oldUrl = "";
var userAgentDictionary = {
    "iPhone": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",
    "Android": "Mozilla/5.0 (Linux; Android 7.1.2; AFTMM Build/NS6265; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36",
    "Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Linux": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    "MacOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15"
};
var userAgent = userAgentDictionary['Windows'];

chrome.runtime.onInstalled.addListener(function() {

    // define rule for button to be active
    var rule = {
        // Extension is on (i.e. pressing the icon will show a button w/ the URL, if the URL contains a ".")
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostContains: '.'},
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    };
    
    var userAgentString = userAgentDictionary["iPhone"];
    chrome.storage.local.set({'userAgentString': userAgentString}, ()=>{});


    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
    
});


chrome.webRequest.onCompleted.addListener(function(details) {

    // If the webrequest is just my extension or undefined, do not count it
    if(details.url.includes(chrome.runtime.id) || details.url === null|| details.url === undefined || typeof details === 'undefined') return;

    // Count all the requests and keep track of its domains
    var urlDomain = extractDomain(details.url);

    // Get the https/http 
    var hasHttps = false;
    if(details.url.includes("https"))
        urlDomain = "Https: \n" + urlDomain;
    else
        urlDomain = "Http: \n" + urlDomain;

    // If the domain is present, do not count it
    if(requestUrls.includes(urlDomain)) return;


    requestUrls.push(urlDomain);
    domainCounter++;
    
    // set the array as info so you can communicate with popup.js
    chrome.storage.local.set({'info': requestUrls});
    if(domainCounter != 0) {
        chrome.storage.local.set({'domainCounter': domainCounter});
    }
} , {urls: [ "<all_urls>" ]},[]);

// before sending headers, change user agent

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    for (var i = 0; i < details.requestHeaders.length; i++) {
        if (details.requestHeaders[i].name === 'User-Agent') {
            var temp = userAgent;

            // Changes the user agent according to the userAgentString in the popup
            details.requestHeaders[i].value = temp;
            
        }
      }
      return { requestHeaders: details.requestHeaders };

      // Blocking allows you to return the headers but modified
      // requestHeaders allows you to get the requestHeaders before they're sent
} , {urls: [ "<all_urls>" ]},['blocking', 'requestHeaders']);





// Resets on new tab
chrome.tabs.onCreated.addListener(function(tabid, changeinfo, tab) {
    requestUrls = [];
    domainCounter = 0;
});

// Resets on tab update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(oldUrl !== tab.url) {
        requestUrls = [];
        domainCounter = 0;
        oldUrl = tab.url;
        chrome.storage.local.set({'domainCounter': domainCounter});
        chrome.storage.local.set({'info': requestUrls});
    }
    
    chrome.storage.local.get('userAgentString', (result) => {
        userAgent = result.userAgentString; //result.userAgentString;
    });
  });

// Grabs the domain + subdomains from URL (after the first // and before the first /)
function extractDomain(url) {
    return url.split("//")[1].split("/")[0];
}

