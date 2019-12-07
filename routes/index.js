var express = require('express');
var router = express.Router();
const expressValidator = require('express-validator');
var passport = require('passport');

const bcrypt = require('bcrypt');
const base64Img = require('base64-img');



const multer = require('multer');
const upload = multer({dest: 'images/'});
const saltRounds = 10;
/* GET home page. */

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

router.get('/', function(req, res){
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', { title: 'Home' });
});

router.get('/profile',authenticationMiddleware(), function (req, res){
  res.render('profile',{ title: 'Profile'})
});

router.get('/profileHomePage',authenticationMiddleware(), function (req, res){
  res.render('profileHomePage',{ title: 'Moblile Customize'})
});


router.get('/mobileCustomize',authenticationMiddleware(), function (req, res){
  res.render('mobileCustomize',{ title: 'Moblile Customize'})
});


router.get('/resetpw', authenticationMiddleware(), function(req, res){
  res.render('resetpw', {title:'Reset password'})
});

router.get('/login', function (req, res){
  res.render('login',{ title: 'Login'})
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

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.post('/register', function(req, res, next)
{

  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-100 characters long.').len(5, 100);


  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

  const errors = req.validationErrors();

  if(errors){
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

    bcrypt.hash(password, saltRounds, function(err, hash) {
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hash], function(error, results, fields) {
            if (error) throw error;

            db.query('SELECT LAST_INSERT_ID() as user_id',
                function(error, results, fields) {
                  if (error) throw error;

                  const user_id = results[0];

                  console.log(results[0]);
                  req.login(user_id, function(err) {
                    res.redirect('/');
                  });
                });
          })
    });

  }
});

passport.serializeUser(function(user_id, done) {
  done(null,user_id);
});

passport.deserializeUser(function(user_id, done) {

    done(null, user_id);

});
function authenticationMiddleware () {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();
    res.redirect('/login')
  }
}
/* BACKUP
router.post('/upload', function (req, res, next){
  console.log("/upload POST request toimii");
  console.log(req.body);
  next();
}); */
const kuva = (kuva) => {
  console.log("KUVA", kuva);
  let data = base64Img.base64Sync('images/'+kuva);
//  console.log(data);
  return data;
};

const haeKayttajaId = (user) =>{
  let id = user.user_id;
  console.log("Käyttäjän id: ",id);
  return id;
};


router.post('/upload', upload.single('kuva'), (req, res, next) => {

  console.log("FILE NAME:",req.file.filename);
  next();
});
router.use('/upload', (req, res, next) => {
//  console.log("FILE NAME2:",req.file.filename);
  let id = haeKayttajaId(req.session.passport.user)
let kuva_nimi = req.file.filename;
 let base64string = kuva(req.file.filename);

  //TEE Functio millä haet kuvan kansiosta "./images/+"req.body.filename

  const data = [kuva_nimi,base64string, id];
  const query = 'INSERT INTO kuvat (kuva_Nimi, Base64, User_id) VALUES (?, ?, ?)';

  const db = require('../db.js');

  function test() { //Jotta SQL query toimii, tee erillinen functio jonka sisällä query on. Kutsu tätä functiota sen alla. Muista Next() db.queryn sisään

    db.query(query, data, function(error, results, fields) {
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
    let query2 = 'SELECT Base64 FROM kuvat WHERE User_id = ' + haeKayttajaId(req.session.passport.user)+ ';';
        console.log(query2);
    db.query(query2,
        function(error, results, fields) {
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


router.post('/resetpw', (req, res, next)=>
{
  let id = haeKayttajaId(req.session.passport.user);

  const password = req.body.password;

  console.log("TOIMIIKOHAH",password);

  const db = require('../db.js');

  bcrypt.hash(password, saltRounds, function(err, hash) {

      let query3 = 'UPDATE users SET password="'+hash+'" WHERE id="'+id+'";';
      console.log("QUERY3ON:",query3);
      db.query(query3,
          function(error, results, fields) {
            if (error) throw error;
            req.custom = results;
            res.redirect('/')
          });
        })
  });


router.get('/getUserInformation', (req, res, next) => {
  console.log("post '/getUserInformation' successfull");
  let id = haeKayttajaId(req.session.passport.user);

  const db = require('../db.js');
  function haeKuvat() {
    let query = 'SELECT kuva_Nimi FROM kuvat WHERE User_id = ' +id+ ';';
    db.query(query,
        function(error, results, fields) {
          if (error) throw error;

          let sizeArr = [];

          for(let i=0; i<results; i++){
            sizeArr.push(result[i]);
          }
          let images = {
            size: sizeArr,
          }
          req.custom = images;
          console.log("req.custom:",req.custom);
          next();
        });
  }
  haeKuvat();
});

router.use('/getUserInformation', (req, res, next) => {
  res.send(req.custom);
});


module.exports = router;
