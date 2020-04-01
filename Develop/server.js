// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));



// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays all notes
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.delete("/api/notes/:id", function(req, res) {
  const indexToDelete = req.params.id;

  console.log(indexToDelete);

  const newNotes = [];

  let notes = fs.readFileSync("./db/db.json");

  notes = JSON.parse(notes);

  notes.splice(indexToDelete, 1);

  for (let i = 0; i < notes.length; i++) {
    notes[i].id = i + 1;
    newNotes.push(notes[i]);
  }

  fs.writeFile("./db/db.json", JSON.stringify(newNotes), () => {
    console.log("Deleted Note");
  });

  res.json(newNotes);
});


// Create New Notes - takes in JSON input
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newNote = JSON.stringify(req.body);
  console.log("newNote:" + newNote);


  fs.readFile('./db/db.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var newArr = JSON.parse(data);
    var noteWithID = newNote.replace(/\{"/g, '{"id":"' + newArr.length + '","');
    let result;

    if (data.length < 3) {
      result = data.replace(/\]/g, noteWithID + ']');
    }
    else {
      result = data.replace(/\]/g, ',' + noteWithID + ']');
    }

    fs.writeFile('./db/db.json', result, 'utf8', function (err) {
      if (err) return console.log(err);
    });

    res.json(noteWithID);

  });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
