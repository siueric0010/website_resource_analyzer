chrome.runtime.onInstalled.addListener(function() {
    alert('Installed/Updated.');
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });
});

// define rule for button to be active
var rule1 = {
    
    // Extension is on (i.e. pressing the icon will show a button w/ the URL, if the URL contains a ".")
    conditions: [

        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostContains: '.'},
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};

var rule2 = {
    conditions: [
     //   new chrome.declarativeContent.webRequest
    ]
}



chrome.webRequest.onBeforeRequest.addListener(function(details) {
    alert('test');
});