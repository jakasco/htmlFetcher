'use strict';
require('dotenv').config();
const express = require('express');
const fs = require('fs');
// const https   = require('https');

const database = require('./modules/database');
const exif = require('./modules/exif');
const multer = require('multer');
const upload = multer({ dest: 'public/files/' });
const crypto = require('crypto');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));

// create the connection to database
const connection = database.connect();

const insertToDB = (data, res, next) => {
  database.insertUser(data, connection, () => {
    next();
  });
};


const insertToDB2 = (data, res, next) => {
  database.insertIntoMediaQueryTable(data, connection, () => {
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

const findScreenSize = (data, req, next) => {
  database.selectScreenSize(data, connection, (results) => {
    //  console.log("Result palauyta frontend: ",results);
    req.custom = results;
    next();
  });
};


app.post('/asd', (req, res, next) => {
  //console.log("req.body: ",req.body);

  console.log("Req body.width :", req.body.width);
  const data = ["css",//1
    req.body.cssData, //2
    req.body.width, //3
    req.body.height, //4
    10, //5
    10, //6
    10, //7
    10]; //8 (8 riviä css taulussa)
  insertToDB(data, req, next);
  next();
});
app.use('/asd', (req, res, next) => {
  PalautaFrontendiin("null toistaiseksi", req, next);
});
app.use('/asd', (req, res, next) => {
  // console.log("req.custom: ",req.custom);
  res.send(req.custom);
});

app.post('/checkScreenSize2', (req, res, next) => {
 // console.log("req.body 2: ", req.body);
  //const data = ["MediaQuery",null,null,null,null];
console.log(req.body.widthOrHeight," | ",req.body.lenght);
  const data = [];
 // try{
  if(req.body.widthOrHeight == "min-width"){
    data = [req.body.mediaQuery,req.body.lenght,null,null,null];
  }else if(req.body.widthOrHeight == "max-width"){
    data = [req.body.mediaQuery,null,req.body.lenght,null,null];
  }else if(req.body.widthOrHeight == "min-height"){
    data = [req.body.mediaQuery,null,null,req.body.lenght,null];
  }else if(req.body.widthOrHeight == "max-height"){
    data = [req.body.mediaQuery,null,null,null,req.body.lenght];
  }else{
 // }catch(e) {
    data = [null,null,null,null,null];
  }
    insertToDB2(data, req, next);
  next();
});
app.use('/checkScreenSize2', (req, res, next) => {
  res.send(req.body);
});

app.post('/checkScreenSize', (req, res, next) => {
  console.log("req.body: ", req.body);
  console.log("req.body: ", req.body.width);
  const data = [req.body.width, req.body.height];
  console.log("Data App.js ", data);
  PalautaFrontendiin(data, req, next);
});
app.use('/checkScreenSize', (req, res, next) => {

  fs.open('./public/css/mynewfile2.css', 'w', function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });

  fs.appendFile('./public/css/mynewfile2.css', 'body {color:blue}', function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved!');
  });

  res.send(req.custom);
});

app.listen(8000); //normal http traffic