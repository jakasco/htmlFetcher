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

  
const select = (data, connection, callback) => {
  console.log("Data: ", data);
  console.log('SELECT * FROM cssTiedostot where width = '+data[0]+' and height = '+data[1]+';');
  connection.execute(
      'SELECT * FROM cssTiedostot where width = '+data[0]+' and height = '+data[1]+';',
      (err, results, fields) => {
        console.log(err);
        
        callback(results);
      },
  );
};

const selectScreenSize = (data, connection, callback) => {
  // simple query
  connection.execute(
      'SELECT CSS_Tiedosto, Width, Height FROM cssTiedostot where nimi = "css1"',
      (err, results, fields) => {
        console.log(err);
        
        callback(results);
      },
  );
};


const insertUser = (data, connection, callback) => {
 // console.log("Insert user", data)
  connection.execute(
      'INSERT INTO cssTiedostot (nimi, CSS_Tiedosto, Width, Height, Max_width, Min_width, Max_Height, Min_Height) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
      //  console.log(results); // results contains rows returned by server
        console.log(err);
        callback();
      },
  );
  console.log("sql done");
};





module.exports = {
  connect: connect,
  select: select,
  selectScreenSize: selectScreenSize,
  insertUser: insertUser,
};
