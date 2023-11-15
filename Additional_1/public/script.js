const backpack_tf = "https://backpack.tf";


var suggested_list = new Map();
var selected_item = new Map();

// httpGetAsync(backpack_tf,function(responseText){
//     const backpackDOM = new JSDOM(responseText);
//     ref_val, key_in_ref = get_metal_prices(backpackDOM);
//     console.log(ref_val + " " + key_in_ref);
// })



function find_items(text){
    if (text === null || typeof str === "string" && str.length === 0){
        return 0;
    }
    httpGetAsync(backpack_tf+"/search?text="+text,function(responseText){
        create_suggested_list(JSON.parse(responseText));
    });
}

function create_suggested_list(response){
    $(".item-list").empty();
    suggested_list.clear();
    var results = response["results"]
    for (key in results){
        item = results[key]
        if (item["type"] == 2){
            continue;
        }
        add_item_to_list(item);
    }
}

function add_item_to_list(item){
    var item_url = item["image_url"];
    if (item_url[0].charAt(0) == '/'){
        item_url = backpack_tf+item_url
    }
    var item_name = item["item_name"];
    var item_id = item_name;
    var html_string = '<li id="'+item_id+'"class="found-item row"> <div class="item-pic"><img src="'+item_url+'" width="42" height="42"></div><div class="item-name">'+item_name+'</div></li>'
    $(".item-list").append(html_string);
    suggested_list.set(item_id,item);
}

function get_price_and_unit(text){
    const first_float = /([0-9]*[.]?[0-9]+)/;
    const price_unit = /(keys|ref|$)/;

    var price = text.match(first_float)[0];
    var unit = text.match(price_unit)[0];

    return {price,unit};
}

function select_item(item_id){
    var item = suggested_list.get(item_id);
    var item_html = '<div class="selected-item row">'+
    '<img src="'+item["image_url"]+'" height="256" width="256">'+
    '<div class="column">'+
        '<div class="selected-item-name">'+item["item_name"]+'</div>';
    
    
    for (i in item['values']){
        var quality = item['values'][i]
        var {price, unit} = get_price_and_unit(quality['price']);
        item_html += '<div><span style="color: '+quality["color"]+';">'+quality["quality"]+'</span>:<span class="value">'+price+" "+unit+'</span></div>';
    }
    
    item_html += '</div><button class="delete">X</button></div>';
    console.log(item_html)
    $(".item-prices-panel").append(item_html);
}

function httpGetAsync(theUrl, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("GET", theUrl, true);
    request.send(null);
}

$(document).ready(function(){
    $("#item-search").on(
        "focus keyup",
        function(){
            find_items($(this).val());
        }
    );

    $('ul.item-list').on('click','.found-item',function(){
        select_item($(this).attr('id'));
    });

    $("#scrape").load("https://en.wikipedia.org/wiki/List_of_countries_by_minimum_wage",function(){
        alert("backpack tf loaded");
    });
});