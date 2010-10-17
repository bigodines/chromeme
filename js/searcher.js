mc.searcher = function (elements) {
    var search, callbacks, YQL;
 
    // Callback function for handling response data  
    callbacks = {
        success: function (res, XMLHttpRequest, txtStatus) {     
            elements.img_loader.hide();
            if (res.query) {
                post = mc.post(res.query.results.post, elements.div_content);
                post.print_all();
            }
        },
        
        error: function (XMLHttpRequest, txtStatus, errorThrown) {
            console.log("status:" + txtStatus);
            console.log("error:" + errorThrown);
        }
    },
    
    search = function () {
        var query = elements.i_query.val();
        elements.img_loader.show();
        mc.yql.query("SELECT * FROM meme.search WHERE query='"+query+"'", callbacks);
    }

    return {
        search: search
    }
};
