const express = require('express');
const database = require('./modules/database');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
//auth
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

const base64Img = require('base64-img');
const multer = require('multer');
const upload = multer({dest: 'images/'});



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

require('dotenv').config();
//app.use(express.static('./public/temp'));
app.use(express.static('./public/css')); 
app.use(express.static('./public/temp')); 
app.use(express.static('./images'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};
var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'gdsghesdfgsfs',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use('/', index);
app.use('/users', users);

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
        const db = require('./db');
        
        db.query('SELECT id,password FROM users WHERE username = ?', [username], function(err, results, fields) {
          if(err){done(err)}

          if (results.length === 0){
            done(null, false);
          }else{
            const hash = results[0].password.toString();

            bcrypt.compare(password, hash, function(err, response) {
              if(response === true){
                return done(null, {user_id: results[0].id})
              } else{
                return done(null, false);
              }
            });
          }
        })
    }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});
////////////////////// AUTH LOPPUU TÄHÄN

/// KUVAN KOMPRESSOINTI
(async () => {
  const files = await imagemin(['images/*.{jpg,png}'], {
    destination: 'imagenew/',
    plugins: [
      imageminJpegtran({
        quality: [0.6, 0.8]
      }),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });

console.log(files)
  //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();





//BASE64

//////////////////////DB kyselyt

/*

app.post('/asd', (req, res, next) => {

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

  res.send(req.custom);
});



const saveCSSFiles = (name, value) => {
  const nameOfCss = name;

  const cssPath = path.join(__dirname, '../htmlFetcher', 'public', 'css', nameOfCss);
  //  console.log(cssPath);
  //  console.log("Name of CSS File to Be Added:", nameOfCss);
  fs.open('./public/css/' + name, "w", function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });
 // console.log(value, " <----- Value");

  fs.appendFile('./public/css/' + name, value, function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved and Added Content!');
  });
};

const pushToArray = (mediaQuery, minW, maxW, minH, maxH) => {
  let data = [];
  data.push(mediaQuery);
  data.push(minW);
  data.push(maxW);
  data.push(minH);
  data.push(maxH);
  return data;
}

//Etsi MEDIA QUERY JOKA SOPII #Fethcatti width:n kokoon
app.post('/findMediaQuery', (req, res, next) => {
  let data = [req.body.width, req.body.height];
  findScreenMediaQuery(data, req, next);
});
app.use('/findMediaQuery', (req, res, next) => {
  for (let i = 0; i < req.custom.length; i++) {
    findScreenMediaQuery2(req.custom[i], req, next);
  }
});
app.use('/findMediaQuery', (req, res, next) => {
  res.send(req.custom);
});


app.post('/resetCssFiles', (req, res, next) => {
  resetCssFiles(req, next);
});
app.use('/resetCssFiles', (req, res, next) => {
  res.send(req.body);
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

const convertMediaQueryToNumbers = (MediaQuery_Saanto) => {
  // console.log("MediaQuery_Saanto: ", MediaQuery_Saanto);
  let n1 = MediaQuery_Saanto.lastIndexOf(")"); // @media screen and (min-width: 48em) { <- otetaan pois {
  let n2 = MediaQuery_Saanto.lastIndexOf(":"); // : ja ) väliltä luku x(px tai em)
  // console.log("n1: ", n1, " , n2: ", n2);
  let MinMaxWidthHeight = MediaQuery_Saanto.slice(n1, n2);
  //console.log("MinMaxWidthHeight: ", MinMaxWidthHeight);
  return null;//VAIHDA
};

const decimalToint = (value) => {
  return value | 0;
}

const empxConversion = (value) => {

  let lastTwoCharacters = value.slice(-2); // =em tai px
  if (lastTwoCharacters == "px") {
    let px = value.indexOf("px");
    value = value.slice(0, px);
    return decimalToint(value); //otetaan pois px, jotta voidaan vertailla kokoa
  } else if (lastTwoCharacters == "em") {
    let em = value.indexOf("em");
    let sizeInEm = value.slice(0, em); //otetaan pois em
    sizeInEm *= 10; //em = 10x koko
    return decimalToint(sizeInEm);
  }

}

const manipulateString2 = (Arr) => {
  let tempArr = [];

  let MediaQuery = "";

  for (let i = 0; i < Arr.length; i++) {
    //  console.log("Arr["+i+"] :"+Arr[i]);
    MediaQuery = Arr[i].replace(/ /g, '').toString(); //ota tyhjat valit poist
    //  console.log("MediaQuery_Saanto ", MediaQuery);
    let first = MediaQuery.indexOf(":");  // @media screen and (min-width
    let n = MediaQuery.indexOf(")");

    let value = MediaQuery.slice((first + 1), (n));

    if (value.endsWith("e")) { //tarkasta ettei lopu em e tai px p
      value += "m";
    } else if (value.endsWith("p")) {
      value += "x";
    }
    //   console.log("value: ",value);
    value = empxConversion(value); //convertoi intiksi
    tempArr.push(value);

  }
  //console.log("tempArr: ",tempArr);
  return tempArr;
};

const manipulateString4 = (PartOfArray, match) => {
  //  console.log("  manipulateString4 PartOfArray :", PartOfArray);
  //
  // let tempArr = [];
  let value = "";
  let MediaQuery = "";

  if (PartOfArray.includes(match)) {
    MediaQuery = PartOfArray.replace(/ /g, '').toString(); //ota tyhjat valit poist
    let first = MediaQuery.indexOf(":");  // @media screen and (min-width
    let n = MediaQuery.indexOf(")");

    value = MediaQuery.slice((first + 1), (n));

    if (value.endsWith("e")) { //tarkasta ettei lopu em e tai px p
      value += "m";
    } else if (value.endsWith("p")) {
      value += "x";
    }
    //  console.log("value manipulateString4: ",value);
    value = empxConversion(value); //convertoi intiksi

    //  tempArr.push(value);
  }
  //console.log("tempArr: ",tempArr);
  // console.log("Value: " + value);
  return value;
};

const manipulateString3 = (Arr) => {
  let mWH = ["min-width", "max-width", "min-height", "max-height"];
  let tempArr = [];
  //console.log("ARR ", Arr);
  for (let i = 0; i < Arr.length; i++) {
    let m1 = Arr[i].match(mWH[0]); //Arr on ["min-width", "10px"] yms.
    let m2 = Arr[i].match(mWH[1]);
    let m3 = Arr[i].match(mWH[2]);
    let m4 = Arr[i].match(mWH[3]);

    try {


      if (m1) {
        m1.forEach((match) => {

          tempArr.push([mWH[0], manipulateString4(Arr[i], match)]); //push(String)
        });
      }
      if (m2) {
        m2.forEach((match) => {

          tempArr.push([mWH[1], manipulateString4(Arr[i], match)]);
        });
      }
      if (m3) {
        m3.forEach((match) => {

          tempArr.push([mWH[2], manipulateString4(Arr[i], match)]);
        });
      }
      if (m4) {
        m4.forEach((match) => {

          tempArr.push([mWH[3], manipulateString4(Arr[i], match)]);
        });
      }
    } catch (e) {
      //  console.log("Error in forEach", e);
    }
  }
  return tempArr;
};

const manipulateString = (arr) => {


  let stringToBeManipulated = "";

  arr.forEach((mString) => {
    let MediaQuery = mString.replace(/ /g, '').toString(); //ota tyhjat valit poist

    // for (let i = 0; i < Arr.length; i++) {
    let first1 = MediaQuery.IndexOf(":");
    let first2 = MediaQuery.IndexOf(")");
    // @media screen and (min-width:<- otetaan pois kaikki ekasta
    stringToBeManipulated = MediaQuery.slice(first1, first2); //tulostaa @media screen and (min-width: 48em)

  });
  if (stringToBeManipulated.endsWith("e")) {
    stringToBeManipulated += "m";
  } else if (stringToBeManipulated.endsWith("p")) {
    stringToBeManipulated += "x";
  }
  return stringToBeManipulated;
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
  let tempArr5 = [true]; //true = 2d array

  for (let i = 0; i < arr.length; i++) {
    let res = MediaQuery.split(arr[i]); //arr[i] on min-height yms.
    tempArr1.push(res[0]);
    tempArr2.push(res[1]);
  }
  for (let i = 0; i < tempArr2.length; i++) {
    let bool = true;
    if (typeof tempArr2[i] === 'undefined') {
      //null 
    } else {
      try {

        let res2 = MediaQuery.split("and"); //arr[i] on min-height yms.
        tempArr3.push(res2);

        bool = false;
      } catch (e) {
        //   console.log(e);
      }
      if (bool !== true) {
        tempArr4.push(tempArr2[i]);

      }
    }
  }
  if (tempArr3.length > 1) { //Jos mediaquery sisältää enemmän sääntöjä kuin 1, esim min-height and min-width niin palautetaan arr3


    for (let i = 0; i < tempArr3.length; i++) {

      tempArr5.push(manipulateString3(tempArr3[i]));
    }

    return tempArr5;
  } else {

    tempArr2 = [false, match, manipulateString2(tempArr4)[0]];

    return tempArr2;
  }
}

const modifyArray = (arr, arrToBeAdded) => {
  if (arr.length > 1) {
    arr[0].push(arrToBeAdded);
  }
  return arr;
}

const findMWH = (arr, match) => {

  for (let i = 0; i < arr.length; i++) { //0 on Boolean

    for (let j = 0; j < arr[i].length; j++) {
      //   console.log("arr["+i+"]["+j+"]",arr[i][j]);
      let contain = (arr[i][j][0].indexOf(match) > -1);
      if (contain === true) {
        return arr[i][j]; //j+1 on luku, j on min-width
      }
    }
  }
}

const getMultipleConditionsFromMediaQuery = (MediaQuery) => {

  let arr = [];

  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  let arr4 = [];

  let mWH = ["min-width", "max-width", "min-height", "max-height"];

  let m1 = MediaQuery.match(mWH[0]);
  let m2 = MediaQuery.match(mWH[1]);
  let m3 = MediaQuery.match(mWH[2]);
  let m4 = MediaQuery.match(mWH[3]);
  try {
    if (m1) {
      m1.forEach((match) => {

        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);

        if (tempArr[0] === true) {
          let tempString = (findMWH(tempArr, mWH[0]));
          tempArr = [true, tempString]; //Otetaan pois 2d arrayn kopioituminen
        }
        arr.push(tempArr);
      });
    }
    if (m2) {
      m2.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);

        if (tempArr[0] === true) {
          let tempString = (findMWH(tempArr, mWH[1]));
          tempArr = [true, tempString]; //Otetaan pois 2d arrayn kopioituminen
        }
        arr.push(tempArr);
      });
    }
    if (m3) {
      m3.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);

        if (tempArr[0] === true) {
          let tempString = (findMWH(tempArr, mWH[2]));
          tempArr = [true, tempString]; //Otetaan pois 2d arrayn kopioituminen
        }
        arr.push(tempArr);
      });
    }
    if (m4) {
      m4.forEach((match) => {
        let tempArr = splitMultipleQueries(MediaQuery, match, mWH);

        if (tempArr[0] === true) {
          let tempString = (findMWH(tempArr, mWH[3]));
          tempArr = [true, tempString]; //Otetaan pois 2d arrayn kopioituminen
        }
        arr.push(tempArr);
      });
    }
  } catch (e) {
    //  console.log("Error in forEach", e);
  }

  //  console.log(arr);
  return arr;
}

const split2dArray = (arr) => {
  let temp = arr;

  if (arr[0][0] === true) {
    temp[0][0] = false;
    return temp;
  }
}

const modify2dArraytoDatabaseFormat = (arr) => {
  let temp1dArr = [null, null, null, null];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1][0] === "min-width") {
      temp1dArr[0] = arr[i][1][1];
    }
    if (arr[i][1][0] === "max-width") {
      temp1dArr[1] = arr[i][1][1];
    }
    if (arr[i][1][0] === "min-height") {
      temp1dArr[2] = arr[i][1][1];
    }
    if (arr[i][1][0] === "max-height") {
      temp1dArr[3] = arr[i][1][1];
    }
  }
  return temp1dArr;
}

app.post('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {

  SelectCSSFilesID(req.body.CSS_File, req, next); //req.body.CssArr[0] on CSS_Tiedoston nimi,

});

app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {
  let MinMaxWidthHeight = getMultipleConditionsFromMediaQuery(req.body.MediaQuery_Saanto);

  const data = [
    req.body.CSS_File,
    req.CssId[0].CSS_Id,
    req.body.MediaQuery_Saanto,
    req.body.Position,
    req.body.TextToClearPosition,
    req.body.LastIndexToClearPosition,
    req.body.FullMediaQuery
  ];



  if (MinMaxWidthHeight[0][0] === false) { //1d array
    switch (MinMaxWidthHeight[0][1]) {
      case "min-width":
        data.push(MinMaxWidthHeight[0][2], null, null, null);
        break;
      case "max-width":
        data.push(null, MinMaxWidthHeight[0][2], null, null);
        break;
      case "min-height":
        data = pushToArray(null, null, MinMaxWidthHeight[0][2], null);
        break;
      case "max-height":
        data = pushToArray(null, null, null, MinMaxWidthHeight[0][2]);
        break;
    }
  } else {
    let temp2d = modify2dArraytoDatabaseFormat(MinMaxWidthHeight);
    for (let i = 0; i < temp2d.length; i++) {
      data.push(temp2d[i]);
    }

  } //IF 2d arrayconsole.log(" ");
  console.log("_______________");
  console.log(" ");
  // console.log("DATA: ", data);
  console.log(" ");
  req.custom = data;

  if (data.length < 8) { //Tietokantaan 8 lokeroa
    data.push(null);
  }

  // insertTotallennaTietokantaanMediaQuerynPosition(data, res, next); //VAIHDA KUN TEHDÄÄN ENEMMÄN KUIN KERRAN
  next();
});

app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {

  //let data = [req.body.mediaQueryPosition, req.body.cssTiedosto];

  // SelectCSSMediaQueryPositions(data, req, next);
  next();
});

app.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {

  // console.log(req.custom.length);
  /* try{
     console.log(req.custom[0].Position);
     console.log(req.custom[0].CSS_File);
   }catch(e){}
  // console.log(req.body);
  // console.log(req.CssId[0].CSS_Id);
  res.send(req.custom);
});*/



module.exports = app;
