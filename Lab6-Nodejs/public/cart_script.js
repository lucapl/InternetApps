
var shopping_cart = [];
var url = window.location.href.split('?')[0];

function update_sum(){
    var sum = 0;
    for (const product of shopping_cart){
        sum += product["price"] * product["quantity"];
    }
    $('.suma').text(sum);   
}

function update_cart(){
    const cart = $(".cart .content")
    cart.empty();
    for (const product of shopping_cart){
        cart.append(
        '<div class="products">'+
                '<div class = "cart-product row padding-small">' +
                    '<div class="cart-p-visuals row">' +
                        '<img src="'+product["img"]+'"' +
                        'width="64" height="64">'+
                        '<span class="cart-p-name">'+product["name"]+'</span>'+
                    '</div>'+
                    '<div class="cart-p-info row">'+
                        '<div class="cart-p-price">'+product["price"]+' zł</div>'+
                        '<input class="cart-p-quantity" type="number" value="'+product["quantity"]+'" min="0" p_id="'+product["id"]+'">'+
                    '</div>'+
                '</div>'+
            '</div>')
    }
}

function update_quantity(quantity_input){
    const id = $(quantity_input).attr("p_id");
    const i = shopping_cart.findIndex((element)=>element["id"]==id);
    const quant = $(quantity_input).val();
    shopping_cart[i]["quantity"] = quant;
    update_sum();
}

function sendCart(cart,callback){
    const filteredCart = cart.filter((product) => product["quantity"] != 0);
    httpPostAsync(url+"/update",JSON.stringify(filteredCart),callback != undefined ? callback : function(){});
}

function cancel(){
    shopping_cart = [];
    update_cart();
    update_sum();   
}

function buy(){
    const filteredCart = shopping_cart.filter((product) => product["quantity"] != 0);
    var req = new XMLHttpRequest();
    // req.onreadystatechange = function(){
    //     if (req.readyState == 4 && req.status == 200){
    //         callback(req);
    //     }
    // }
    req.onload = () =>{
        window.location.href = req.responseURL; 
    }
    req.open("POST",url+"/payment",true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(filteredCart));
}

function handleFail(){
    let paramSearch = new URLSearchParams(window.location.search);

    if (!paramSearch.has('fail')){
        return null;
    }
    const failedId = paramSearch.get('fail');
    const diff = paramSearch.get('count');
    const found = shopping_cart.find((element) => element["id"]==failedId);
    $("section.error").text(`Przekroczono limit produktu ${found.name} o ${diff}`).removeClass("hidden");
}

// window.addEventListener("beforeunload", (event) => {
//     sendCart(shopping_cart);
//     event.preventDefault();
// });

$(function(){

    $(".content").on("change","input.cart-p-quantity",function(){
        update_quantity(this);
        sendCart(shopping_cart);
    })

    $("button.cancel").on("click",cancel);

    $("button.buy").on("click",buy);

    $("span.title").on("click",function(){
        sendCart(shopping_cart,function(){
            window.location.href = window.location.href.replace("/cart","");
        });
    })




    // window.onpopstate = setTimeout(function(event) {
    //     sendCart(shopping_cart);
    // },0);

    httpGetAsync(url+"/get",function(responseText){
        shopping_cart = JSON.parse(responseText);
        update_cart();
        update_sum();
        handleFail();
    });
})