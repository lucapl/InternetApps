function get(url){   
    return new Promise(function(resolve,reject){
        var request = new XMLHttpRequest();
        request.open("GET", theUrl, true);
        request.onload = function(){
            if (request.status === 200) {
                resolve(request.responseText);
            } else {
                reject({ status: request.status, statusText: request.statusText });
            }
        };

        request.onerror = function(){
            reject({ status: request.status, statusText: request.statusText });
        }

        request.send();
    });
}