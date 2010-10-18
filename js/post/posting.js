chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null,
                           {file:"content_script.js",
                            allFrames: true}
                           );
   // attempt to fix 'smart_meme is not defined bug.'
   chrome.tabs.executeScript(null,
                           {file:"smart_meme.js",
                            allFrames: true}
                           );
    chrome.browserAction.setPopup({popup:"popup.html"});
});

// bind, unbind and clear are simple commands
function simple_command(command) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {cmd: command});
    });
    notifications().set_item(0, new Date().getTime());
}

function post() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {cmd: "post"}, function(response) {
          if (!response.url) return false;
          try {
              makeRequest({url: response.url, data: response.data, callback: function() {
                                    chrome.tabs.create({'url': response.url, 'selected': true});
                                    return true;
                                }
                         });
	  } catch (e) {
	      alert(e);
	  }
        });
    });
    notifications().set_item(0, new Date().getTime());
}


/**
    ajax galponero
*/

var makeRequest = function(args) { 
    var url, data, method, callback;
	//console.log(args);
    url = args.url;
    data = args.data;
    method = args.method || "POST";
    callback = args.callback;

    var method = 'POST', req;

    if (arguments.length > 2) {
        method = arguments[2];
    }

    req = new XMLHttpRequest();
    req.open(method, url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.send(data);

    req.onreadystatechange = function(evt) { 
	if (req.readyState === 4) {
	    if (req.status === 200) {
            callback();
	    } else {
      		alert("oops... didnt work as expected. thank god its not in production");// fuuuuu
	    }
	}
    };
};


var notifications = function() {
    var check, set_item, get_item, clear;

    set_item = function (key, value) { 
        try {
            window.localStorage.removeItem(key);
            window.localStorage.setItem(key, value);
        } catch(e) {
            console.log("FUUUUUUUUUUUUU");
            console.log(e);
        }
        return true;
    };

    get_item = function (key) { 
        var value;
        try {
            value = window.localStorage.getItem(key);
        } catch(e) {
            console.log("Fu Fu Fu Fu Fu Fu");
            console.log(e);
        }
        return value;
    };

    clear = function () { 
        window.localStorage.clear();
    }; 

    check = function() { 
        console.log('not implemented yet');
    };
 
    return { 
        "set_item" : set_item,
        "get_item" : get_item,
        "check" : check,
        "clear" : clear
    };
}


notifications().set_item(0, new Date().getTime());
console.log(notifications().get_item(0));

// check for updates!!
//setInterval("notifications().check()", 1000*60*3); // every 3 minutes 