require("dotenv/config"); //load the config file env, can be used by calling process.env.{variableName}
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoUtil = require("./mongoUtil");

//route requires
const classifierRoute = require('./routes/classifierRoute.js');
const fishMatchRoute = require('./routes/fishMatchRoute.js');

//routes
app.use('/classifyURL', classifierRoute);
app.use('/checkFishMatch', fishMatchRoute);

mongoUtil.connectToFishTable(function (err, client) {
  if (err) console.log(err);
});
var port = process.env.PORT || 8081;

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log("Listening on port ", port);
