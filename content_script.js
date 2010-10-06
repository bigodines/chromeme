chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      var content, postUrl, params;
      if (request.cmd == "clear") {
   	  smart_meme.clearSelection();
	  
      } else if (request.cmd == "post") {
	  content = smart_meme.getContent();
	  params = '';
	  if (content.post_type && content.post_type != "text") { 
	      params +="post_type="+content.post_type+"&content="+content.src;
	      params += "&caption="+encodeURIComponent(content.join(''));
	  } else {
	      params += "post_type=text&content="+encodeURIComponent(content.join(''));
	  }
	  url = 'http://www.bigodines.com/meme-php/examples/oAuthExample.php';
	  sendResponse({url:url, 
		      data:params});
	  
      } else {
	  sendResponse({}); // snub them.
      }
  }
);

document.body.onmousemove = function(e) { 
    smart_meme.eventHandler(e);
};
