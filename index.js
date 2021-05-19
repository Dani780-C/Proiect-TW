// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


// Link SERV static files 
app.use("/", express.static('serv'));

// Create
app.post("/ideas", (req, res) => {
  const ideasList = readJSONFile();
  const newIdea = req.body;
  newIdea.id = uuidv1();
  const newIdeasList = [...ideasList, newIdea];
  writeJSONFile(newIdeasList);
  res.json(newIdea);
});

// Read One
app.get("/ideas/:id", (req, res) => {
  const ideasList = readJSONFile();
  const id = req.params.id;
  let idFound = false;
  let foundIdea;

  ideasList.forEach(idea => {
    if (id === idea.id) {
      idFound = true;
      foundIdea = article
    }
  });

  if (idFound) {
    res.json(foundIdea);
  } else {
    res.status(404).send(`Idea ${id} was not found`);
  }
});

// Read All
app.get("/ideas", (req, res) => {
  const ideasList = readJSONFile();
  res.json(ideasList);
});

// Update
app.put("/ideas/:id", (req, res) => {
  const ideasList = readJSONFile();
  const id = req.params.id;
  const newIdea = req.body;
  newIdea.id = id;
  idFound = false;

  const newIdeasList =  ideasList.map((idea) => {
     if (idea.id === id) {
       idFound = true;
       return newIdea
     }
    return idea
  })
  
  writeJSONFile(newIdeasList);

  if (idFound) {
    res.json(newIdea);
  } else {
    res.status(404).send(`Idea ${id} was not found`);
  }

});

// Delete
app.delete("/ideas/:id", (req, res) => {
  const ideasList = readJSONFile();
  const id = req.params.id;
  const newIdeasList = ideasList.filter((idea) => idea.id !== id)

  if (ideasList.length !== newIdeasList.length) {
    res.status(200).send(`Idea ${id} was removed`);
    writeJSONFile(newIdeasList);
  } else {
    res.status(404).send(`Idea ${id} was not found`);
  }
});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["ideas"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ ideas: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);