// executes when currently in blocked page
var handleTimeLimitExceed = function(){
	location.replace('http://www.amazon.com');
};





/*	1)  sends a message to seventpage.js to 
add to timer <- check limit: ? continue counting 
 *
 *
*/

// content script
chrome.storage.sync.get('blocked_sites', function(sites){
    console.log(sites['blocked_sites']);
    // check if current tab is in blocked sites
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
		console.log(tabs);
	});		
  //   if(sites['blocked_sites']){
		// chrome.runtime.sendMessage({injectSpecific : true}, function(response) {
	 //  	// Script injected, we can proceed
		//   if(response.done) { console.log('response.done == true!')}
		//   else { console.log('response.done == ERROR!')}
		// });
  //   }
});

//chrome.runtime.sendMessage({todo:"showPageAction"});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
// 	if (request.todo == "showPageAction"){
// 		//retrieves all the tabs
// 		chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
// 			// show page action icon
// 			chrome.pageAction.show(tabs[0].id);
// 		});		
// 	}
// });



