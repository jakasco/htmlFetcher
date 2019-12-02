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

const checkIfDatabaseWontWriteTablesMoreThanOnce = (name, id) => {
  connection.execute('Select count(*) from csstiedostot2 where '+name+' = @'+name+' and '+id+' = @'+CSS_Id, //IF count = 0 = true
    (err, results, fields) => {
      console.log(err);

      callback(results);
    },
  );
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

const selectMediaQueryMinHeight = (data, connection, callback) => {
  console.log("data to select: ", data[1]);
  let DataInPx = data[1] + "px"; // Max_width = "' + data[0] + 'px" OR Max_width  "' + data[0] + 'em"',
  connection.execute(
    'SELECT Max_width FROM mediaQuerySaannot',
    (err, results, fields) => {
      console.log(err);
      
        let ArrayOfValues = [];
        for (let i = 0; i < results.length; i++) {
          if (results[i].Max_width !== null) {
            let convertedValue = convertSizes(results[i].Max_width);
            console.log("ConvertedValue: ", convertedValue);
            try {
            if (convertedValue[0] !== null) {

              if (data[1] >= convertedValue[0]) {
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
     callback(ArrayOfValues);
    },
  )
};

const selectMediaQueryMaxHeight = (data, connection, callback) => {
  console.log("data to select: ", data[1]);
  let DataInPx = data[1] + "px"; // Max_width = "' + data[0] + 'px" OR Max_width  "' + data[0] + 'em"',
  connection.execute(
    'SELECT Max_width FROM mediaQuerySaannot',
    (err, results, fields) => {
      console.log(err);
      
        let ArrayOfValues = [];
        for (let i = 0; i < results.length; i++) {
          if (results[i].Max_width !== null) {
            let convertedValue = convertSizes(results[i].Max_width);
            console.log("ConvertedValue: ", convertedValue);
            try {
            if (convertedValue[0] !== null) {

              if (data[1] >= convertedValue[0]) {
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
     callback(ArrayOfValues);
    },
  )
};

const selectMediaQueryMinWidth = (data, connection, callback) => {
  console.log("data to select: ", data[0]);
  let DataInPx = data[0] + "px"; // Max_width = "' + data[0] + 'px" OR Max_width  "' + data[0] + 'em"',
  connection.execute(
    'SELECT Min_width FROM mediaQuerySaannot',
    (err, results, fields) => {
      console.log(err);
      
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
     callback(ArrayOfValues);
    },
  )
};

const selectMediaQuery = (data, connection, callback) => {
  console.log("data to select: ", data[0]);
  let DataInPx = data[0] + "px"; // Max_width = "' + data[0] + 'px" OR Max_width  "' + data[0] + 'em"',
  connection.execute(
    'SELECT Max_width FROM mediaQuerySaannot',
    (err, results, fields) => {
      console.log(err);
      
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
    'INSERT INTO cssTiedostot2 (CSS_Id, nimi, CSS_Tiedosto) VALUES (?,?,?);',
    data,
    (err, results, fields) => {
      console.log("ERROR IN insertCssFile", err);
      if(!err){
        console.log("sql insertCssFile done Successfully");
      }
      callback();
    },
  );
 
};

const SelectCSSFile  = (data, connection, callback) => {
  
  console.log('SELECT CSS_Tiedosto,nimi FROM csstiedostot2 WHERE nimi = "' + data + '";');
  connection.execute('SELECT CSS_Tiedosto,nimi FROM csstiedostot2 WHERE nimi = "' + data + '";',
    (err, results, fields) => {
      console.log(err);
      console.log("CSS RESULTS: ",results.length);
      callback(results);
    },
  );
}

/*
  req.body.cssTiedosto,
  req.body.fd.mediaQuerySaanto1,
  req.body.fd.mediaQuerySaanto2,
  req.body.fd.mediaQueryPosition,
  req.body.fd.lengthType,
  req.body.fd.width,
  req.body.fd.height
*/

const tallennaTietokantaanMediaQuerynPosition = (data,connection,callback) => {
  console.log("Data :",data);
  connection.execute(
    'INSERT INTO mediaquerysaannot3 (CSS_File, MediaQuery_Saanto, Position, TextToClearPosition,	min_width,	max_width,	min_height,	max_height) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    data,
    (err, results, fields) => {
      //  console.log(results); // results contains rows returned by server
      console.log(err);
      console.log("sql done");
      callback();
    },
  );
};

const SelectCSSMediaQueryPositions = (data, connection, callback) => {
  
  let query = 'SELECT * FROM mediaQuerySaannot2 WHERE Position = ' + data[0] + ' AND CSS_File = "'+data[1]+'";';
  connection.execute(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );

};

const UpdateMediaQuery = (data, connection, callback) => {
  
  console.log('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width = "' + data + '";');
  connection.execute('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
      console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}

const SelectCSSMediaQueryPositions32 = (data, connection, callback) => {
  let query1 = 'SELECT MAX(min_width) as MW, MAX(min_height) as MH FROM mediaQuerySaannot3 WHERE min_width < '+ data[0] +' OR min_height < '+data[1]+';'
  
  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      console.log(results[0].MW);
      let data2 = [results[0].MW,results[0].MH];

     // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'
     
      
      let query2 = 'SELECT MIN(min_width) as MW2 ,MIN(min_height) as MH2 FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'
      connection.execute(query2, function(err, results2, fields) {
            if (err) throw err;
            console.log(results2)
            let data3 = [results2[0].MW2,results2[0].MH2];
            
            let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE min_width = '+data3[0]+' OR min_height = '+data3[1]+';'
            connection.execute(query3, function(err, results3, fields) {
              if (err) throw err;
              console.log("Results3: ",results3);
            callback(results3);
          });
        });
    },
  );

};


const SelectCSSMediaQueryPositions3 = (data, connection, callback) => {
  let query1 = 'SELECT MIN(max_width) as MW, MIN(max_height) as MH FROM mediaQuerySaannot3 WHERE max_width > '+ data[0] +' OR max_height > '+data[1]+';'
  
  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      console.log(results[0].MW);
      let data2 = [results[0].MW,results[0].MH];

     // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'
     
      
      let query2 = 'SELECT MAX(max_width) as MW2 ,MAX(max_height) as MH2 FROM mediaQuerySaannot3 WHERE max_width > '+data2[0]+' OR max_height > '+data2[1]+';'
      connection.execute(query2, function(err, results2, fields) {
            if (err) throw err;
            console.log(results2)
            let data3 = [results2[0].MW2,results2[0].MH2];
            
            let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width = '+data3[0]+' OR max_height = '+data3[1]+';'
            connection.execute(query3, function(err, results3, fields) {
              if (err) throw err;
              console.log("Results3: ",results3);
            callback(results3);
          });
        });
    },
  );

};

const SelectCSSMediaQueryPositions3_2 = (data, connection, callback) => {
  let query = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width < '+ data[0] +' OR max_height < '+data[1]+';';
  connection.execute(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );

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
  checkIfDatabaseWontWriteTablesMoreThanOnce:checkIfDatabaseWontWriteTablesMoreThanOnce,
  tallennaTietokantaanMediaQuerynPosition:tallennaTietokantaanMediaQuerynPosition,
  SelectCSSMediaQueryPositions:SelectCSSMediaQueryPositions,
  SelectCSSMediaQueryPositions3:SelectCSSMediaQueryPositions3,
  SelectCSSMediaQueryPositions32:SelectCSSMediaQueryPositions32,
  SelectCSSMediaQueryPositions3_2:SelectCSSMediaQueryPositions3_2,
};
