'use strict';
// get the client
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const connect = () => {

// create the connection to database

  const connection = mysql.createConnection({
    host: 'localhost',
		user: 'root',
		password: '',
		database: 'mediaprojekti'
  });
  //Tarkastetaan saadaanko MySql yhteys
  connection.connect(function(error){
    if(!!error){
      console.log("Error to connect mySQL");
    }else{
      console.log("Connected to MySQL");
    }
  });
  return connection;
};



const insert = (data, connection, callback) => {
  var salt = bcrypt.genSaltSync(saltRounds);
   data[0] = bcrypt.hashSync(myPlaintextPassword, salt);
  connection.execute(
      'INSERT INTO testaus (kayttaja, test) VALUES (?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

const reportImage= (turha, connection, callback)=> {
  connection.execute(
      'update testaus set kayttaja = "asd" where test="asd";',
      (err, results) => {
        console.log(err);
        callback();
      },
  );
};

const PalautaFrontendiin = (data, connection, callback) => {
  console.log("Data (Ei käytetä tällä hetkellä toistaiseksi): ",data);
  connection.execute(
      "SELECT kayttaja FROM testaus WHERE test = 'testirivi2';",
      (err, results, fields) => {
        console.log("Results: ",results[0].kayttaja);
        //results[0].kayttaja <- DECRYPTAA

        //let decryptattu = ........
        //results[0].kayttaja = decryptattu;
        callback(results);
      },
  );
};
const cryptausTest = (data, connection, callback) => {
  console.log("cryptausTest data Array: ",data);
  connection.execute(
      'INSERT INTO testaus3 (kayttaja, test) VALUES (?, ?);',
      data,
      (err, results, fields) => {
       // console.log("Cryptaustest results: ",results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

const PalautaFrontendiin2 = (data, connection, callback) => {

  connection.execute(
      "SELECT kayttaja FROM testaus3 WHERE test = 'testirivi2';",
      (err, results, fields) => {
        //results[0].kayttaja <- DECRYPTAA

        //let decryptattu = ........
        //results[0].kayttaja = decryptattu;
        callback(results);
      },
  );
};


module.exports = {
  connect: connect,
  insert: insert,
  reportImage: reportImage,
  PalautaFrontendiin: PalautaFrontendiin,
  cryptausTest: cryptausTest,
  PalautaFrontendiin2: PalautaFrontendiin2,
};
