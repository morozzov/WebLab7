const express = require("express");
   
const app = express();
   
const urlencodedParser = express.urlencoded({extended: false});
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});
app.use('*/css',express.static('public/css'));
app.use('*/fonts',express.static('public/fonts'));

app.get("/done", function (request, response) {
    
    response.sendFile(__dirname + "/public/done.html");
});
app.get("/about", function (request, response) {
    response.sendFile(__dirname + "/public/about.html");
});
app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});
   
app.listen(3000, ()=>console.log("Server started..."));