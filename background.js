chrome.runtime.onInstalled.addListener(function() {
    alert('Installed/Updated.');


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
    // Works: alert('test', details);
    let listOfDomains = document.getElementById("listOfDomains"); // returns null, must fix
    // listOfDomains.textContent += extractDomain(details.url);
} , {urls: [ "<all_urls>" ]},[]);


// // TODO: create a rule for getting web requests and acting on it
// var rule2 = {
//     conditions: [
//      //   new chrome.declarativeContent.webRequest
//     ]
// }

