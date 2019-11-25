var requestUrls = [];
var domainCounter = 0;
var oldUrl = "";

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
          // Successfully grabs the user-agent value, now I just need to modify this
          // alert(details.requestHeaders[i].value);
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
  });

// Grabs the domain + subdomains from URL (after the first // and before the first /)
function extractDomain(url) {
    return url.split("//")[1].split("/")[0];
}

