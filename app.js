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

app.use('*/css',express.static('public/css'));
app.use('*/fonts',express.static('public/fonts'));

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


app.get("/done", function (request, response) {
    response.sendFile(__dirname + "/public/done.html");
});

app.get("/about", function (request, response) {
    response.sendFile(__dirname + "/public/about.html");
});

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    newTask(request.body.newTitle, request.body.newBody, request.body.newColor)
    response.redirect("/");
});

app.post("/setdone/:id", urlencodedParser, function (request, response) {
    if(!request.params.id) return response.sendStatus(400);
    setDone(request.params.id)
    response.redirect("/");
});

app.post("/unsetdone/:id", urlencodedParser, function (request, response) {
    if(!request.params.id) return response.sendStatus(400);
    unsetDone(request.params.id)
    response.redirect("/done");
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

function setDone(id) {
    var pgp = require("pg-promise")(/*options*/);
    var db = pgp("postgres://postgres:123@localhost:5432/postgres");
    
    db.one(`update tasks set is_done = true where id = ${id};`)
    .then(function () {
        console.log("SUCCESS");
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
}

function unsetDone(id) {
    var pgp = require("pg-promise")(/*options*/);
    var db = pgp("postgres://postgres:123@localhost:5432/postgres");
    
    db.one(`update tasks set is_done = false where id = ${id};`)
    .then(function () {
        console.log("SUCCESS");
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
}