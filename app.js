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

const insertTotallennaTietokantaanMediaQuerynPosition = (data, res, next) => {
  database.tallennaTietokantaanMediaQuerynPosition(data, connection, () => {
    next();
  });
};

const SelectCSSMediaQueryPositions = (data, req, next) => {
  database.SelectCSSMediaQueryPositions(data, connection, (results) => {
    req.custom = results;
    //console.log(req.custom);
    next();
  });
};

const insertCssFile = (data, res, next) => {
  database.insertCssFile(data, connection, () => {
    next();
  });
};

const SelectCSSFile = (data, req, next) => {
  database.SelectCSSFile(data, connection, (results) => {

    req.custom = results;
    next();
  });
};

const checkIfDatabaseWontWriteTablesMoreThanOnce = (data, req, next) =>
  database.checkIfDatabaseWontWriteTablesMoreThanOnce(data, connection, (results) => {

    req.custom = results; //0
    next();
  });

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
  console.log("Name of CSS File to Be Added:", name);
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
  fs.open('./public/css/' + name + "w", function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });


  fs.appendFile('./public/css/' + name + cssMediaQuery, function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved!');
  });
};

const pushToArray = (mediaQuery, minW, maxW, minH, maxH) => {
  let data = [];
  data.push(mediaQuery);
  data.push(minW);
  data.push(maxH);
  data.push(maxW);
  data.push(maxH);
  return data;
}


//Etsi MEDIA QUERY JOKA SOPII #Fethcatti width:n kokoon
app.post('/findMediaQuery', (req, res, next) => {
  //console.log(req.body.screenSize);
  let data = [req.body.width, req.body.height];
  console.log("data: ", data);
  findScreenMediaQuery(data, req, next);
});
app.use('/findMediaQuery', (req, res, next) => {
  console.log("req.custom 1: ", req.custom);
  console.log("req.custom 1: ", req.custom[0]);
  console.log("req.custom 1: ", req.custom.length);
  for (let i = 0; i < req.custom.length; i++) {
    console.log("req.custom[i]: ", req.custom[i]);
    findScreenMediaQuery2(req.custom[i], req, next);
  }
});
app.use('/findMediaQuery', (req, res, next) => {
  // console.log("req.custom 2: ",req.custom);
  //var res = str.slice(0, 5);
  //req.custom -> ["20em", "20em", Array(2)]
  console.log("req.custom 2: ", req.custom[4]); // ARRAY mediaqueruista
  //REPLACE CSS WITH THIS MEDIA QUERY
  res.send(req.custom);
});



let ArrayOfCssFilesNames = [];
//Tallenna CSS TIEDOSTO
app.post('/tallennaCSStiedosto', (req, res, next) => {

  SelectCSSFile(req.body.CssArr[0], req, next); //req.body.CssArr[0] on CSS_Tiedoston nimi,
  //Frontendissä käydään looppi missä on kaikki nämä

});

app.use('/tallennaCSStiedosto', (req, res, next) => {
  // ArrayOfCssFilesNames.push(req.custom);
  // console.log("ArrayOfCssFilesNames:",ArrayOfCssFilesNames);
  console.log("req.custom:", req.custom);
  // checkIfDatabaseWontWriteTablesMoreThanOnce(req.body.CssArr[0], req, next);
  next();
});

app.use('/tallennaCSStiedosto', (req, res, next) => {
  console.log(req.body.CssArr[0]); //CSS Tiedoston nimi
  //console.log(req.body.CssArr[1]); //Css tiedoston sisältö

  if (req.custom.length === 0) { //Jos ei ole sisältöä req.customissa, laita sinne
    let data = [int, req.body.CssArr[0], req.body.CssArr[1]];
    console.log("insertCssFile");
    insertCssFile(data, req, next); //Lisää CSS Tiedosto ja sen nimi tietokantaan
  } else {
    console.log("DONT insertCssFile");
    next();
  }
});



app.use('/tallennaCSStiedosto', (req, res, next) => {

  if (req.custom.length === 0) { //Jos ei ole sisältöä req.customissa, laita sinne
    let fiveLastChar = req.body.CssArr[0].slice(-2);
    let cssName = fiveLastChar + '.css';//req.body.CssArr[0]+'.css';
    saveCSSFiles(cssName, req.body.CssArr[1]);
  }
  res.send(req.body);
});


//Tallenna Kaikki Mediaqueryt tietokantaan
app.post('/checkScreenSize2', (req, res, next) => {

  let data = [];

  let mediaQuery = [' ' + req.body.mediaQuery + ' '];
  // writeNewCssFile(nameOfCssFile,mediaQuery);

  switch (req.body.widthOrHeight) {
    case "min-width":
      data = pushToArray(mediaQuery, req.body.lenght, null, null, null);
      break;
    case "max-width":
      data = pushToArray(mediaQuery, null, req.body.lenght, null, null);
      break;
    case "min-height":
      data = pushToArray(mediaQuery, null, null, req.body.lenght, null);
      break;
    case "max-height":
      data = pushToArray(mediaQuery, null, null, null, req.body.lenght);
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

function addNullOrCorrect(jsonData) {
  if (jsonData !== null) {
    return jsonData;
  } else {
    return null;
  }
}

function getAllParameters(json) {

  let arr = [];

  for (let i = 0; i < json.length; i++) {
    arr.push(addNullOrCorrect(json));
  }
  return arr;
}

const getLenght = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { cssTiedosto: 0 }
    next();
  } else {
    req.custom = { cssTiedosto: jsonFile.length }
  }
  next();
};

const getLenghtmediaQuerySaanto1 = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { mediaQuerySaanto1: 0 }
    next();
  } else {
    req.custom = { mediaQuerySaanto1: jsonFile.length }
  }
  next();
};

const getLenghtmediaQuerySaanto2 = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { mediaQuerySaanto2: 0 }
    next();
  } else {
    req.custom = { mediaQuerySaanto2: jsonFile.length }
  }
  next();
};

const getLenghtmediaQueryPosition = (jsonFile, req, next) => {

  if (!jsonFile) {
    try{
    req.custom = { mediaQueryPosition: 0 };
  }catch(e){
    console.log("Erroe, ",e);
  }
    next();
  } else {
    req.custom = { mediaQueryPosition: jsonFile.length };
    next();
  }

  next();
};

const getLenghtlengthType = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { lengthType: 0 }
    next();
  } else {
    req.custom = { lengthType: jsonFile.length }
  }
  next();
};

const getLenghtwidth = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { width: 0 }
    next();
  } else {
    req.custom = { width: jsonFile.length }
  }
  next();
};

const getLenghtheight = (jsonFile, req, next) => {

  if (!jsonFile) {
    req.custom = { height: 0 }
    next();
  } else {
    req.custom = { height: jsonFile.length }
  }
  next();
};


app.post('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {

  const data = [];



 // getLenght(req.body.cssTiedosto, req, next);
  //getLenghtmediaQuerySaanto1(req.body.mediaQuerySaanto1, req, next);
 // getLenghtmediaQuerySaanto2(req.body.mediaQuerySaanto2, req, next);
 
 //getLenghtmediaQueryPosition(req.body.mediaQueryPosition, req, next);

  //getLenghtlengthType(req.body.lengthType, req, next);
 // getLenghtwidth(req.body.width, req, next);
  ///getLenghtheight(req.body.height, req, next);

  //   var obj = addNullOrCorrect(req.body.mediaQuerySaanto1);

  // console.log("Pituus: "+getLenght(obj));

  /* data2.push(getAllParameters(req.body.cssTiedosto));
   data2.push(getAllParameters(req.body.mediaQuerySaanto1));
   ddata2.pus(getAllParametersh(req.body.mediaQuerySaanto2));
   data2.push(getAllParameters(req.body.mediaQueryPosition));
   data2.push(getAllParameters(req.body.lengthType));
   data2.push(getAllParameters(req.body.width));
   data2.push(getAllParameters(req.body.height));*/
  
    data.push(addNullOrCorrect(req.body.cssTiedosto));
    data.push(addNullOrCorrect(req.body.mediaQuerySaanto1));
    data.push(addNullOrCorrect(req.body.mediaQuerySaanto2));
    data.push(addNullOrCorrect(req.body.mediaQueryPosition));
    data.push(addNullOrCorrect(req.body.lengthType));
    data.push(addNullOrCorrect(req.body.width));
    data.push(addNullOrCorrect(req.body.height));
  
    //console.log("DATA2:", data);
    req.custom = data;


 //  insertTotallennaTietokantaanMediaQuerynPosition(data, res, next); //VAIHDA KUN TEHDÄÄN ENEMMÄN KUIN KERRAN
  next();
});
app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {


  console.log(req.custom);

  //let data = [req.body.mediaQueryPosition, req.body.cssTiedosto];

  // SelectCSSMediaQueryPositions(data, req, next);
  next();
});

app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {
  // console.log(req.custom.binary_row);
  // SelectCSSFile(req.custom.CSS_File, req, next);
  // console.log(req.custom.length);
  /* try{
     console.log(req.custom[0].Position);
     console.log(req.custom[0].CSS_File);
   }catch(e){}*/
  // console.log(req.body);
  res.send(req.custom);
});

app.listen(8000); //normal http traffic