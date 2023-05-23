var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  res.json({
    a: 1,
  });
});

// POST method route
app.post("/", function (req, res, next) {
  if (req.body && req.body.challenge) {
    res.send(req.body.challenge);

    return;
  }
  res.send("POST request to the homepage");
});

app.listen(8080, () => {
  console.log("hello world");
});
