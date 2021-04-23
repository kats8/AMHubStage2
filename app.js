//allows path manipulation cross-platform
//const path = require("path");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
const req = require("request");
const uri = "mongodb+srv://Angler_User:89CL735AU@sit725.63pic.mongodb.net/AM_Fish?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
let urlRemoteVR = 'https://us-south.functions.appdomain.cloud/api/v1/web/Katrina.Steen%40gmail.com_dev/default/AM%20Fish%20Analysis'
//variable used for MongoDB collection of fish and regulations
let fishes;
client.connect(err => {
  fishes = client.db("AM_Fish").collection("FishRegs");
  console.log("Connected to database");
  //    client.close();
});

const app = express();

app.use(cors());



var port = process.env.PORT || 8081;

app.use(express.static(__dirname + '/public'));

//basic test to check functioning
app.get("/displayHello", function (request, response) {
  var user_name = request.query.name;
  response.json("Hello " + user_name + "!");
});




/*
  app.get("/classifyURL", function (request, response) {

    let imageURL = request.query.url;
    let aClass;
    console.log(vrURL)
    reqObject = urlRemoteVR + "?url="+ imageURL;
    req(reqObject, (err, result, body) => {
      if (err) { return console.log(err); }
      try {
        let classFound = result.body[0].class;
        aClass = classFound;
        classSet = result.body;

      }

      catch (e) {
        console.log(e);
        console.log(result.body);
        aClass = null;
      }
      let theMatch = {
        classSet: classSet,
        aClass: aClass
      }
      console.log(result)
      // Add the object to the database
      // send back to the original caller
      response.json({ result: theMatch })
    });
  });

  */
/*
  app.get("/classifyURL", function (request, response) {

    let imageURL = request.query.url;
    console.log(imageURL)
    reqObject = urlRemoteVR+"?url"+imageURL;
    req(reqObject,  (err, result, body) => {
      if (err) { return console.log(err); }
      console.log(result.body)
      response.end(result.body)
    });
  })*/
/*
    imageResult = result;
    $('#urlPic').attr("src", inputURL);
    //alert(result.images[0].classifiers[0].classes[0].class); 
    //alert(imageResult[0].class);
    // alert('imageres class: '+imageResult[0].class);
    try {
      classFound = imageResult[0].class;
    }

    catch (e) {
      console.log(e);
      $('#textInfo').html("We couldn't find a valid image at that url");
    }
  }).then(result => $.get("/checkFishMatch", { body: result }, function (matchInfo) {
    matchData = jQuery.parseJSON(matchInfo);


   
*/
  //****** 
  // console.log("this is objects Found in checkFishMatch " + objectsFound);
  
app.get("/checkFishMatch", function (request, response) {
  console.log(request.query.body);
  /*
  fishData = {
    fish: "tilapia",
    noxious: true,
    protected: false,
    info: "someIfo",
    score: 0.8,
    fishMatch: true
  }
  response.send(JSON.stringify(fishData));
 // response.send(fishData);
*/
  try {
    //original
  //  let objectsFound = request.query.body;
    //***** 
 // let objectsFound = JSON.stringify(request.query.body);
 let objectsFound = JSON.parse(request.query.body);

  checkForFish(objectsFound, response);
  }
  catch(e){
    console.log(e)
    response.send(e);
  }
  //****** 
 // console.log("this is objects Found in checkFishMatch " + objectsFound);
  
});


  
    //function takes array of classes (identified class/item names) and scores, and checks for match with fish DB
    function checkForFish(idfdObjectArray, response) {
      //tracks if a match was found
      let fishMatch = false;
      //tracks score of best match so far
      let score = 0;
      let fishData = { fishMatch: fishMatch };
      //let objectArray = JSON.parse(idfdObjectArray);
      let recordsToMatch;
      try {
        let objectArray = idfdObjectArray;
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
                    fishMatch: fishMatch
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

    app.listen(port);
    console.log("Listening on port ", port);