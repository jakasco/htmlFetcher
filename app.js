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
  //  console.log("Result palauyta frontend: ",results);
    req.custom = results;
    next();
  });
};


app.post('/asd',  (req, res, next) => {
  //console.log("req.body: ",req.body);
/*
  console.log("Req body.width :",req.body.width);
 const data = ["css1",//1
  req.body.cssData, //2
   req.body.width, //3
   req.body.height, //4
   10, //5
   10, //6
   10, //7
   10]; //8 (8 riviä css taulussa)
  insertToDB(data, req, next);*/
  next();
});
app.use('/asd',  (req, res, next) => {
  PalautaFrontendiin("null toistaiseksi", req, next);
}); 
app.use('/asd',  (req, res, next) => {
 // console.log("req.custom: ",req.custom);
res.send(req.custom);
});

app.listen(8000); //normal http traffic