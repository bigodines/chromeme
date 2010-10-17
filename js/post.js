mc.post = function (posts, out_element) {
    //private
    var create_link, is_dom, create_img, strategy, guids;
    
    //public
    var merge_post_and_info, print;

    var merge_post_and_info = function (posts, memes_info) {
        for (post in posts) {
        }
    }

    is_DOM = function (obj) {
        var tag = obj.tagName;
        try {
            obj.tagName = '';  // read-only for DOM, should throw exception
            obj.tagName = tag; // restore for normal objects
            return false;
        } catch (e) {
            return true;
        }
    }

    create_link = function (url, content) {
        var a = document.createElement("a");
        a.href = url;
        if (typeof content === "string") {
            a.innerHTML = content;
        } else if (content) {
           a.appendChild(content);
        }
        a.onclick = function () { 
            if (chrome && chrome.tabs)
                chrome.tabs.create({url:url}); 
            return false;
        };

        return a;
    }

    set_up_link = function (link_element, url, content) {
        link_element.attr("href", url);
        
        if (content) {
            link_element.html(content);
        }

        link_element.click( function() {
            chrome.tabs.create({url:url}); 
        });
    };

    var create_img = function (src, size_n, url) {
        img = document.createElement("img");
        img.src = post.content;
        img.style.display = "none";
        img.className = "thumb";
        img.onload = function () {
            var h = this.height,
                w = this.width;
            this.height = h/3;
            this.width = w/3;
            this.style.display = "";
        }
        l_img = url ? create_link(post.url, img) : img;
        return l_img;
    }
  
    var strategy = {
        photo: function (post) {
            img = document.createElement("img");
            img.src = post.content;
            img.style.display = "none";
            img.className = "thumb";
            img.onload = function () {
                var h = this.height,
                    w = this.width;
                this.height = h/3;
                this.width = w/3;
                this.style.display = "";
            }
            //l_img = create_link(post.url, img);
            return img;
        },
        text: function (post) {
            span = document.createElement("span");
            span.innerHTML = post.content;
            return span;
        },
        video: function (post) {
            return create_link(post.content,"watch video");
        },
        audio: function (post) {
            return create_link(post.content, "listen music");
        }
    }

    var append_post = function (post) {
        //console.log(post.user_info);

        var tpl = elements.template_post.clone(),
            user_link = tpl.find("a.user_link"),
            user_thumb = tpl.find("img.user_thumb"),
            post_content = tpl.find("a.post_content");

        user_thumb.attr("src", post.user_info.avatar_url.thumb);
        user_thumb.attr("title", post.user_info.title + " ("+post.user_info.name+")");
        
        set_up_link(user_link, post.user_info.url)
        
        set_up_link(post_content, post.url)
        content = $(strategy[post.type](post));
        post_content.prepend(content); 
        
        //caption
        if (post.caption) {
            
            var link_caption = tpl.find("a.post_caption");
            link_caption.html(post.caption);
            set_up_link(link_caption, post.url)
        }

        tpl.show();
        out_element.append(tpl);
    }

    var print_all = function () {
        out_element.html("");
        append_all();
    }

    var append_all = function () {
        mc.users(guids, really_append_all);
    };

    var really_append_all = function (users) {
        //console.log(users);
        jQuery.each(posts, function (index, post) {
            post.user_info = users.get_user(post.guid);
            append_post(post);
        });
    };
        
    // constructor
    (function constructor () {
        var local_guids = "";
        jQuery.each(posts, function (index, post_item) {
            local_guids += "'" + post_item.guid + "', ";
        });

        guids = local_guids.slice(0, local_guids.lastIndexOf(','));
    })();

    return { 
        append_all: append_all,
        print_all: print_all
    };
};


/* ============================================ 
   USERS 
*/
mc.users = function (guids, callback_created) {
    var this_instance;  users_hash = {};
    
    var create_user_hash = function (users0) {
        var new_user_hash = {};
        jQuery.each(users0, function (index, user) {
            new_user_hash["_"+user.guid] = user;
        });

        return new_user_hash;
    };

    var get_user = function (guid) {
        try {
            return users_hash["_"+guid];
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    (function constructor () {
        var callbacks_users = {
            success: function (res, XMLHttpRequest, txtStatus) {     
                if (res.query) {
                    users_hash = create_user_hash(res.query.results.meme);
                    callback_created(this_instance);
                }
            },
            
            error: function (XMLHttpRequest, txtStatus, errorThrown) {
                console.log("status:" + txtStatus);
                console.log("error:" + errorThrown);
                console.log(XMLHttpRequest);
            }
        };

        
        var query = "SELECT * FROM meme.info WHERE owner_guid in ("+guids+")";
        //console.log(query);
        mc.yql.query(query, callbacks_users);
    })();

    this_instance = {get_user: get_user};

    // this object does not return its instance because the creation of the object is assync.
    // the instance is returned in the first argument of the callback function
}
/* vim: set sts=4 sw=4 ts=4 et: */
