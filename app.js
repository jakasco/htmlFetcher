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


const findScreenMediaQuery = (data, req, next) => {
  database.selectMediaQuery(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const findScreenMediaQuery2 = (data, req, next) => {
database.selectMediaQuery2(data, connection, (results) => {
req.custom.push(results);
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

const saveCSSFiles = (name, value) => {
  console.log("Name:", name);
  fs.open('./public/css/' + name + '.css', "w", function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });


  fs.appendFile('./public/css/' + name + '.css', value, function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved and Added Content!');
  });
};

const writeNewCssFile = (name, cssMediaQuery) => {
  console.log("Name:", name);
  fs.open('./public/css/' + name + '.css', "w", function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });


  fs.appendFile('./public/css/' + name + '.css', cssMediaQuery, function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved!');
  });
};

const pushToArray = (mediaQuery,minW,maxW,minH,maxH) => {
    let data = [];
    data.push(mediaQuery);
    data.push(minW);
    data.push(maxH);
    data.push(maxW);
    data.push(maxH);
    return data;
}

app.post('/findMediaQuery', (req, res, next) => {
  console.log(req.body.screenSize);
  let data = [req.body.screenSize];
  console.log("data: ",data);
  findScreenMediaQuery(data, req, next);
});
app.use('/findMediaQuery', (req, res, next) => {
  console.log("req.custom 1: ",req.custom);
  console.log("req.custom 1: ",req.custom[0]);
  console.log("req.custom 1: ",req.custom.length);
  for(let i=0; i<req.custom.length; i++){
    console.log("req.custom[i]: ",req.custom[i]);
  findScreenMediaQuery2(req.custom[i], req, next);
  }
});
app.use('/findMediaQuery', (req, res, next) => {
 // console.log("req.custom 2: ",req.custom);
  console.log("req.custom 2: ",req.custom[4]); // ARRAY mediaqueruista
  //REPLACE CSS WITH THIS MEDIA QUERY
  res.send(req.custom);
});




app.post('/checkScreenSize2', (req, res, next) => {

  let data = [];

  let mediaQuery = [' ' + req.body.mediaQuery + ' '];
  // writeNewCssFile(nameOfCssFile,mediaQuery);

  switch (req.body.widthOrHeight) {
    case "min-width":
      data = pushToArray(mediaQuery,req.body.lenght,null,null,null);
      break;
    case "max-width":
      data = pushToArray(mediaQuery,null,req.body.lenght,null,null);
      break;
    case "min-height":
      data = pushToArray(mediaQuery,null,null,req.body.lenght,null);
      break;
    case "max-height":
      data = pushToArray(mediaQuery,null,null,null,req.body.lenght);
      break;
  }
  
  insertToDB2(data, req, next);
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