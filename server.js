const { query } = require("express");
const express = require("express");
const sdk = require("node-appwrite");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
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
  const promise = databases.listDocuments("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", [sdk.Query.limit(100)]);
  promise.then(
    function (response) {
      res.json({ response });
    },
    function (error) {
      res.json(error);
    }
  );
});

app.get("/", (req, res) => {
  res.render("index", { gameId: "Worlzeeeegezgd" });
});

app.listen(3000);
