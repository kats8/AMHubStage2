//allows path manipulation cross-platform
//const path = require("path");
var express = require("express");
var bodyParser = require("body-parser");

const app = express();

//to allow use of POST
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

//basic test to check functioning
app.get("/displayHello", function (request, response) {
  var user_name = request.query.name;
  response.json("Hello " + user_name + "!");
});



app.listen(port);
console.log("Listening on port ", port);