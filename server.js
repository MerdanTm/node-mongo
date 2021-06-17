const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;

const mongoPwd = "8qQIW2RENUT0jbgi";
const url = `mongodb+srv://sarvar:${mongoPwd}@firstcluster.miq5x.mongodb.net/crudDB?retryWrites=true&w=majority`;

app.use(express.static("public"));
app.use(bodyParser.json());
app.set("index", "./views");
app.set("view engine", "pug");

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("crudDB");
    const quotesCollection = db.collection("crud");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post("/add", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.get("/", (req, res) => {
      db.collection("crud")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.pug", { names: results });
        });
    });

    app.put("/add", (req, res) => {
      console.log(req.body);
      quotesCollection
        .findOneAndUpdate(
          { name: "Merdan" }, // write it manually from your quotes
          {
            $set: {
              name: req.body.name,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/add", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No name was deleted!");
          } else {
            return res.json("Deleted Successfully!");
          }
        })
        .catch((error) => console.log(error));
    });
  })
  .catch((error) => console.error(error));

app.listen(port, () => console.log(`Example app listening on port port!`));
