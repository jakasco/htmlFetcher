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

//hae päivitetyt tiedot tietokannasta
app.use('/pageLoad', (req, res, next) => {
  selectAll(req, next);
});


//lähetä tiedot selaimeen//
app.use('/pageLoad', (req, res) => {
  res.send(req.custom);
});

//hae päivitetyt tiedot tietokannasta
app.use('/loadComments', (req, res, next) => {
 // console.log(req.body);
  const data = req.body.Id;
 // console.log(data);
  selectComments(data, req, next);
});



//lähetä tiedot selaimeen URL: Localhost:8000
app.use('/upload', (req, res) => {
  console.log(req.custom); //kaikki kuvat
  res.send(req.custom);
});


app.listen(8000); //normal http traffic
