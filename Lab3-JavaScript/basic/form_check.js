function isEmpty(param){
    return param.length == 0;
}

function isWhiteSpace(str) {
    var ws = "\t\n\r ";
    for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (ws.indexOf(c) == -1) {
    return false;
    }
    }
    return true;
}

function validate(form){
    var fields_to_check = new Map([
        ['f_fname',"First name"],
        ['f_lname', "Last name"],
        ['f_email', "E-mail"],
        ['f_zip', "Zip code"],
        ['f_street', "Street"],
        ['f_city', "City"]
    ])
    var validity = true;
    for (const [field,alias] of fields_to_check.entries()){
        if (!checkStringAndFocus(form.elements[field],alias+" cannot be empty!")){
                validity = false;
                form.elements[field].className = "wrong";
            }
    }
    if(!checkEmailRegEx(form.elements['f_email'].value)){ validity = false;}
    if(!checkZIPCodeRegEx("zip")){ validity = false;}
    return validity;
}

function checkString(string,message){
    if (isEmpty(string) || isWhiteSpace(string)){
        alert(message);
        return false;
    }
    return true;
}

var errorField = "";
function startTimer(fName) {
    errorField = fName;
    window.setTimeout("clearError(errorField)", 5000);
}
function clearError(objName) {
    document.getElementById(objName).innerHTML = "";
}

function checkStringAndFocus(obj, msg) {
    var str = obj.value;
    var errorFieldName = "e_" + obj.name.substr(2, obj.name.length);
    if (isWhiteSpace(str) || isEmpty(str)) {
        document.getElementById(errorFieldName).innerHTML = msg;
        obj.focus();
        startTimer(errorFieldName);
        return false;
    }
    else {
        return true;
    }
}

function checkEmail(str) {
    if (isWhiteSpace(str)) {
        alert("Incorrect e-mail");
        return false;
    }
    else {
        var at = str.indexOf("@");
        if (at < 1) {
            alert("Incorrect e-mail");
            return false;
        }
        else {
            var l = -1;
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (c == ".") {
                    l = i;
                }
            }
            if ((l < (at + 2)) || (l == str.length - 1)) {
                alert("Incorrect e-mail");
                return false;
            }
        }
        return true;
    }
}

function checkEmailRegEx(str) { 
    var email = /[a-zA-Z_0-9\.]+@[a-zA-Z_0-9\.]+\.[a-zA-Z][a-zA-Z]+/; 
    if (email.test(str)) return true; 
    else { 
        alert("Wrong e-mail address"); 
        return false; 
    }
}


function showElement(e) {
    document.getElementById(e).style.visibility = 'visible';
}
function hideElement(e) {
    document.getElementById(e).style.visibility = 'hidden';
}

function checkZIPCodeRegEx(id){
    var zipElement = document.getElementById(id);
    var str = zipElement.getElementsByTagName("input")[0].value;
    var zip = /\d{2}-\d{3}/;
    var result = zip.test(str); 

    var zipStatus = zipElement.getElementsByTagName("span")[0];
    if (result){
        zipStatus.innerHTML = "OK";
        zipStatus.className = "green";
    }else{
        zipStatus.innerHTML = "WRONG";
        zipStatus.className = "red";
    }

    return result;
}


function alterRows(i, e) { 
    if (e) {
        if (i % 2 == 1) { 
            e.setAttribute("style", "background-color: Aqua;"); 
        } 
        e = e.nextSibling; 
        while (e && e.nodeType != 1) { 
            e = e.nextSibling; 
        } 
        alterRows(++i, e); 
    }
}

//alterRows(1,document.getElementsByTagName("tr")[0])


function nextNode(e) { 
    while (e && e.nodeType != 1) { 
        e = e.nextSibling; 
    } 
    return e; 
}
function prevNode(e) { 
    while (e && e.nodeType != 1) { 
        e = e.previousSibling; 
    } 
    return e; 
}
function swapRows(b) { 
    var tab = prevNode(b.previousSibling); 
    var tBody = nextNode(tab.firstChild); 
    var lastNode = prevNode(tBody.lastChild); 
    tBody.removeChild(lastNode); 
    var firstNode = nextNode(tBody.firstChild); 
    tBody.insertBefore(lastNode, firstNode); 
}

function cnt(form, msg, maxSize) { 
    if (form.value.length > maxSize) form.value = form.value.substring(0, maxSize); 
    else msg.innerHTML = maxSize - form.value.length; 
}