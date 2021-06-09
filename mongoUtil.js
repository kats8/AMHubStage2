require("dotenv/config"); //load the config file env, can be used by calling process.env.{variableName}
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });

//MongoDB collection of fish and regulations
let fishTable;

module.exports = {

  /*
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('test_db');
      return callback( err );
    } );
  }, */

  connectToFishTable: function () {
    client.connect(err => {
      fishTable = client.db("AM_Fish").collection("FishRegs");
      if (err) {
        console.log(err)
      }
      else {
        console.log("Connected to database");
        //    client.close();
      }
    });
  },

  getFishTable: function () {
    return fishTable;
  }
};