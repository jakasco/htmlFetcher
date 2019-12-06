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

const insertCssFile3 = (data, res, next) => {
  database.insertCssFile3(data, connection, () => {
    next();
  });
};

const SelectCSSFile3 = (data, req, next) => {
  database.SelectCSSFile3(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const addAutoIncrement = (id, table, tableRows, idName, data, req, next) => {
  database.addAutoIncrement(id, table, tableRows, idName, data, connection, (results) => {
    req.custom = results;
    next();
  });
}

const SelectCSSMediaQueryPositions4 = (data, req, next) => {
  database.SelectCSSMediaQueryPositions4(data, connection, (results) => {
    req.custom4 = results;
    next();
  });
};

const SelectCSSFilesID = (data, req, next) => {
  database.SelectCSSFilesID(data, connection, (results) => {
    req.CssId = results;
    next();
  });
};

const cutAllMediaQueriesByCssFileID = (j,id, FullMq, Muokattu_Tiedosto, cutStart, cutEnd, req, next) => {
  database.cutAllMediaQueriesByCssFileID(j,id, FullMq,Muokattu_Tiedosto, cutStart, cutEnd, connection, (results) => {
    req.CutAll.push([id, results]);
    next();
  });
};


const SelectCSSFile2 = (data, req, next) => {
  database.SelectCSSFile(data, connection, (results) => {

    req.custom3 = results;
    next();
  });
};

const SelectCSSFileByID = (idArr, req, next) => {

  database.SelectCSSFileByID(idArr, connection, (results) => {
    req.custom5 = results;

    next();
  });

};

const SelectCSSFileByID2 = (idArr, req, next) => {

  database.SelectCSSFileByID(idArr, connection, (results) => {
    req.custom5 = results;

    next();
  });

};

const resetCssFiles = (req, next) => {

  database.resetCssFiles(connection, (results) => {
    req.custom = results;

    next();
  });

};

const readFile = (name, req) => {
  fs.readFile('./public/css/' + name, "utf8", function read(err, data) {
    if (err) {
      throw err;
    }
    let content = data;
    req.custom7.push(content);
    return content;
  });
  console.log(" req.custom7:", req.custom7.length);
}


const UpdateCSSFile = (cssName, id, data, Muokattu_Tiedosto, req, next) =>
  database.UpdateCSSFile(id, data, Muokattu_Tiedosto, connection, (results) => {
    //req.custom6 = results;
    // req.custom6[id-1].push(results);
    saveCSSFiles(cssName, results[0].Muokattu_Tiedosto);

    req.custom6[id - 1] = (results[0].Muokattu_Tiedosto);
    console.log("id: ", id, " req.custom6[" + id + "] ", req.custom6[id - 1].length);
    next();
  });



const UpdateCSSFile2 = (Muokattu_Tiedosto, req, next) =>
  database.UpdateCSSFile2(Muokattu_Tiedosto, connection, (results) => {

    req.custom8 = results;
    next();
  });

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

    req.custom = results;
    next();
  });
};

const SelectCSSMediaQueryPositions3 = (data, req, next) => {
  database.SelectCSSMediaQueryPositions3(data, connection, (results) => {

    req.custom.push(results);
    next();
  });
};
//SelectCSSMediaQueryPositions3_2
const SelectCSSMediaQueryPositions32 = (data, req, next) => {
  database.SelectCSSMediaQueryPositions32(data, connection, (results) => {

    req.custom.push(results);
    next();
  });
};

const SelectCSSMediaQueryPositions3_2 = (data, req, next) => {
  database.SelectCSSMediaQueryPositions3_2(data, connection, (results) => {

    req.custom.push(results);
    next();
  });
};


const findScreenSize = (data, req, next) => {
  database.selectScreenSize(data, connection, (results) => {

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

const checkIfLastRowContainsMediaQuery = (newCss, cutPoint) => {
  // console.log("checkIfLastRowContainsMediaQuery = (newCss: ",newCss);
  let n = newCss.lastIndexOf("@media");
  console.log("checkIfLastRowContainsMediaQuery , n: " + n);
  let arrToBeReturned = [];
  if (cutPoint < n) {
    console.log("Ei ylimääräistä Mediaquerya");
    arrToBeReturned.push(false, cutPoint);
    return arrToBeReturned;
  } else {
    console.log("Ylimääräinen @media query viimeisellä rivillä");
    arrToBeReturned.push(true, n);
    return arrToBeReturned;
  }
}

const modifyCSSFile = (CssFile, cut) => {

  let newCss = CssFile.slice(0, cut);
  // console.log(newCss, " <---- Modified CSS tiedosto");
  //let n = newCss.lastIndexOf("@media"); 
  let checkLastRow = checkIfLastRowContainsMediaQuery(newCss, cut);
  if (checkLastRow[0] === true) {
    newCss = CssFile.slice(0, checkLastRow[1]); //Poista ylimääräinen @media query rikkomasta viimeiseltä riviltä
  }
  console.log("Leikkaa kohdasta: ", checkLastRow[1], " | checkLastRow(bool, numero) viimeinen rivi Css tiedostossa @media: ", checkLastRow);
  return newCss;
};

const modifyCSSFile2 = (CssFile, position, cut) => {
  let AmountCut = cut - position;
  // CssFile.replace(mediaQuery,"");
  console.log("AmountCut: ", AmountCut);
  let newCss = CssFile.slice(position, cut);
  return newCss;
};

const modifyCSSFile3 = (CssFileString, mediaQuery) => {

  let replaceString = CssFileString.split(mediaQuery).join("");
  // replaceString = replaceString.split('"').join("");
  console.log(replaceString, " <--- replaceString modifyCSSFile3");
  return replaceString;
};


const modifyCSSFile4 = (CssFileString, mediaQuery) => {
  let re = '#container[data-size="small"] #fetchatti { ';
  let replaceString = CssFileString.split(mediaQuery).join(re);
  // replaceString = replaceString.split('"').join("");
  console.log(replaceString, " <--- replaceString modifyCSSFile4");
  return replaceString;
};




const refactorCssFileName = (toBeRenamed, num) => {
  let fiveLastChar = toBeRenamed.slice(-2);
  let cssName = fiveLastChar + num + '.css';
  return cssName;
}

app.post('/checkScreenSize', (req, res, next) => {
  // console.log("req.body: ", req.body);
  console.log("req.body: ", req.body.width);
  const data = [req.body.width, req.body.height];
  console.log("Data App.js ", data);
  req.arr = [];
  req.custom = [];
  req.custom6 = [];
  req.custom7 = [];
  req.CutAll = [];
  // PalautaFrontendiin(data, req, next);
  next();
});

app.use('/checkScreenSize', (req, res, next) => {
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions3(data, req, next);
});

app.use('/checkScreenSize', (req, res, next) => {
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions32(data, req, next);
});

app.use('/checkScreenSize', (req, res, next) => {
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions4(data, req, next);
});

app.use('/checkScreenSize', (req, res, next) => {
  console.log("");
  console.log("_______________");
 //// console.log("req.custom4 ", req.custom4);
  console.log("");
  console.log("_______________");
  //console.log("req.custom ",req.custom);
  //req.custom2.arr = [];
  // console.log(req.custom[0].TextToClearPosition);
  let arrOfId = [];
  let secondArr = [];
  for (let i = 0; i < req.custom4.length; i++) {
  // console.log("SelectCSSFile(req.custom4[" + i + "].CSS_File, req, next);")
    if (!arrOfId.includes(req.custom4[i].CSS_File_ID)) {
      arrOfId.push(req.custom4[i].CSS_File_ID);
    }
    secondArr.push(req.custom4[i].CSS_File_ID);
    
  }
  console.log("arrOfId: ", arrOfId);
  console.log("secondArr: ", secondArr);

  SelectCSSFileByID(arrOfId, req, next); //Ota kaikki Idt talteen req.custom[5].CSS_Id
  //  next();
});

app.use('/checkScreenSize', (req, res, next) => {
  let n = req.custom5.length;
  for (let i = 1; i < n + 1; i++) {
    req.custom6.push([""]);
  }

  next();
});

function sliceString(str,start,end,amounttimes){ //cssfile, arr,arr,j
 
 // console.log();

  console.log("SLICE STRING start:",start);
//  console.log(red,start);
//  console.log(yellow,end);
  console.log(blue,amounttimes,reset);
  let newStart = start; //arr
  let newEnd = end;
  let amountCut = 0;
  let amountCutArr = [];
  for(let i=0; i<amounttimes;i++){
  //  console.log("str PITUUS ",str.length);
  let subString = str.substr(newStart[i],newEnd[i]);
  amountCut = (newEnd[i]-newStart[i]);
  amountCutArr.push(amountCut);
   // console.log("newStart",newStart[i]," newEnd",newEnd[i]," subString.pituus: ",subString.length, " amountCut ",amountCut);
  
   str = str.slice(newStart[i],newEnd[i]);

 console.log("amountCut: ",amountCut);
    if(i <amounttimes){
  //  console.log(yellow,"newStart",newStart[i+1]," newEnd",newEnd[i+1]," subString.pituus: ",subString.length, " amountCut ",amountCut,reset);
//    newStart[i+1] -= amountCut; //Seuraava
  //  newEnd[i+1] -= amountCut;
    
   // console.log("newStart"+newStart[i], " next: ",newStart[i+1]);
  //  console.log("newEnd"+newEnd[i], " next: ",newEnd[i+1]);
    }
  }
//  console.log("amountCutArr ",amountCutArr);
  return str;
}

function createLoop(id,n){
  console.log("id: ",id," n: ",n);
  let newId = id;
  let arrOfNums = [];
  arrOfNums.push(["Arr"+0]);
  for(let i=0; i<n;i++){
    if(newId[i]==id[i+1]){
      arrOfNums.push(["Arr"+(id+1)]);
    }else{
      arrOfNums[i].push([id[i]])
    }
  }
 // console.log("arrOfNums ",arrOfNums);
  return arrOfNums;
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}


app.use('/checkScreenSize', (req, res, next) => {
  
  let startArr = [];
  let endArr = [];

  let arrOfId = [];
  let secondArr = [];
for (let i = 0; i < req.custom4.length; i++) {
  startArr.push([]);
  endArr.push([]);
 // console.log("SelectCSSFile(req.custom4[" + i + "].CSS_File, req, next);")
   if (!arrOfId.includes(req.custom4[i].CSS_File_ID)) {
     arrOfId.push(req.custom4[i].CSS_File_ID);
   }
   secondArr.push(req.custom4[i].CSS_File_ID);
   startArr[i].push([req.custom4[i].CSS_File_ID,req.custom4[i].Position]);
   endArr[i].push([req.custom4[i].CSS_File_ID,req.custom4[i].Position]);
 }
 let num = 1;
 let resset = false;
 for (let i = 0; i < secondArr.length; i++) {
   if(resset==true){
    num = i+1;
    resset = false;
    console.log("RESET NUM",num);
   }
   
  if (startArr[i][0][0] == num) {
    console.log("SISÄLTÄÄÄ  ",startArr[i][0][0]);
    secondArr.push([startArr[i][0][0]]);
  }else{
    console.log("Ei ",startArr[i][0][0]);
    resset = true;
  }
 }

  console.log("secondArr",secondArr);
  let lastNum = startArr[0][0][0];
  let pituudet = [];
  let lastNumLength = 0;
  let bool = false;

  

  for(let i=0; i<startArr.length; i++){
    if(i<req.custom5.length){
      //pituudet.push([i]);
    }
    for(let j=0; j<startArr[i].length;j++){
      console.log("startArr["+i+"]["+j+"]",startArr[i][j][1]);

     
  
      lastNumLength = i;
     
      if(startArr[i][j][0] > lastNum){
        lastNumLength -= 1;
        pituudet.push([lastNumLength]);
        lastNum = startArr[i][j][0];
        lastNumLength = 0; 
    }
  }
 
 

  }
  let nums = [];
  let last = 0;
  for(let p=0; p<startArr.length; p++){
  // console.log("startArr[p][0]",startArr[p][0][0]);
 //   Math.max(5, 10);
 nums.push(startArr[p][0][0]);
 last = startArr[p][0][0];
  }

  var unique = nums.filter( onlyUnique );
  console.log("unique unique unique",unique, "  last: ",last);

  for(let p=0; p<unique.length; p++){
   
   // if()
   // console.log(unique[p]);
  // nums.push(startArr[p][0][0]);
 //  last = startArr[p][0][0];
    }
  

  let m = sliceString(req.custom5[0].Muokattu_Tiedosto,startArr,endArr,3);
  let name = "UUSIIIIII";//+i
 saveCSSFiles(name,m);
  for(let i=0; i<req.custom5.length; i++){
//    let m = sliceString(req.custom5[i].Muokattu_Tiedosto,startArr,endArr,3);
  //   let name = "UUSI"+i;
//     saveCSSFiles(name,m);
}
  
  /*
  let TempStart = [];
  let TempEnd = [];
  let p = 0;
  let latestL = 0;
  for(let k=0; k<pituudet.length; k++){
    let reset = false;
  //  console.log("ptiuudet k; ",pituudet[k]);
    console.log("ptiuudet k[0]; ",pituudet[k][0]);
    p = pituudet[k][0];
    console.log("k: ",k);
    for(let z=0;z<pituudet[k][0]; z++){
      TempStart.push([z]);
      k<0;
      latestL++;
//      console.log("ptiuudet k[z]; ",pituudet[z][0]);
      console.log("z: ",z);
      if(z<pituudet[k][0]){
     //   console.log("p : ",p, "latestL: ",latestL);
        TempStart[z].push(startArr[z]);
        TempEnd.push(startArr[z])
      }else{
        console.log("LAST")
      }
    }
    console.log("letTempStart",TempStart);
  //  let m = sliceString(req.custom5[pituudet[k][0]].Muokattu_Tiedosto,startArr,endArr,3);
    //    let name = "UUSI"+i;
    //    saveCSSFiles(name,m);
  }*/

/////////////////////////////////////

  let n = req.custom5.length;
  let temp = [];
 
  for (let i = 0; i < n; i++) {
    let Muokattu_Tiedosto2 = req.custom5[i].Muokattu_Tiedosto;
    let pituus = 0;
    let n2 = req.custom4.length;
    
 //   console.log("n2: ",n2);
 //   console.log("CSS_File_ID: ",req.custom4[i].CSS_File_ID);
 
    for (let j = 0; j < n2; j++) {
      temp.push(req.custom4[j].CSS_File_ID);
     
      let cutStart= req.custom4[j].Position;
      let cutEnd = req.custom4[j].LastIndexToClearPosition;
      let fullMq = req.custom4[j].FullMediaQuery;
      let id = req.custom5[i].CSS_Id;
      let Muokattu_Tiedosto = req.custom5[i].Muokattu_Tiedosto

      startArr[i].push(req.custom4[j].Position);
      endArr.push(req.custom4[j].LastIndexToClearPosition);
    //  console.log(blue, id, " <- CSS_Id, cutEnd: ",cutEnd," cutStart: ",cutStart, reset);
     // cutAllMediaQueriesByCssFileID(j,id,fullMq, Muokattu_Tiedosto, cutStart, cutEnd, req, next);
     pituus++;
    }
    let custom4pituus = req.custom4.length;
    console.log("pituus",pituus);
  //  let m = sliceString(req.custom5[i].Muokattu_Tiedosto,startArr,endArr,pituus);
   
   // UpdateCSSFile2(m,req,next);
   

  }


   next();
});
app.use('/checkScreenSize', (req, res, next) => {

  let custom4pituus = req.custom4.length;
  let tempArrOfMuokatut = []; //loopin aikaan laita css tiedostojen tiedot joita muokataan
  let diffCssFilesLength = req.custom5.length; //kaikki css tiedostot joissa on mediaqueryja
  for (let i = 0; i < custom4pituus; i++) {
    for (let j = 0; j < diffCssFilesLength; j++) {
      req.custom7.push([j]);
      if (req.custom5[j].CSS_Id === req.custom4[i].CSS_File_ID) {
        try {
          /*
                    let cutStart = req.custom4[i].Position;
                    let cutEnd = req.custom4[i].LastIndexToClearPosition; //FullMediaQuery; voi olla myös
          */
          let cssName = req.custom4[i].CSS_File; //Css tiedoston nimi
          /*
                   diffCssFilesLength.push([j,[cutStart,cutEnd]]);
              
        
            let cut2 = req.custom4[i].FullMediaQuery;
            cssName = refactorCssFileName(cssName, j);
           let mq2 =req.custom4[i].MediaQuery_Saanto
            */
          //var content = fs.readFileSync('./public/css/' + cssName, 'utf8');
          //  let cssFile = readFile(cssName,req);
          //  console.log(req.custom7);
          // console.log(cssFile," <-- CSS FILE");
          // let upFile = modifyCSSFile4(content, mq2);
          // console.log(cssFile);
          //  saveCSSFiles(cssName, upFile);

          //    saveCSSFiles(cssName, updatedFile);
      /*    console.log("cssName: ", cssName);
          console.log("______________________");
          console.log(" ");
          console.log("req.CutAll", req.CutAll.length);*/
          req.custom4[i].NewCss = cssName; //Lähetä uusi muokattu CSS filen nimi frontendiin
        } catch (e) { console.log("ERROR ", e) }
      }//jos on oikea id
    }//j looppi
  }
  res.send(req.custom4);
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
   }catch(e){}*/
  // console.log(req.body);
  // console.log(req.CssId[0].CSS_Id);
  res.send(req.custom);
});



module.exports = app;
