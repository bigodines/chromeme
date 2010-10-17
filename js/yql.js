mc.yql = {
    query: function (query, ajax_obj) {
        var ajax_obj = ajax_obj || {};
        ajax_obj.format = ajax_obj.format || "json";
        
        if (!query) {
            throw ("Bad Request");
        }

        ajax_obj.url = encodeURI("http://query.yahooapis.com/v1/public/yql?q="+query+"&format="+ajax_obj.format);
        
        create_func = function (name) {
            ajax_obj[name] = ajax_obj[name] || function (res) {
                if (console) {
                    console.log(res);
                }
            }
        }

        create_func("success");
        create_func("error");

        $.ajax(ajax_obj);
    }   
}
