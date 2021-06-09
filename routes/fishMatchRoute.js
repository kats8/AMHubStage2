var Controller = require("../controllers/checkFishController.js");

require("dotenv/config"); //load the config file env, can be used by calling process.env.{variableName}
const req = require("request");
const express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });
const dbAuth = process.env.DBAPI_AUTH;

//variables to store client location
//let pLat;
//let pLong;

//let imageURL = "";
/*
//variable used for MongoDB collection of fish and regulations
let fishes;

client.connect(err => {
  fishes =  client.db("AM_Fish").collection("FishRegs");
  if(err){
    console.log(err)
  }
  else{
    console.log("Connected to database");
    //    client.close();
  }
});
*/

//End point for checking image objects found against the database of fish species info and returning information
router.get('/', function (request, response) {
    console.log(request.query.body);

    try {
        let objectsFound = JSON.parse(request.query.body);
        let pLat = request.query.lat;
        let pLong = request.query.long;
        let imageURL = request.query.url;

        let checkThis = {
            objectsFound: objectsFound,
            lat: pLat,
            long: pLong,
            url: imageURL,
        }
       // checkForFish(objectsFound, response);
        Controller.checkForFish(checkThis, response);
    }
    catch (e) {
        console.log(e)
        response.send(e);
    }

});

/*
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
    
        //array of objects recognised from visual recognition
        let objectArray = JSON.parse(idfdObjectArray.objectsFound);
        //lat & long position detected from user
        let theLat =  idfdObjectArray.lat;
        let theLong = idfdObjectArray.long;

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
                //dummy data but randomised to vary some
                // let latRand = -26 + (Math.random()*7);
                // let longRand = 150 + (Math.random()*2);
                let recordData =
                {
                  fish: fishData.fish,
                  lat: theLat,
                  long: theLong,
                  url: imageURL
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
      console.log(res.data);
    });
  }
*/

module.exports = router;
