const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const dbmanager = require("./dbman");

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/hello", (req, res) => {
  res.json({
    result: "Hello you!",
  });
});

app.get("/api/users", (req, res) => {
  dbmanager.findAllUsers((err, data) => {
    if (err) {
      res.json({
        error: "error searching the list of users",
      });
    } else {
      res.json(data);
    }
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query ? req.query : null;

  dbmanager.findLogForUserId(id, from, to, limit, (err, data) => {
    if (err) {
      res.json({
        error: `error searching the log for the userid ${id}`,
      });
    } else {
      if (data) {
        res.json(data);
      } else {
        res.json({ status: `the supplied id doesn't return any exercise` });
      }
    }
  });
});

app.post("/api/users", urlEncodedParser, (req, res) => {
  const name = req.body.username;

  dbmanager.createAndSaveUser(name, (err, data) => {
    if (err) {
      res.json({ error: "error creating a new user" });
    } else {
      if (data) {
        res.json({
          username: data.username,
          _id: data._id,
        });
      } else {
        res.json({
          error: "user already exists in the database",
        });
      }
    }
  });
});

app.post("/api/users/:_id/exercises", urlEncodedParser, (req, res) => {
  const userId = req.params._id;
  const exercise = {
    _id: userId,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
  };
  dbmanager.createAndSaveExercise(exercise, (err, data) => {
    if (err) {
      res.json({
        error: `error creating a new exercise: "${err}"`,
      });
    } else {
      if (data) {
        const { username, description, duration, date, _id } = data;
        res.json({
          _id: userId,
          username,
          date: new Date(date).toDateString(),
          duration,
          description,
        });
      } else {
        res.json({
          error: "there isn't any user with the supplied id",
        });
      }
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
