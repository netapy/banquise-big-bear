const { query } = require("express");
const express = require("express");
const sdk = require("node-appwrite");
require("dotenv").config();

const app = express();

app.use(express.static("public"));

//
let client = new sdk.Client();
client.setEndpoint(process.env.API_URL).setProject(process.env.PROJ_ID).setKey(process.env.MASTER_API).setSelfSigned();
//

app.get("/users", (req, res) => {
  let users = new sdk.Users(client);
  let promise = users.list();
  promise.then(
    function (response) {
      res.json({ response });
    },
    function (error) {
      res.json(error);
    }
  );
});

app.get("/games", (req, res) => {
  const databases = new sdk.Databases(client);
  const promise = databases.listDocuments("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", [sdk.Query.limit(100), sdk.Query.orderDesc("$updatedAt")]);
  promise.then(
    function (response) {
      res.json({ response });
    },
    function (error) {
      res.json(error);
    }
  );
});

app.get("/game/:gameId", (req, res) => {
  var gameId = req.params.gameId;
  const databases = new sdk.Databases(client);
  const promise = databases.getDocument("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", gameId);
  promise.then(
    function (response) {
      res.json({ response });
    },
    function (error) {
      res.json(error);
    }
  );
});




app.listen(3000);
