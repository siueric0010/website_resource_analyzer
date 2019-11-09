chrome.runtime.onInstalled.addListener(function() {
    alert('Installed.');
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });
});

// define rule for button to be active
var rule1 = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostContains: '.'},
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};
