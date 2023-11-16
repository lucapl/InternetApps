const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require("express");
const app = express();
const { readFile } = require("fs");
const request = require('request');

const backpack_url = "https://www.backpack.tf";

const wikipedia_url = "https://en.wikipedia.org/wiki/List_of_countries_by_minimum_wage";

app.use(express.static("public"));

const resourceLoader = new jsdom.ResourceLoader({
    strictSSL: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
});

app.get('/tf_values',(serv_req,serv_res) => {
    request(backpack_url, function(err,res,body){
        const dom = new JSDOM(body,{
            resources: resourceLoader,
            runScripts: "dangerously",
            resources: "usable",
            pretendToBeVisual: true,
            virtualConsole: new jsdom.VirtualConsole(),
            cookieJar: new jsdom.CookieJar(),
        });
        serv_res.send(dom.serialize());
        //console.log(dom);
        //serv_res.send(get_metal_prices(dom));
    });
});

//$("tr:has(a:contains(United States))")[0].children[5]

app.get('/wiki_pay',(serv_req,serv_res) => {
    request(wikipedia_url, function(err,res,body){
        const dom = new JSDOM(body,{
            resources: resourceLoader,
            runScripts: "dangerously",
            resources: "usable",
            pretendToBeVisual: true,
            virtualConsole: new jsdom.VirtualConsole(),
            cookieJar: new jsdom.CookieJar(),
        });
        const $ = (require('jquery'))(dom.window);
        serv_res.send($("tr:has(a:contains("+serv_req.query.country+"))").eq(0).children().eq(5).text());
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