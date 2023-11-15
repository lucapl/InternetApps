const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require("express");
const app = express();
const { readFile } = require("fs");
const request = require('request');


app.use(express.static("public"));

app.get('/tf_values',(serv_req,serv_res) => {
    request("https://www.backpack.tf", function(err,res,body){
        const dom = new JSDOM(body,{
            runScripts: "dangerously",
            resources: "usable"
        });
        serv_res.send(dom.serialize());
        //console.log(dom);
        //serv_res.send(get_metal_prices(dom));
    });
});

app.listen(process.env.PORT || 3000)

function get_price_and_unit(text){
    const first_float = /([0-9]*[.]?[0-9]+)/;
    const price_unit = /(keys|ref|$)/;

    var price = text.match(first_float)[0];
    var unit = text.match(price_unit)[0];

    return {price,unit};
}


function get_metal_prices(dom){
    var prices = dom.window.document.querySelectorAll("p.value");
    console.log(prices);
    var {metal_in_dollars, dollar} = get_price_and_unit(prices[0]);
    var {key_in_metal, ref} = get_price_and_unit(prices[1]);
    return {metal_in_dollars,key_in_metal};
}