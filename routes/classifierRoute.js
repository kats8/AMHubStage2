
require('dotenv/config'); //load the config file env, can be used by calling process.env.{variableName} 
const urlRemoteVR = process.env.VR_CONNECTION;
const req = require("request");
const express = require("express");
const router = express.Router();

//End point for analysing image at url provided (connects to cloud function which extracts data from third party VR service)
router.get("/", function (request, response) {
    imageURL = request.query.url;
    pLat = request.query.lat;
    pLong = request.query.long;
    console.log(imageURL)
    console.log(pLat + " " + pLong)
    reqObject = urlRemoteVR + "?url=" + imageURL;
    req(reqObject, (err, result) => {
        if (err) { return console.log(err); }
        console.log(result.body);
        response.send(result.body);
    });
});

module.exports = router;