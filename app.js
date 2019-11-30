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
    try {
      req.custom = { mediaQueryPosition: 0 };
    } catch (e) {
      console.log("Erroe, ", e);
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

const convertSizesOfPxOrEm = (size) => {
  let lastTwoCharacters = size.slice(-2); // =em tai px
  let arr = [];

  if (size !== null) {
    if (lastTwoCharacters == "px") {
      arr.push(size, "px");
      return arr; //otetaan pois px, jotta voidaan vertailla kokoa
    } else if (lastTwoCharacters == "em") {
      let sizeInEm = size.slice(0, -2); //otetaan pois em
      sizeInEm *= 10; //em = 10x koko
      console.log("Size in em", sizeInEm);
      arr.push(sizeInEm, "em");
      return arr;
    }
  }
}
/*
  switch (match) {
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
  }*/
const convertMediaQueryToNumbers = (MediaQuery_Saanto) => {
  console.log("MediaQuery_Saanto: ", MediaQuery_Saanto);
  let n1 = MediaQuery_Saanto.lastIndexOf(")"); // @media screen and (min-width: 48em) { <- otetaan pois {
  let n2 = MediaQuery_Saanto.lastIndexOf(":"); // : ja ) väliltä luku x(px tai em)
  console.log("n1: ", n1, " , n2: ", n2);
  let MinMaxWidthHeight = MediaQuery_Saanto.slice(n1, n2);
  console.log("MinMaxWidthHeight: ", MinMaxWidthHeight);
  return null;//VAIHDA
};

const manipulateString = (Media_Query, Arr) => {

  MediaQuery = Media_Query.replace(/ /g, ''); //ota tyhjat valit poist
  let tempArr = [];

  let first = MediaQuery.indexOf(Arr[0]);  // @media screen and (min-width

  for (let i = 0; i < Arr.length; i++) {

    if (i === 0) {
      let n = MediaQuery.IndexOf(")");
      console.log("MediaQuery_Saanto ", n);
      let value = MediaQuery.slice(first, n);

      tempArr.push(value);
    } else {
      //let first2 = first + 1; // ) <- alkaa sulun jälkeen
      let first2 = MediaQuery.IndexOf(")");
      let n = MediaQuery.indexOf(Arr[i]); // @media screen and (min-width:<- otetaan pois kaikki ekasta
      console.log("n: ", n);
      MediaQuery = MediaQuery.slice(first2, n); //tulostaa @media screen and (min-width: 48em)
      tempArr.push(value);
    }
  }

}

const addToArrIfContains = (MediaQuery, match, arr) => {

  let temp = [];

  if (MediaQuery.includes(match)) { //Ensin tarkastetaan oikea arvo, sitten onko 2 alemanpana
    temp.push(match);
  }
  for (let i = 0; i < arr.length; i++) {
    if (MediaQuery.includes(arr[i]) && arr[i] !== match) { //Jos sisältää 2 esim. min-width and min-height
      temp.push(arr[i]);
    }
  }

  return temp;
};

const splitMultipleQueries = (MediaQuery, match, arr) => {

  let tempArr1 = [];
  let tempArr2 = [];
  let tempArr3 = [];
  let tempArr4 = [];

  for (let i = 0; i < arr.length; i++) {
    let res = MediaQuery.split(arr[i]); //arr[i] on min-height yms.
    tempArr1.push(res[0]);
    tempArr2.push(res[1]);
  }
  // console.log("tempArr 1: ",tempArr1);
  // console.log("tempArr 2: ",tempArr2);
  for (let i = 0; i < tempArr2.length; i++) {
    let bool = true;
    if (typeof tempArr2[i] === 'undefined') {
      //null 
    } else {
      try {
        
        let res2 = tempArr2[i].split("and"); //arr[i] on min-height yms.
        bool = false;
        tempArr3.push(res2);
      } catch (e) {
     //   console.log(e);
      }
      if(bool !== true){
        tempArr4.push(tempArr2[i]);
      }
    }
  }
  if(tempArr3.length > 1){ //Jos mediaquery sisältää enemmän sääntöjä kuin 1, esim min-height and min-width niin palautetaan arr3
    console.log("tempArr 3: ", tempArr3);
    return tempArr3;
  }else{
    console.log("tempArr  4  : ", tempArr4);
    return tempArr2;
  }
}

const getMultipleConditionsFromMediaQuery = (MediaQuery) => {

  let arr = [];
  let mWH = ["min-width", "max-width", "min-height", "max-height"];

  let m1 = MediaQuery.match(mWH[0]);
  let m2 = MediaQuery.match(mWH[1]);
  let m3 = MediaQuery.match(mWH[2]);
  let m4 = MediaQuery.match(mWH[3]);
  try {
    if (m1) {
      m1.forEach((match) => {
        //     console.log(`Found match in: ${match}`);
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);
        let temp = match;
        arr.push(temp);
      });
    }
    if (m2) {
      m2.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);
        let temp = match;
        arr.push(temp);
      });
    }
    if (m3) {
      m3.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);
        let temp = match;
        arr.push(temp);
      });
    }
    if (m4) {
      m4.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);
        //  let temp = [match, convertMediaQueryToNumbers(m4)];
        let temp = match;
        arr.push(temp);
      });
    }
  } catch (e) {
    console.log("Error in forEach", e);
  }
  return arr;
}


app.post('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {


  let MinMaxWidthHeight = getMultipleConditionsFromMediaQuery(req.body.MediaQuery_Saanto);

  console.log(MinMaxWidthHeight);



  const data = [
    req.body.CSS_File,
    req.body.MediaQuery_Saanto,
    req.body.Position,
    req.body.TextToClearPosition,
  ];



  // getLenght(req.body.cssTiedosto, req, next);
  //getLenghtmediaQuerySaanto1(req.body.mediaQuerySaanto1, req, next);
  // getLenghtmediaQuerySaanto2(req.body.mediaQuerySaanto2, req, next);

  //getLenghtmediaQueryPosition(req.body.mediaQueryPosition, req, next);

  //getLenghtlengthType(req.body.lengthType, req, next);
  // getLenghtwidth(req.body.width, req, next);
  ///getLenghtheight(req.body.height, req, next);

  //   var obj = addNullOrCorrect(req.body.mediaQuerySaanto1);

  // console.log("Pituus: "+getLenght(obj));

  /*  data2.push(getAllParameters(req.body.cssTiedosto));
    data2.push(getAllParameters(req.body.mediaQuerySaanto1));
    ddata2.pus(getAllParametersh(req.body.mediaQuerySaanto2));
    data2.push(getAllParameters(req.body.mediaQueryPosition));
    data2.push(getAllParameters(req.body.lengthType));
    data2.push(getAllParameters(req.body.width));
    data2.push(getAllParameters(req.body.height));_/
   
   /*  data.push(addNullOrCorrect(req.body.cssTiedosto));
     data.push(addNullOrCorrect(req.body.mediaQuerySaanto1));
     data.push(addNullOrCorrect(req.body.mediaQuerySaanto2));
     data.push(addNullOrCorrect(req.body.mediaQueryPosition));
     data.push(addNullOrCorrect(req.body.lengthType));
     data.push(addNullOrCorrect(req.body.width));
     data.push(addNullOrCorrect(req.body.height));*/

  //console.log("DATA2:", data);
  // req.custom = data;


  //  insertTotallennaTietokantaanMediaQuerynPosition(data, res, next); //VAIHDA KUN TEHDÄÄN ENEMMÄN KUIN KERRAN
  next();
});

app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {


  // console.log(req.custom);

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