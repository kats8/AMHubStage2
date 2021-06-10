var Controller = require("../controllers/checkFishController.js");
require("dotenv/config"); //load the config file env, can be used by calling process.env.{variableName}
const req = require("request");
const express = require("express");
const router = express.Router();

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

module.exports = router;
