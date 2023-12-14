const express = require("express");
const routing = require("./routing");
const session = require("express-session");
const {closeConnection,connectToDatabase} = require("./database");

const app = express();

app.use(session(
    {
        secret: 'C0oOl1',
        saveUninitialized: true,
        resave: false
    }
));


app.use('/', routing);

app.use(express.static("public"));

connectToDatabase();

app.listen(3000, ()=>{
    console.log("Running at http://localhost:3000");
});

process.on('SIGINT', () => {
    closeConnection();
    process.exit(0);
});