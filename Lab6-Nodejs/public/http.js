function httpGetAsync(theUrl, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("GET", theUrl, true);
    request.send(null);
}

function httpPostAsync(url,body,callback){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (req.readyState == 4 && req.status == 200){
            callback(req.responseText);
        }
    }
    req.open("POST",url,true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(body);
}
