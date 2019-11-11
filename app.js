'use strict';
require('dotenv').config();
const express = require('express');
// const fs      = require('fs');
// const https   = require('https');

const database = require('./modules/database');
const exif = require('./modules/exif');
const multer = require('multer');
const upload = multer({dest: 'public/files/'});
const crypto = require('crypto');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static('public'));

// create the connection to database
const connection = database.connect();

const insertToDB = (data, res, next) => {
  database.insertUser(data, connection, () => {
    next();
  });
};


const PalautaFrontendiin = (data, req, next) => {
  database.select(data, connection, (results) => {
    req.custom = results;
    next();
  });
};


app.post('/asd',  (req, res, next) => {
  console.log("req.body: ",req.body);
  console.log(req.body[0]);
  const data = ["css", req.body.cssData,10,10,10,10]; //ip alkuun
  insertToDB(data, req, next);
  console.log(req.custom);
  res.send(req.body);
});




app.listen(8000); //normal http traffic