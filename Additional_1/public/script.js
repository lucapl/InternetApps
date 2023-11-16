const backpack_tf = "https://backpack.tf";


var suggested_list = new Map();
var selected_item = new Map();
var ref_val = 0;
var key_val = 0;


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
    var item_url = fix_item_url(item["image_url"]);
    var item_name = item["item_name"];
    var item_id = item_name;
    var html_string = '<li id="'+item_id+'"class="found-item row"> <div class="item-pic"><img src="'+item_url+'" width="42" height="42"></div><div class="item-name">'+item_name+'</div></li>'
    $(".item-list").append(html_string);
    suggested_list.set(item_id,item);
}

function fix_item_url(img_url){
    var item_url = img_url;
    if (item_url[0].charAt(0) == '/'){
        item_url = backpack_tf+item_url
    }
    return item_url;
}

function get_metal_price(json){
    var {price, unit} = get_price_and_unit(json['values'][1]['price']);
    return parseFloat(price);
}

function get_key_price(json){
    var {price, unit} = get_price_and_unit(json['values'][0]['price'])  
    return parseFloat(price);
}

function get_price_and_unit(text){
    const first_float = /([0-9]*[.]?[0-9]+)/;
    const price_unit = /(keys|ref|\$)/;

    var price = text.match(first_float)[0];
    var unit = text.match(price_unit)[0];

    return {price,unit};
}

function select_item(item_id){
    var item = suggested_list.get(item_id);
    var item_html = '<div class="selected-item row">'+
    '<img src="'+fix_item_url(item["image_url"])+'" height="256" width="256">'+
    '<div class="column">'+
        '<div class="selected-item-name">'+item["item_name"]+'</div>';
    
    
    for (i in item['values']){
        var quality = item['values'][i]
        var {price, unit} = get_price_and_unit(quality['price']);
        item_html += '<div><span style="color: '+quality["color"]+
            ';">'+quality["quality"]+
            '</span>:<span class="value">'+price+" "+unit+
            '<span class="unit-value"></span></span></div>';
    }
    
    item_html += '</div><button class="delete">X</button></div>';
    $(".item-prices-panel").append(item_html);

    fill_unit_values();
}

function httpGetAsync(theUrl, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("GET", theUrl, true);
    request.send(null);
}

function fill_unit_values(){
    var selected_country = $("select option:selected").val();
    console.log("fill values");
    httpGetAsync("http://localhost:3000/wiki_pay?country="+selected_country, function(responseText){
        var value_fields = $("span.value");
        for(let i = 0; i < value_fields.length; i++){
            var {price, unit} = get_price_and_unit(value_fields.eq(i).text());
            var dolar_val = 1;
            if (unit === "ref"){
                dolar_val = ref_val;
            } else if (unit === "keys"){
                dolar_val = key_val;
            }
            var unit_value = (dolar_val*price)/parseFloat(responseText);
            var unit = "hours";
            if (unit_value < 1){
                unit_value = 60*unit_value;
                unit = "minutes"
            }
            if (unit_value < 1){
                unit_value = 60*unit_value;
                unit = "seconds"
            }
            value_fields.eq(i).children("span.unit-value").eq(0).text(" - "+ parseFloat(unit_value).toFixed(2) +" "+unit+" in "+selected_country);
        }
    });

}

$(function(){
    $("#item-search").on(
        "focus keyup",
        function(){
            find_items($(this).val());
        }
    );

    $('.item-prices-panel').on('click','div.selected-item button.delete',function(){
        $(this).parent().addClass("hidden");
    });

    $('ul.item-list').on('click','.found-item',function(){
        select_item($(this).attr('id'));
    });

    $('select').on('change',function(){
        fill_unit_values();
    })

    httpGetAsync(backpack_tf+"/search?text=refined metal",function(responseText){
        const responseJSON = JSON.parse(responseText);
        ref_val = get_metal_price(responseJSON["results"][0]);
        httpGetAsync(backpack_tf+"/search?text=Mann Co. Supply Crate Key",function(responseText){
            const responseJSON = JSON.parse(responseText);
            key_val = get_key_price(responseJSON["results"][0]) * ref_val;
            console.log("loaded values");
        })
    })
    

    // $("#scrape").load("https://en.wikipedia.org/wiki/List_of_countries_by_minimum_wage",function(){
    //     alert("backpack tf loaded");
    // });
});