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

    // If the domain is present, do not count it
    if(requestUrls.includes(urlDomain)) return;
    requestUrls.push(urlDomain);
    domainCounter++;
    // Works: alert('test', details);
    //let listOfDomains = document.getElementById("listOfDomains"); // returns null, must fix
    // listOfDomains.textContent += extractDomain(details.url);
    chrome.storage.local.set({'info': requestUrls});
    if(domainCounter != 0) {
        chrome.storage.local.set({'domainCounter': domainCounter});
    }
} , {urls: [ "<all_urls>" ]},[]);

chrome.tabs.onCreated.addListener(function(tabid, changeinfo, tab) {
    requestUrls = [];
    domainCounter = 0;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(oldUrl !== tab.url) {
        domainCounter = 0;
      oldUrl = tab.url;
    }
  });
// // TODO: create a rule for getting web requests and acting on it
// var rule2 = {
//     conditions: [
//      //   new chrome.declarativeContent.webRequest
//     ]
// }

// Grabs the domain + subdomains from URL (after the first // and before the first /)
function extractDomain(url) {
    return url.split("//")[1].split("/")[0];
}

