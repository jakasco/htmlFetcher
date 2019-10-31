'use strict';
require('dotenv').config();
const express = require('express');
// const fs      = require('fs');
// const https   = require('https');

const database = require('./modules/database');
const resize = require('./modules/resize');
const exif = require('./modules/exif');
const multer = require('multer');
const upload = multer({dest: 'public/files/'});

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert
};
*/

app.use(express.static('public'));

// create the connection to database
const connection = database.connect();
//testataan toimiiko tietokanta
/*
database.select(connection, (results) => { //kun sivua avataan tekee samantien tietokantakyselyn
});
*/
const insertToDB = (data, res, next) => {
  database.insert(data, connection, () => {
    next();
  });
};

const report = (turha, req, next) =>{
  database.reportImage(turha, connection, (results) => {
    req.custom = results;
    next();
  })
};

app.post('/report', (req, res, next) =>{
  console.log("report ", req.body);
  report(null, req, next);
  res.send(req.body);
});

app.post('/asd',  (req, res, next) => {
  console.log(req.body);
  const data = ["asd", "Nasdasdsad"]; //ip alkuun
  insertToDB(data, req, next);
  console.log(req.custom);
  res.send(req.body);
});

app.post('/testi', (req, res, next ) => {
  console.log("TEST 1" ,req.body);
  res.end();
})

app.post('/test2', (req, res, next ) => {
  console.log("TEST2" ,req.body);
  const data=[req.body.testformdata, 'asd']
  insertToDB(data, res, next);
})
app.use('/test2', (req, res) => {
  console.log(req.custom);
  res.send(req.custom);
});
app.listen(8000); //normal http traffic
