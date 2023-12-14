const url = window.location.href.split('?')[0];
var shopping_cart = null;
var loaded_products = null;

function drawProducts(products){
    const productList = $(".product-list")
    productList.empty();
    for (const product of products){
        if(product["quantity"] == 0){
            continue;
        }
        productList.append(
            '<div class="product row padding-small">' +
                '<img ' +
                'src="'+product["img"]+'"' +
                    'width="256" height="256">' +
                '<div class="product-info column padding-small">' +
                    '<div class="product-name">' +
                        product["item"] +
                    '</div>' +
                    '<div>Cena: <span class="product-price">'+product["price"]+' zł</span></div>' +
                    '<div class="product-quantity">Na magazynie: '+product["quantity"]+'</div>' +
                '</div>' +
                '<div class="button center"><button class="add2cart" value='+product["_id"]+'>Dodaj do koszyka</button></div>' +
            '</div>'
        )
    }
}
function go2cart(){
    httpPostAsync(url+"cart/update",JSON.stringify(shopping_cart),function(responseText){
        window.location.href = url+ "cart";
        //console.log("lol");
        return null;
    })
    //window.location.href += "cart";
}


function handleSuccess(){
    let paramSearch = new URLSearchParams(window.location.search);

    if (!paramSearch.has('success')){
        return null;
    }
    $("section.success").text(`Dziękujemy za udany zakup!`).removeClass("hidden");
}


function addProduct(id){
    const found = shopping_cart.find((element)=>element["id"]==id)
    if (!found){
        const product = loaded_products.find((element)=>element["_id"]==id)
        shopping_cart.push({"id":id,"quantity":1,"name":product["item"],"img":product["img"],"price":product["price"]});
        updateCart();
        return null;
    }
    found["quantity"] += 1;
}

function updateCart(){
    $("button.cart").addClass(".blink-class");
    $(".cart-products").text(shopping_cart.length);
}

$(function(){
    handleSuccess();
    httpGetAsync(url+"products",function(responseText){
        loaded_products = JSON.parse(responseText);
        drawProducts(loaded_products);
    })
    httpGetAsync(url+"cart/get",function(responseText){
        shopping_cart = JSON.parse(responseText);
        updateCart();
    })
    $(".product-list").on("click","button.add2cart",function(){
        addProduct(this.value);
    })
    $("button.cart").on("click",go2cart);
})