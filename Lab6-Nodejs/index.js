const express = require("express");
const app = express();

app.use(express.static("public"));

// app.listen(process.env.PORT || 3000)
app.listen(3000, ()=>{
    console.log("Running at http://localhost:3000");
});