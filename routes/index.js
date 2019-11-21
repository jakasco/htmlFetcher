var express = require('express');
var router = express.Router();
var passport = require('passport');

const bcrypt = require('bcrypt');
const base64Img = require('base64-img');

const multer = require('multer');
const upload = multer({dest: 'images/'});
const saltRounds = 10;
/* GET home page. */

router.get('/', function(req, res){
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', { title: 'Home' });
});

router.get('/profile',authenticationMiddleware(), function (req, res){
  res.render('profile',{ title: 'Profile'})
});

router.get('/login', function (req, res){
  res.render('login',{ title: 'Login'})
});

router.post('/login', passport.authenticate(
    'local', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }
));

router.get('/logout', function (req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.post('/register', function(req, res, next)
{
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;


  const db = require('../db.js');

  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash], function(error, results, fields) {
          if (error) throw error;

          db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
            if(error) throw error;

            const user_id = results[0];

            console.log(results[0]);
            req.login(user_id, function(err) {
              res.redirect('/');
            })
          });
        })
  });
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

  //console.log("FILE NAME:",req.file.filename);
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

module.exports = router;
