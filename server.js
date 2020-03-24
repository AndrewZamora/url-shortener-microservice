'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");
const dns = require('dns');
const cors = require('cors');
const app = express();
const checkUrl = url => {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      resolve({ err, address, family });
    })
  });
}

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const urlSchema = new Schema({
  url: String,
  shortUrl: String
})
const Url = mongoose.model("Url", urlSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", async function (req, res) {
  const url = req.body.url.replace(/^(http|https):\/\//, "");
  const check = await checkUrl(url);
  if (check.address) {
    const newUrl = new Url({ url, shortUrl: "2" })
    newUrl.save();
  } else {
    res.json({ "error": "invalid URL" });
  }
  res.end()
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});