require('dotenv/config'); //load the config file env, can be used by calling process.env.{variableName} 
var express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
const req = require("request");
const axios = require('axios');
const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });
const urlRemoteVR = process.env.VR_CONNECTION;
const dbAuth = process.env.DBAPI_AUTH;
// const routes = require('./routes/fish');


//variable used for MongoDB collection of fish and regulations
let fishes;
client.connect(err => {
  fishes = client.db("AM_Fish").collection("FishRegs");
  console.log("Connected to database");
  //    client.close();
});


app.use(cors());
// app.use('/fish', routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

app.use(express.static(__dirname + '/public'));

//basic test to check functioning
app.get("/displayHello", function (request, response) {
  var user_name = request.query.name;
  response.json("Hello " + user_name + "!");
});


//End point for analysing image at url provided (connects to cloud function which extracts data from third party VR service)
app.get("/classifyURL", function (request, response) {
  let imageURL = request.query.url;
  console.log(imageURL)
  reqObject = urlRemoteVR + "?url=" + imageURL;
  req(reqObject, (err, result) => {
    if (err) { return console.log(err); }
    console.log(result.body);
    response.send(result.body);
  });
});

//End point for checking image objects found against the database of fish species info and returning information
app.get("/checkFishMatch", function (request, response) {
  console.log(request.query.body);

  try {
    let objectsFound = JSON.parse(request.query.body);
    checkForFish(objectsFound, response);
  }
  catch (e) {
    console.log(e)
    response.send(e);
  }

});



//function takes array of classes (identified class/item names) and scores, and checks for match with fish DB
function checkForFish(idfdObjectArray, response) {
  //tracks if a match was found
  let fishMatch = false;
  //tracks score of best match so far
  let score = 0;
  let fishData = { fishMatch: fishMatch };
  //hold first class in set
  //let aClass = objectArray[0].class;

  let recordsToMatch;

  try {
    let objectArray = JSON.parse(idfdObjectArray);
    // let objectArray = idfdObjectArray;
    console.log(idfdObjectArray);
    console.log("Checking database");
    fishes = client.db("AM_Fish").collection("FishRegs");
    //get number of fish records in database
    fishes.countDocuments().then(result => {
      console.log(result);
      let totalRecords = result * objectArray.length;
      //checkForFish(classesFound);
      objectArray.forEach((idfdObject) => {
        recordsToMatch = Object.assign(totalRecords);
        //check the fishRegulations database for a match of fish type 
        fishes.find().forEach(function (fishes) {
          //if a match is found, check if it scores better than current match score, if so, replace data (better match).
          if (fishes.fish.toLowerCase() == (idfdObject.class).toLowerCase()) {
            fishMatch = true;
            if (parseFloat(idfdObject.score) > score) {
              fishData = {
                fish: fishes.fish,
                noxious: fishes.noxious,
                protected: fishes.protected,
                info: fishes.info,
                score: idfdObject.score,
                fishMatch: fishMatch,
                // aClass: aClass
              }
              console.log("found a match");
              console.log(fishData);
            }

          }
          recordsToMatch--;
          // console.log('records to match in current set ' + recordsToMatch);
          //once all records checked, send response
          if (recordsToMatch == 0) {
            console.log(fishData);
            //Added to log a record in the monitoring table - using dummy lat/long till location data funcitonality provided
            if (fishMatch) {
              let recordData =
              {
                fish: fishData.fish,
                lat: -27.15,
                long: 153.11,
                url: ""
              }
              saveLocation(recordData)
            }
            response.send(JSON.stringify(fishData));
          }
        })

      })
    }).catch(error => {
      console.log(error);
      console.log(fishData);
    })

  } catch (e) {
    console.error(e);
    console.log(fishData);

  }
}

function saveLocation(json) {
  let config = {
    headers: {
      authorization: dbAuth,
    }
  }
  axios.post('https://amlocatapi.us-south.cf.appdomain.cloud/location/', json, config
  ).then(res => {
    console.log(res);
  });
}

app.listen(port);
console.log("Listening on port ", port);
