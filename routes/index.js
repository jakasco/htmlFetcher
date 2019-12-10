var express = require('express');
var router = express.Router();
const expressValidator = require('express-validator');
var passport = require('passport');

const bcrypt = require('bcrypt');
const base64Img = require('base64-img');

const http = require('http');

const fs = require('fs');
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: 'images/' });
const temp = multer({ dest: 'public/temp/' });
const saltRounds = 10;

const database = require('../modules/database.js');
//värit

const reset = "\x1b[0m";

const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";

//////////////////////////////////////////////////////////////////////     Tietokanta queryt
const insertToDB = (data, connection, res, next) => {
  database.insertUser(data, connection, () => {
    next();
  });
};

const insertCssFile = (data, connection, res, next) => {
  database.insertCssFile(data, connection, () => {
    next();
  });
};

const SelectCSSFile = (data, connection, req, next) => {
  database.SelectCSSFile(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const SelectCSSFilesID = (data, connection, req, next) => {
  database.SelectCSSFilesID(data, connection, (results) => {
    req.CssId = results;
    next();
  });
};

const resetCssFiles = (connection, req, next) => {
  database.resetCssFiles(connection, (results) => {
    req.custom = results;

    next();
  });
};

const insertToDB2 = (data, connection, req, next) => {
  database.insertIntoMediaQueryTable(data, connection, () => {
    next();
  });
};

const PalautaFrontendiin = (data, connection, req, next) => {
  database.select(data, connection, (results) => {

    req.custom = results;
    next();
  });
};

const SelectCSSFileByID = (idArr, connection, req, next) => {
  database.SelectCSSFileByID(idArr, connection, (results) => {
    req.custom5 = results;
    next();
  });
};

const SelectCSSMediaQueryPositions3 = (data, connection, req, next) => {
  database.SelectCSSMediaQueryPositions3(data, connection, (results) => {

    req.custom.push(results);
    next();
  });
};

const SelectCSSMediaQueryPositions32 = (data, connection, req, next) => {
  database.SelectCSSMediaQueryPositions32(data, connection, (results) => {

    req.custom.push(results);
    next();
  });
};

const SelectCSSMediaQueryPositions4 = (data, connection, req, next) => {
  database.SelectCSSMediaQueryPositions4(data, connection, (results) => {
    req.custom4 = results;
    next();
  });
};

const findScreenMediaQuery = (data, connection, req, next) => {
  database.selectMediaQuery(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////

/*    FUNCTIOT  */

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();
    res.redirect('/login')
  }
}

const kuva = (kuva) => {
  console.log("KUVA", kuva);
  let data = base64Img.base64Sync('images/' + kuva);
  //  console.log(data);
  return data;
};

const kuva2 = (kuva) => {
  let data = base64Img.base64Sync('public/temp/' + kuva);
  return data;
};

const haeKayttajaId = (user) => {
  let id = user.user_id;
  console.log("Käyttäjän id: ", id);
  return id;
};


const saveCSSFiles = (name, value) => {
  console.log("saveCSSFiles: " + name);
  const nameOfCss = name;
  const cssPath = path.join(__dirname, '../public', 'css', 'tempCss', nameOfCss);
  fs.open(cssPath, "w", function (err, file) { //Tallenna uusi CSS File 
    if (err) throw err;
    console.log('Saved!');
  });

  fs.appendFile(cssPath, value, function (err) { //Lisää CSS tiedoston sisään
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

function sliceString(str, start, end, amounttimes) { //cssfile, arr,arr,j

  console.log(blue, amounttimes, reset);
  let newStart = start; //arr
  let newEnd = end;
  let amountCut = 0;
  let amountCutArr = [];
  for (let i = 0; i < amounttimes; i++) {
    let subString = str.substr(newStart[i], newEnd[i]);
    amountCut = (newEnd[i] - newStart[i]);
    amountCutArr.push(amountCut);
    str = str.slice(newStart[i], newEnd[i]);
  }
  return str;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
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

const decimalToint = (value) => {
  return value | 0;
}

const empxConversion = (value) => { //Muuta em intiksi
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
    MediaQuery = Arr[i].replace(/ /g, '').toString(); //ota tyhjat valit poist
    let first = MediaQuery.indexOf(":");  // @media screen and (min-width
    let n = MediaQuery.indexOf(")");

    let value = MediaQuery.slice((first + 1), (n));

    if (value.endsWith("e")) { //tarkasta ettei lopu em e tai px p
      value += "m";
    } else if (value.endsWith("p")) {
      value += "x";
    }
    value = empxConversion(value); //convertoi intiksi
    tempArr.push(value);

  }
  return tempArr;
};

const manipulateString4 = (PartOfArray, match) => {

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
    value = empxConversion(value); //convertoi intiksi
  }
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

const findMWH = (arr, match) => {

  for (let i = 0; i < arr.length; i++) { //0 on Boolean
    for (let j = 0; j < arr[i].length; j++) {
      let contain = (arr[i][j][0].indexOf(match) > -1);
      if (contain === true) {
        return arr[i][j]; //j+1 on luku, j on min-width
      }
    }
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
  } catch (e) { }
  return arr;
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

///////////////////////////////////////////////////////////////////////////////////////////////////
/* GET home page. */

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

router.get('/', function (req, res) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', { title: 'Home' });
});
///////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/profile', authenticationMiddleware(), function (req, res) {
  res.render('profile', { title: 'Profile' })
});

router.get('/profileHomePage', authenticationMiddleware(), function (req, res) {
  res.render('profileHomePage', { title: 'Moblile Customize' })
});

router.get('/mobileCustomize', authenticationMiddleware(), function (req, res) {
  res.render('mobileCustomize', { title: 'Moblile Customize' })
});

router.get('/resetpw', authenticationMiddleware(), function (req, res) {
  res.render('resetpw', { title: 'Reset password' })
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' })
});

router.post('/login', passport.authenticate(
  'local', {
  successRedirect: '/',
  failureRedirect: '/login'
}
));

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
})
///////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.post('/register', function (req, res, next) {

  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-100 characters long.').len(5, 100);


  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    console.log(`errors: ${JSON.stringify(errors)}`);



    res.render('register', {
      title: 'Registration error',
      errors: errors
    });

  } else {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const db = require('../db.js');

    bcrypt.hash(password, saltRounds, function (err, hash) {
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash], function (error, results, fields) {
          if (error) throw error;

          db.query('SELECT LAST_INSERT_ID() as user_id',
            function (error, results, fields) {
              if (error) throw error;

              const user_id = results[0];

              console.log(results[0]);
              req.login(user_id, function (err) {
                res.redirect('/');
              });
            });
        })
    });

  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////

passport.serializeUser(function (user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {

  done(null, user_id);

});


/////////////////////////////////////////////////////////////////////////////////////////////////// Tallenna sivun Mediat tietokantaan

router.post('/saveTemp', (req, res, next) => { //Tallenna fetchattu Media väliaikaisesti tiedostona
  let urlOfImg = req.body.url;
  let imgDestName = "tempFile2" + req.body.type;

  const imgPath = path.join(__dirname, '../public', 'temp', imgDestName);
  req.file = { filename: imgPath };
  console.log(yellow, "req.file", req.file);

  const file = fs.createWriteStream(imgPath);

  const request = http.get(urlOfImg, function (response) {
    console.log("save file: ", red, urlOfImg, reset);
    console.log("to: ", yellow, imgPath, reset);
    response.pipe(file);
    file.on('finish', function () {
      console.log(blue, "FILE SAVED", reset);

      let id = haeKayttajaId(req.session.passport.user)
      let kuva_nimi = "tempFile2.jpg";
      let base64string = kuva2(kuva_nimi);
      console.log("req.file", req.file);

      let originalname = urlOfImg;
      let encoding = "";
      let mimetype = "jpg";
      let dest = "./public/temp";
      let path = "";
      let size = "";
      const data = [kuva_nimi, base64string, id, originalname, encoding, mimetype, dest, path, size];

      const query2 = 'SELECT originalname FROM kuvat WHERE User_id = ' + id + ' AND kuva_nimi = "tempFile2.jpg" ;';

      const query = 'INSERT INTO kuvat (kuva_Nimi, Base64, User_id, originalname, encoding, mimetype, destination, path, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

      const db = require('../db.js');

      function test() { //Jotta SQL query toimii, tee erillinen functio jonka sisällä query on. Kutsu tätä functiota sen alla. Muista Next() db.queryn sisään

        db.query(query2, data, function (error, results2, fields) {
          console.log(query);
          if (error) throw error;
          console.log("results2: ", results2[0].originalname);
          if (results2[0].originalname !== originalname) {
            db.query(query, data, function (error, results, fields) {
              console.log(query);
              if (error) throw error;
              next();
            });
          } else {
            console.log(green, "Kuva on jo tietokannassa! ", reset);
            next(); //Jos kuva on jo tietokannassa, niin next
          }
        });
      }
      test();
    });
  });
  request(imgPath, res);

});

router.use('/saveTemp', (req, res, next) => {
  res.send(req.file);
});


router.post('/removeTemp', (req, res) => {  //poista teidosto temp kansiosta kun se on tallennettu tietokantaan
  let urlOfImg = req.body.url;
  req.Removed = [{ success: "File Removed From Temp Folder!" }];
  fs.unlinkSync(urlOfImg);
  res.send(req.file);
});
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/upload', upload.single('kuva'), (req, res, next) => {
  if (req.body.file !== null || typeof req.body.file !== 'undefined') {
    console.log(red, "FILE ", req.body, reset);
  } else {
    console.log("FILE NAME:", req.file.filename);
  }
  next();
});
router.use('/upload', (req, res, next) => {
  //  console.log("FILE NAME2:",req.file.filename);
  let id = haeKayttajaId(req.session.passport.user)
  let kuva_nimi = req.file.filename;
  let base64string = kuva(req.file.filename);
  console.log("req.file", req.file);

  let originalname = req.file.originalname;
  let encoding = req.file.encoding;
  let mimetype = req.file.mimetype;
  let dest = req.file.destination;
  let path = req.file.path;
  let size = req.file.size;

  //TEE Functio millä haet kuvan kansiosta "./images/+"req.body.filename

  const data = [kuva_nimi, base64string, id, originalname, encoding, mimetype, dest, path, size];
  const query = 'INSERT INTO kuvat (kuva_Nimi, Base64, User_id, originalname, encoding, mimetype, destination, path, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const db = require('../db.js');

  function test() { //Jotta SQL query toimii, tee erillinen functio jonka sisällä query on. Kutsu tätä functiota sen alla. Muista Next() db.queryn sisään

    db.query(query, data, function (error, results, fields) {
      console.log(query);
      if (error) throw error;
      next();
    }); //SQL LAUSE LOPPUU
  }
  test();
});
router.use('/upload', (req, res, next) => {

  const db = require('../db.js');
  console.log("Päästään Insert DB kohdan yli");
  function test2() {
    let query2 = 'SELECT Base64 FROM kuvat WHERE User_id = ' + haeKayttajaId(req.session.passport.user) + ';';
    console.log(query2);
    db.query(query2,
      function (error, results, fields) {
        if (error) throw error;

        req.custom = results;
        next();

      });
  }
  test2();
});

router.use('/upload', (req, res, next) => {
  console.log("Päästään SELECT kohdan yli");
  res.send(req.custom);

});

///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/resetpw', (req, res, next) => {
  let id = haeKayttajaId(req.session.passport.user);

  const password = req.body.password;

  console.log("TOIMIIKOHAH", password);

  const db = require('../db.js');

  bcrypt.hash(password, saltRounds, function (err, hash) {

    let query3 = 'UPDATE users SET password="' + hash + '" WHERE id="' + id + '";';
    console.log("QUERY3ON:", query3);
    db.query(query3,
      function (error, results, fields) {
        if (error) throw error;
        req.custom = results;
        res.redirect('/')
      });
  })
});

/////////////////////////////////////////////////////////////////////////////////////////////////// Hae tietokannasta käyttäjän tiedot
router.get('/getUserInformation', (req, res, next) => {
  console.log("post '/getUserInformation' successfull");
  let id = haeKayttajaId(req.session.passport.user);

  const db = require('../db.js');

  function haeKuvat() {
    let query = 'SELECT size FROM kuvat WHERE User_id = ' + id + ';';
    db.query(query,
      function (error, results, fields) {
        if (error) throw error;

        let sizeArr = [];
        console.log("results.length:", results.length);
        for (let i = 0; i < results.length; i++) {
          console.log(i + ":", results[0]);
          sizeArr.push(results[i]);
        }
        let images = {
          size: sizeArr,
        }
        req.images = images;
        console.log("req.images:", req.images);
        next();
      });
  }
  haeKuvat();
});

router.use('/getUserInformation', (req, res, next) => {
  let id = haeKayttajaId(req.session.passport.user);
  const db = require('../db.js');
  function haeKayttajaNimi() {
    let query = 'SELECT username FROM users WHERE id = ' + id + ';';
    db.query(query,
      function (error, results, fields) {
        if (error) throw error;
        let username = results[0].username;
        req.username = username;
        console.log("req.username:", req.username);
        next();
      });
  }
  haeKayttajaNimi();
});

router.use('/getUserInformation', (req, res, next) => {
  let id = haeKayttajaId(req.session.passport.user);
  const db = require('../db.js');
  function haeLahdekoodit() {
    let select = 'SELECT Source_Code,CSS_Files FROM usersourcecode WHERE User_Id =' + id + ';';
    db.query(select,
      function (error, results, fields) {
        if (error) throw error;
        let html = results[0].Source_Code;
        let css = results[0].CSS_Files;
        req.sourceCode = results;
        next();
      });
  }
  haeLahdekoodit();
});


router.use('/getUserInformation', (req, res, next) => {

  let json = [req.images, req.username,req.sourceCode];

  req.custom = json;
  console.log("req.custom: ", req.custom);
  res.send(req.custom);
});
////////////////////////////////////////////////////////////
router.post('/asd', (req, res, next) => {

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

///////////////////////////////////////////////////////////////////////////////////////////////////
router.use('/asd', (req, res, next) => {
  const db = require('../db.js');
  PalautaFrontendiin("null toistaiseksi", db, req, next);
});
router.use('/asd', (req, res, next) => {

  res.send(req.custom);
});

///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//Etsi MEDIA QUERY JOKA SOPII #Fethcatti width:n kokoon
router.post('/findMediaQuery', (req, res, next) => {
  const db = require('../db.js');
  let data = [req.body.width, req.body.height];
  findScreenMediaQuery(data, db, req, next);
});
router.use('/findMediaQuery', (req, res, next) => {
  const db = require('../db.js');
  for (let i = 0; i < req.custom.length; i++) {
    findScreenMediaQuery2(req.custom[i], db, req, next);
  }
});
router.use('/findMediaQuery', (req, res, next) => {
  res.send(req.custom);
});

///////////////////////////////////////////////////////////////////////////////////////////////////

/////Palauta Muokattu_CSS alkuperäiseksi
router.post('/resetCssFiles', (req, res, next) => {
  const db = require('../db.js');
  resetCssFiles(db, req, next);
});
router.use('/resetCssFiles', (req, res, next) => {
  res.send(req.body);
});

///////////////////////////////////////////////////////////////////////////////////////////////////

//Tallenna CSS TIEDOSTO
router.post('/tallennaCSStiedosto', (req, res, next) => {
  const db = require('../db.js');
  SelectCSSFile(req.body.CssArr[0], db, req, next); //req.body.CssArr[0] on CSS_Tiedoston nimi,
  //Frontendissä käydään looppi missä on kaikki nämä
});

router.use('/tallennaCSStiedosto', (req, res, next) => {
  const db = require('../db.js');
  if (req.custom.length === 0) { //Jos ei ole sisältöä req.customissa, laita sinne
    let data = [int, req.body.CssArr[0], req.body.CssArr[1]];
    console.log("insertCssFile");
    insertCssFile(data, db, req, next); //Lisää CSS Tiedosto ja sen nimi tietokantaan
  } else {
    console.log("DONT insertCssFile");
    next();
  }
});

router.use('/tallennaCSStiedosto', (req, res, next) => {

  if (req.custom.length === 0) { //Jos ei ole sisältöä req.customissa, laita sinne
    let fiveLastChar = req.body.CssArr[0].slice(-2);
    let cssName = fiveLastChar + '.css';//req.body.CssArr[0]+'.css';
    saveCSSFiles(cssName, req.body.CssArr[1]);
  }
  res.send(req.body);
});

///////////////////////////////////////////////////////////////////////////////////////////////////

//Tallenna Kaikki Mediaqueryt tietokantaan
router.post('/checkScreenSize2', (req, res, next) => {
  const db = require('../db.js');
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

  insertToDB2(data, db, req, next);
});

router.use('/checkScreenSize2', (req, res, next) => {
  res.send(req.body);
});
/////////////////////////////////////////////////////////////////////////////////////// CheckSceenSize

router.post('/checkScreenSize', (req, res, next) => {
  const data = [req.body.width, req.body.height];
  console.log("Data App.js ", data);
  req.arr = [];
  req.custom = [];
  req.custom6 = [];
  req.custom7 = [];
  req.CutAll = [];
  next();
});

router.use('/checkScreenSize', (req, res, next) => {
  const db = require('../db.js');
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions3(data, db, req, next);
});

router.use('/checkScreenSize', (req, res, next) => {
  const db = require('../db.js');
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions32(data, db, req, next);
});

router.use('/checkScreenSize', (req, res, next) => {
  const db = require('../db.js');
  const data = [req.body.width, req.body.height];
  SelectCSSMediaQueryPositions4(data, db, req, next);
});

router.use('/checkScreenSize', (req, res, next) => {

  const db = require('../db.js');
  console.log("");
  console.log("_______________");
  let arrOfId = [];
  let secondArr = [];
  for (let i = 0; i < req.custom4.length; i++) {
    if (!arrOfId.includes(req.custom4[i].CSS_File_ID)) {
      arrOfId.push(req.custom4[i].CSS_File_ID);
    }
    secondArr.push(req.custom4[i].CSS_File_ID);
  }
  console.log("arrOfId: ", arrOfId);
  console.log("secondArr: ", secondArr);

  SelectCSSFileByID(arrOfId, db, req, next); //Ota kaikki Idt talteen req.custom[5].CSS_Id
});

router.use('/checkScreenSize', (req, res, next) => {
  let n = req.custom5.length;
  for (let i = 1; i < n + 1; i++) {
    req.custom6.push([""]);
  }
  next();
});
/*
router.use('/checkScreenSize', (req, res, next) => {

  let startArr = [];
  let endArr = [];

  let arrOfId = [];
  let secondArr = [];
  for (let i = 0; i < req.custom4.length; i++) {
    startArr.push([]);
    endArr.push([]);
    if (!arrOfId.includes(req.custom4[i].CSS_File_ID)) {
      arrOfId.push(req.custom4[i].CSS_File_ID);
    }
    secondArr.push(req.custom4[i].CSS_File_ID);
    startArr[i].push([req.custom4[i].CSS_File_ID, req.custom4[i].Position]);
    endArr[i].push([req.custom4[i].CSS_File_ID, req.custom4[i].Position]);
  }
  let num = 1;
  let resset = false;
  for (let i = 0; i < secondArr.length; i++) {
    if (resset == true) {
      num = i + 1;
      resset = false;
      console.log("RESET NUM", num);
    }

    if (startArr[i][0][0] == num) {
      console.log("SISÄLTÄÄÄ  ", startArr[i][0][0]);
      secondArr.push([startArr[i][0][0]]);
    } else {
      console.log("Ei ", startArr[i][0][0]);
      resset = true;
    }
  }

  let lastNum = startArr[0][0][0];
  let pituudet = [];
  let lastNumLength = 0;

  for (let i = 0; i < startArr.length; i++) {
    for (let j = 0; j < startArr[i].length; j++) {
      console.log("startArr[" + i + "][" + j + "]", startArr[i][j][1]);
      lastNumLength = i;
      if (startArr[i][j][0] > lastNum) {
        lastNumLength -= 1;
        pituudet.push([lastNumLength]);
        lastNum = startArr[i][j][0];
        lastNumLength = 0;
      }
    }
  }
  let nums = [];
  let last = 0;
  for (let p = 0; p < startArr.length; p++) {
    nums.push(startArr[p][0][0]);
    last = startArr[p][0][0];
  }

  let unique = nums.filter(onlyUnique);
  console.log("unique unique unique", unique, "  last: ", last);

  let m = sliceString(req.custom5[0].Muokattu_Tiedosto, startArr, endArr, 3);
  let name = "uusiCss.css";//+i
  saveCSSFiles(name, m);
  let n = req.custom5.length;
  let temp = [];

  for (let i = 0; i < n; i++) {
    let Muokattu_Tiedosto2 = req.custom5[i].Muokattu_Tiedosto;
    let pituus = 0;
    let n2 = req.custom4.length;

    for (let j = 0; j < n2; j++) {
      temp.push(req.custom4[j].CSS_File_ID);

      let cutStart = req.custom4[j].Position;
      let cutEnd = req.custom4[j].LastIndexToClearPosition;
      let fullMq = req.custom4[j].FullMediaQuery;
      let id = req.custom5[i].CSS_Id;
      let Muokattu_Tiedosto = req.custom5[i].Muokattu_Tiedosto

      startArr[i].push(req.custom4[j].Position);
      endArr.push(req.custom4[j].LastIndexToClearPosition);
      pituus++;
    }
    let custom4pituus = req.custom4.length;
    console.log("pituus", pituus);
  }
  next();
});
*/
const refactorCssFileName = (toBeRenamed, num) => {
  let fiveLastChar = toBeRenamed.slice(-2);
  let cssName = fiveLastChar + num + '.css';
  return cssName;
}

router.use('/checkScreenSize', (req, res, next) => {

  let custom4pituus = req.custom4.length;
  let tempArrOfMuokatut = []; //loopin aikaan laita css tiedostojen tiedot joita muokataan
  let diffCssFilesLength = req.custom5.length; //kaikki css tiedostot joissa on mediaqueryja
  for (let i = 0; i < custom4pituus; i++) {
    for (let j = 0; j < diffCssFilesLength; j++) {
      req.custom7.push([j]);
      if (req.custom5[j].CSS_Id === req.custom4[i].CSS_File_ID) {
        try {

          let cutStart = req.custom4[i].Position;
          let cutEnd = req.custom4[i].LastIndexToClearPosition; //FullMediaQuery; voi olla myös

          let cssName = req.custom4[i].CSS_File; //Css tiedoston nimi

          cssName = i + "i" + refactorCssFileName(cssName, j);
          let upFile = req.custom5[i].Muokattu_Tiedosto;

          let mq2 = req.custom4[i].MediaQuery_Saanto;
          upFile = modifyCSSFile2(req.custom5[i].Muokattu_Tiedosto, cutStart, cutEnd);
          saveCSSFiles(cssName, upFile); //jos ei ole olemassa
          console.log("cssName: ", cssName);

          req.custom4[i].NewCss = cssName; //Lähetä uusi muokattu CSS filen nimi frontendiin
        } catch (e) { console.log("ERROR ", e) }
      }//jos on oikea id
    }//j looppi
  }
  res.send(req.custom4);
});
/////////////////////////////////////////////////////////////////////////////////////7


router.post('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {
  const db = require('../db.js');
  SelectCSSFilesID(req.body.CSS_File, db, req, next); //req.body.CssArr[0] on CSS_Tiedoston nimi,
});

router.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {
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

  } //IF 2d
  console.log("_______________");
  req.custom = data;

  if (data.length < 8) { //Tietokantaan 8 lokeroa
    data.push(null);
  }
  // insertTotallennaTietokantaanMediaQuerynPosition(data, res, next); //VAIHDA KUN TEHDÄÄN ENEMMÄN KUIN KERRAN
  next();
});

router.use('/tallennaTietokantaanMediaQuerynPosition', (req, res, next) => {
  try {
    console.log(req.custom[0].Position);
    console.log(req.custom[0].CSS_File);
  } catch (e) { }
  res.send(req.custom);
});

router.post('/saveSourceCode', (req, res, next) => {
  const db = require('../db.js');
  let id = haeKayttajaId(req.session.passport.user);
  let html = req.body.html;
  let css = req.body.cssFiles;

  let select = 'SELECT Source_Code FROM usersourcecode WHERE User_Id =' + id + ';';

  //let query = 'UPDATE usersourcecode SET Source_Code ="' + html + '" , CSS_Files='+css+' WHERE User_Id=' + id + ';';
  let insert = 'INSERT INTO usersourcecode (User_Id,Source_Code,CSS_Files) VALUES (?,?,?)';
  data = [id, html, css];
  function test() {
    db.query(select, data, function (error, results, fields) {
      if (error) throw error;
      if (results[0].Source_Code === html) { //Jos sama lähdekoodi on tallennettu ilman muutoksia
        next();
      } else {
        db.query(insert, data, function (error, results2, fields) {
          if (error) throw error;
          next();
        });
      }
    });
  }
  test();
  //   req.json = { color: null };
  //  res.send(req.json);
});

router.post('/saveSourceCode', (req, res, next) => {
  req.json = { saved: true };
  res.send(req.json);
});





module.exports = router;
