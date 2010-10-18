var chromeme_ready = function (callback) {
    var test = setInterval(function () {
        if(document.body) {
            callback();
            clearInterval(test);
        }
    }, 3);
};

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        var listener = function () {
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
                
            } else if (request.cmd =="bind"){ 
                document.body.addEventListener("mousemove", move_inspector, true);          
            } else if (request.cmd == "unbind") {
                smart_meme.clearSelection();
                document.body.removeEventListener("mousemove", move_inspector, true);
            } else {
                sendResponse({}); // snub them.
            }
        };

        chromeme_ready(listener);
    }
);

move_inspector = function(e) { 
    smart_meme.eventHandler(e);
};
