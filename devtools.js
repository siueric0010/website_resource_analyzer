
/*chrome.devtools.network.getHAR(function(harLog) {
  
  chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
      const response = request.response;
      const contentHeader = response.headers.find(header=> header.name === 'Content-Type');
      consoleLog(contentHeader.value);

      if (request.response.bodySize > 3*1024) {
        consoleLogImage(request.request.url);
      }
  });
  // chrome.devtools.network.onRequestFinished.addListener(
  //     function(request) {
  //       const response = request.response;
  //       const contentHeader = response.headers.find(header=> header.name === 'Content-Type');
  //       alert("Request.response.url: " + harLog.request.response.url);
  
  //       if (request.response.bodySize > 3*1024) {
  //         chrome.devtools.inspectedWindow.eval(
  //             'console.log("Large image: " + unescape("' +
  //             escape(request.request.url) + '"))');
  //       }
  // });
});*/
var count = 0;
var httpsCount = 0;
var oldUrl = "";
function consoleLogImage(message){
  chrome.devtools.inspectedWindow.eval(
      'console.log("Image: " + unescape("' +
      escape(message) + '"))');

}
function consoleLog(message) {
  chrome.devtools.inspectedWindow.eval(
      'console.log("'+ message + '")'); // Requires the extra double quotes b/c we are evaluating as if it were written in the code.
}


// Some bug: google has an extra resource -> why?
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    const response = request.response;
    const contentHeader = response.headers.find(header=> header.name === 'Content-Type');
    const requestUrl = request.request.url;
    if(contentHeader) {
      consoleLog(contentHeader.value);
    }
    if(requestUrl.includes('https')) {
      httpsCount++;
    }
    count++;
    consoleLog("Resource_Count: " + count);
    consoleLog("Https_Count: " + httpsCount);
});

// TODO reset count
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // This keeps on adding more youtube tabs --> crashes chrome
  // if(tab.url !== "https://www.youtube.com") {
  //   chrome.tabs.create({"url": "https://www.youtube.com"}, function(tab) {
  //   });
  // }
  if(oldUrl !== tab.url) {
    httpsCount = 0;
    count = 0;
    oldUrl = tab.url;
  }
});
