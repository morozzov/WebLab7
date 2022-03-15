const express = require("express");
   
const app = express();
   
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123",
  port: 5432
});

const urlencodedParser = express.urlencoded({extended: false});

var dataJ

app.get("/getDone", (req, res) => {

pool.query(
     "select * from tasks where is_done = true;",
     [],
     (error, results) => {
       if (error) {
         throw error;
       } 
       res.status(200).json(results.rows);
     }
   );
});

app.get("/get", (req, res) => {
pool.query(
     "select * from tasks where is_done = false;",
     [],
     (error, results) => {
       if (error) {
         throw error;
       } 
       res.status(200).json(results.rows);
     }
   );
});
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
    // response.send(`${request.body.newTitle} - ${request.body.newBody } - ${request.body.newColor}`);
    newTask(request.body.newTitle, request.body.newBody, request.body.newColor)
    response.redirect("/");
});
   
app.listen(3000, ()=>console.log("Server started..."));

function newTask(newTitle, newBody, newColor) {

    var pgp = require("pg-promise")(/*options*/);
    var db = pgp("postgres://postgres:123@localhost:5432/postgres");
    
    db.one(`insert into tasks (title, body, color, is_done)values ('${newTitle}','${newBody}','${newColor}',false);`)
    .then(function () {
        console.log("SUCCESS");
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
}

function getTasks() {

    var pgp = require("pg-promise")(/*options*/);
    var db = pgp("postgres://postgres:123@localhost:5432/postgres");
    var res = null;
    db.any(`select * from tasks where is_done = false;`)
    .then(function (data) {
        res = data
        console.log("SUCCESS: ", data);
        console.log("SUS: ", res);
        return res
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
    return res
}