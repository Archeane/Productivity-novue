
// listerner for messages
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
// 	if (request.todo == "showPageAction"){
// 		//retrieves all the tabs
// 		chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
// 			// show page action icon
// 			chrome.pageAction.show(tabs[0].id);
// 		});		
// 	}
// });

console.log('eventPage.js!');
// background script
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if(message.injectSpecific){
//   	console.log('message received eventpage.js!')
//     // var filename = getSpecificFilename(sender.url);
//     // chrome.tabs.executeScript(sender.tab.id, {file: filename}, function() {
//     //   sendResponse({ done: true });
//     // });
//     return true; // Required for async sendResponse()
//   }
// });