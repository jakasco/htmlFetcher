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


const select = (connection, callback) => {
  // simple query
  connection.query(
      'SELECT * FROM kuvat;',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};


const insertUser = (data, connection, callback) => {
  console.log("Insert user", data)
  connection.execute(
      'INSERT INTO cssTiedostot (nimi, CSS_Tiedosto, Max_width, Min_width, Max_Height, Min_Height) VALUES (?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        console.log(err);
        callback();
      },
  );
  console.log("sql done");
};





module.exports = {
  connect: connect,
  select: select,
  insertUser: insertUser,
};
