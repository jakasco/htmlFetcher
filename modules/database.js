'use strict';
// get the client
const mysql = require('mysql2');

const connect = () => {

  // create the connection to database

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mediaprojekti',
  });

  //Tarkastetaan saadaanko MySql yhteys
  connection.connect(function (error) {
    if (!!error) {

      console.log("Error to connect mySQL");
    } else {

      console.log("Connected to MySQL");
    }
  });
  return connection;
};


const select = (data, connection, callback) => {
  console.log("Data: ", data);
  console.log('SELECT * FROM cssTiedostot where width = ' + data[0] + ' and height = ' + data[1] + ';');
  connection.execute(
    'SELECT * FROM cssTiedostot where width = ' + data[0] + ' and height = ' + data[1] + ';',
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

const convertSizes = (size) => {
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

const SelectCSSFile  = (data, connection, callback) => {
  
  console.log('SELECT CSS_Tiedosto FROM csstiedostot2 WHERE nimi = "' + data + '";');
  connection.execute('SELECT CSS_Tiedosto FROM csstiedostot2 WHERE nimi = "' + data + '";',
    (err, results, fields) => {
      console.log(err);
      console.log("CSS RESULTS: ",results.length);
      callback(results);
    },
  );

}


//SELECT * FROM `mediaquerysaannot` WHERE `Max_width` LIKE '%20em
const selectMediaQuery2 = (data, connection, callback) => {
  
    console.log('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width = "' + data + '";');
    connection.execute('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
      (err, results, fields) => {
        console.log(err);
        console.log("RESULTS 2:", results);
        callback(results);
      },
    );
  
}

const selectMediaQuery = (data, connection, callback) => {
  console.log("data to select: ", data[0]);
  let DataInPx = data[0] + "px"; // Max_width = "' + data[0] + 'px" OR Max_width  "' + data[0] + 'em"',
  connection.execute(
    'SELECT Max_width FROM mediaQuerySaannot',
    (err, results, fields) => {
      console.log(err);
      //console.log("Results MediaQuery",results[0].Max_width);
      
        let ArrayOfValues = [];
        for (let i = 0; i < results.length; i++) {
          if (results[i].Max_width !== null) {
            let convertedValue = convertSizes(results[i].Max_width);
            console.log("ConvertedValue: ", convertedValue);
            try {
            if (convertedValue[0] !== null) {

              if (data[0] >= convertedValue[0]) {
                if (convertedValue[1] !== "em") {
                  console.log("c: ",convertedValue[0]);
                  ArrayOfValues.push(convertedValue[0]); //px on suoraan esim 400px 
                } else {
                  let a = (convertedValue[0]/10).toString();// + convertedValue[i];
                  a += convertedValue[1];
                  console.log("a: ",a);
                  ArrayOfValues.push(a); //Palautetaan takaisin joko px tai em
                }
              }
            }
          }
           catch (e) {
          console.log("Error in lopp",e);
        }
       }//IF
      }//FOR LOOP
   //     console.log(ArrayOfValues); //Kaikki arvot jotka ovat pienempiä kuin annettu näytön koko
    //    callback(selectMediaQuery2(ArrayOfValues, connection, callback));
     callback(ArrayOfValues);
    },
  )
};



const insertIntoMediaQueryTable = (data, connection, callback) => {
  console.log("DATA: ", data);

  connection.execute(
    'INSERT INTO mediaQuerySaannot (MediaQuery_Saanto, Max_width, Min_width, Max_Height, Min_Height) VALUES (?, ?, ?, ?, ?);',
    data,
    (err, results, fields) => {
      //  console.log(results); // results contains rows returned by server
      console.log(err);
      callback();
    },
  );
  console.log("sql done");
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

const insertCssFile = (data, connection, callback) => {
  // console.log("Insert user", data)
  connection.execute(
    'INSERT INTO cssTiedostot2 (nimi, CSS_Tiedosto) VALUES (?, ?);',
    data,
    (err, results, fields) => {
      //  console.log(results); // results contains rows returned by server
      console.log(err);
      callback();
    },
  );
  console.log("sql insertCssFile done");
};

module.exports = {
  connect: connect,
  select: select,
  selectScreenSize: selectScreenSize,
  insertUser: insertUser,
  insertIntoMediaQueryTable: insertIntoMediaQueryTable,
  selectMediaQuery: selectMediaQuery,
  selectMediaQuery2:selectMediaQuery2,
  insertCssFile:insertCssFile,
  SelectCSSFile:SelectCSSFile,
};
