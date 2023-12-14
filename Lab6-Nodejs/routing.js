const express = require('express');
const mongodb = require("mongodb");
const router = express.Router();
const { closeConnection ,connectToDatabase, client, dbName} = require('./database');
const fs = require('fs');
const {Console} = require('node:console'); 
const { request } = require('http');
const today = new Date();
const logFileName = './log/'+today.getDay()+"_"+today.getDate()+"_"+today.getFullYear()+"_"+today.getHours()+"_"+today.getMinutes()+"_"+today.getSeconds()+'_stdout.log';
const output = fs.createWriteStream(logFileName);
const logger = new Console(output);

router.use(express.json());

router.use((request,response,next)=>{
    logger.log(request.method+ " | "+ request.sessionID +" | " + request.url+" | "+new Date());
    next();
})

router.all('/hello', (request, response)=>{
    response.send("Hello World!");
})

router.get('/products', async (request, response)=>{
    db = client.db(dbName);
    products = db.collection("products");
    const text = await products.find({}).toArray();
    response.send(text);
})

var shopping_carts = {};

router.post('/cart/update', (request, response)=>{
    const body = request.body;
    shopping_carts[request.sessionID] = request.body;
    //response.redirect('/cart');
    response.sendStatus(200);
})

router.get('/cart/get',(request, response)=>{
    response.send(request.sessionID in shopping_carts ? shopping_carts[request.sessionID] : []);
})

router.get('/cart',(req,res)=>{
    res.sendFile(__dirname+'/public/cart.html');
})

router.post('/cart/payment', async (request,response)=>{
    db = client.db(dbName);
    products = db.collection("products");
    

    const customer_cart = request.body;
    const updates = Array.from(customer_cart,(product)=>[new mongodb.ObjectId(product["id"]),product["quantity"]]);

    const session = await client.startSession();
    session.startTransaction();
    try{

        for (const [ productId, quantity ] of updates){
            const product = await products.findOne({ _id: productId });
                
            if (!product || product.quantity < quantity) {
                response.redirect(`/cart?fail=${productId}&count=${quantity-product.quantity}`);
                return null;
            }
        }

        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: { _id: update[0] },
                update: {
                    // $set: { quantity: 0 },
                    $inc: { quantity: -update[1] },
                },
            },
        }));

        const result = await products.bulkWrite(bulkOperations, { ordered: true });
        shopping_carts[request.sessionID] = [];
        session.commitTransaction();
        logger.log(result);
        response.redirect('/?success=1')
    }catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();
        console.error(error.message);
    } finally {
        session.endSession();
    }
})

router.get('/cart/payment/fail',(request,response)=>{

})

router.get('/cart/payment/success',(request,response)=>{
    
})

module.exports = router;