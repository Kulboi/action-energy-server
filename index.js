'use strict'

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const app = express();

app.use(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next()
// });

mongoose.Promise = global.Promise;
console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

app.use(bodyParser.json());

// Endpoints
app.use('/', require('./routes'));

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(`Error: ${err}`);
  console.log(`Server listening on port ${process.env.PORT}`);
});