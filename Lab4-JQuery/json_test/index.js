const express = require("express");
const { readFile } = require("fs");
const app = express();

app.use(express.static("public"));

app.get('/json',(request,response) => {
    readFile("./guitars.json", "utf8", function(err, data) {
        if(err){
            response.sendStatus(500);
        }
        response.send(data);
    });
});

app.listen(process.env.PORT || 4000)