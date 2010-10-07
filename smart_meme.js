/**
Smart Meme by bigo

released under BSD license.
*/

// thanks Mozilla guys! https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);

    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this && this[from] === elt)
        return from;
    }
    return -1;
  };
}

String.prototype.trim = function () {
    return this.replace(/^\s*/,"").replace(/\s*$/,"");
};

smart_meme = function() {
    var eventHandler, getContent, postContent, clearSelection, _click, _toggle, _getElementByClassName,  _mouseout;
    
    _click = function(elem) {
        var e = elem.srcElement || elem.target;
        _toggle(e);
    }


    eventHandler = function(evt) {
        var elem,old_border, bindable_elements;

        elem = evt.srcElement || evt.target;
        bindable_elements = Array("div", "table", "p", "h1", "h2", "h3", "span", "img", "embed");
        if (bindable_elements.indexOf(elem.nodeName.toLowerCase()) == -1) {
            return true;
        }
        old_border = elem.style.border | "0px"; // TODO: FIXME
        elem.style.border = "2px solid";

        elem.onmouseout = function () { this.style.border = old_border; return true; };
        
        elem.addEventListener("click", _click, true);
    }

    _mouseout = function(elem) {
        //        var e = elem.srcElement || elem.target;
        // e.style.border = 0px;
    };

    _toggle = function(elem) {
        var clazz = elem.className;

        if (clazz.indexOf("smart_meme") != -1) {
            clazz = clazz.replace("smart_meme", "");
        } else {
            clazz = clazz + " smart_meme";
        }
	console.log(elem.className);

        elem.className = clazz.trim();
    }
    
    getContent = function() {
        var matches,i, ret = new Array(), post_type, media;

        matches = _getElementByClassName(document);
        for (i=0; i < matches.length; i++) {
            media = _recursive_search(matches[i], "embed");
            if (media.src !== undefined) { // ok, found an image. Will use it on post
                ret.post_type = "video";
                ret.src = media.src;
            } else {
                media = _recursive_search(matches[i], "img");
                if (media.src !== undefined) { // wuuuU!!! found video!!
                    ret.post_type = "photo";
                    ret.src = media.src;
                }
            }
            ret.push("<blockquote>"+encodeURIComponent(matches[i].innerHTML)+"</blockquote>\n");
            //ret.push(matches[i].innerHTML);
        }
        return ret;
    }
    // bottleneck !!
    _recursive_search = function(root, element_type, old_ret) {
        var ret_obj = {}, i, child;

        if (typeof(old_ret) === "undefined") old_ret = {};
        if (root.childNodes && root.childNodes.length > 0) {
            child = root.childNodes;
            for(i=0; i<child.length; i++) {
                old_ret = _recursive_search(child[i], element_type, old_ret);
            }
        } else {
            if (root.nodeName.toLowerCase() == element_type) {
                ret_obj = { 'post_type' : element_type, 'src' : root.src } 
            }
        }
        if (old_ret.post_type) return old_ret;
        return ret_obj;
    }

    _getElementByClassName = function(root) {
        var all, ret, i, j;

        ret = new Array();
        all = root.getElementsByTagName("*");
        for (i=0; i < all.length; i++) {
            if (all[i].className.indexOf("smart_meme") != -1) {
                ret.push(all[i]);
            }
        }
        return ret;
    }

    clearSelection = function() {
        var matches,i;
        
        matches = _getElementByClassName(document);
        for(i=0; i<matches.length;i++) {
            matches[i].className = matches[i].className.replace("smart_meme","");
        }
        return true;
    }
    
    return {
        // public functions
        eventHandler : eventHandler,
     	getContent : getContent,
        postContent : postContent,
        clearSelection : clearSelection
    }
}();
