'use strict'

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

try {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
}catch(error) {
  console.log(error);
}

app.use(bodyParser.json());

// Endpoints
app.use('/', require('./routes'));

app.listen(process.env.APP_SERVER_PORT, (err) => {
  if (err) return console.log(`Error: ${err}`);
  console.log(`Server listening on port ${process.env.APP_SERVER_PORT}`);
});