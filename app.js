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
const crypto = require('crypto');

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
const cryptaus = (data, req, next) => {
  database.cryptausTest(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const PalautaFrontendiin = (data, req, next) => {
  database.PalautaFrontendiin(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const PalautaFrontendiin2 = (data, req, next) => {
  database.PalautaFrontendiin2(data, connection, (results) => {
    req.custom = results;
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
  const data=[req.body.testformdata, 'testirivi']
  insertToDB(data, res, next);
})










//TÄSSÄ KOHDASSA LISÄTÄÄN FRONTENDIN INPUT FIELDIEN VALUET TIETOKANTAAN
app.post('/cryptTest', (req,res,next)=>{
  console.log("reqbody:", req.body.testformdata);

  let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
  let mystr = mykey.update(req.body.testformdata, 'utf8', 'hex');

  mystr += mykey.final('hex');


  console.log("mystr: ",mystr); //34feb914c099df25794bf9ccb85bea72



  const data=[mystr, ' '];
  cryptaus(data, res, next);
})

//TÄSSÄ KOHDASSA ETSITÄÄN YLLÄ LISÄTYT TIEDOT TIETOKANNASTA
app.use('/cryptTest', (req, res, next) => {
  PalautaFrontendiin2("null toistaiseksi", req, next)

});

//TÄSSÄ LÄHETETÄÄN TIETOKANNASTA ETSITYT TIEDOT JSON MUODOSSA TAKAISIN FRONTEND
app.use('/cryptTest', (req, res, next)=>{
  console.log("reqcustom",req.custom[0].kayttaja);
 // req.custom[0].kayttaja decryptaa tääm
  let mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
  let mystr = mykey.update(req.custom[0].kayttaja, 'hex', 'utf8')
  mystr += mykey.final('utf8');
  console.log("mystr2_",mystr)


  req.custom[0].kayttaja = mystr;

  console.log("reqcustom 2 .... ",req.custom[0].kayttaja);

  res.send(req.custom);
})











app.use('/test2', (req, res, next) => {
  PalautaFrontendiin("null toistaiseksi", req, next)
});
app.use('/test2', (req, res) => {
  console.log(req.custom);
  res.send(req.custom);
});


app.listen(8000); //normal http traffic
