
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
function consoleLogImage(message){
  chrome.devtools.inspectedWindow.eval(
      'console.log("Large image: " + unescape("' +
      escape(message) + '"))');

}
function consoleLog(message) {
  chrome.devtools.inspectedWindow.eval(
      'console.log("'+ message + '")'); // Requires the extra double quotes b/c we are evaluating as if it were written in the code.
}


chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    const response = request.response;
    const contentHeader = response.headers.find(header=> header.name === 'Content-Type');
    consoleLog(contentHeader.value);

    if (request.response.bodySize > 3*1024) {
      consoleLogImage(request.request.url);
    }
});