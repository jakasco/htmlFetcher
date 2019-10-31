'use strict';
// get the client
const mysql = require('mysql2');

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


module.exports = {
  connect: connect,
  insert: insert,
  reportImage: reportImage};
