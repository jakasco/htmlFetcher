'use strict';
// get the client
const mysql = require('mysql2');

//Värit Debuggaukseen console.log
const reset = "\x1b[0m";

const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";

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

      console.log("\x1b[31m", "Error to connect mySQL!");
    } else {

      console.log("\x1b[36m", "Connected to MySQL Successfully!", reset);
    }
  });
  return connection;
};

const checkIfDatabaseWontWriteTablesMoreThanOnce = (name, id) => {
  connection.execute('Select count(*) from csstiedostot2 where ' + name + ' = @' + name + ' and ' + id + ' = @' + CSS_Id, //IF count = 0 = true
    (err, results, fields) => {
      console.log(err);
      console.log("\x1b[43m", "Results checkIfDatabaseWontWriteTablesMoreThanOnce:", "\x1b[0m", results)
      callback(results);
    },
  );
};



const select = (data, connection, callback) => {

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
      //    console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}


const insertCssFile = (data, connection, callback) => {
  // console.log("Insert user", data)
  connection.execute(
    'INSERT INTO cssTiedostot2 (CSS_Id, nimi, CSS_Tiedosto) VALUES (?,?,?);',
    data,
    (err, results, fields) => {
      console.log("ERROR IN insertCssFile", err);
      if (!err) {
        console.log("sql insertCssFile done Successfully");
      }
      callback();
    },
  );
};

const insertCssFile3 = (data, connection, callback) => {
  console.log(blue, "insertCssFile3 Data[0]: ", reset, data[0]);
  console.log(blue, "insertCssFile3 Data[0]: ", reset, data[1]);
  // let query1 = "INSERT INTO cssTiedostot3 (CSS_Id, nimi, CSS_Tiedosto,	Muokattu_Tiedosto) VALUES (?,?,?,?);"
  connection.execute(
    'INSERT INTO cssTiedostot3 (CSS_Id, nimi, CSS_Tiedosto,	Muokattu_Tiedosto) VALUES (?,?,?,?);',
    data,
    (err, results, fields) => {
      console.log("ERROR IN insertCssFile", err);
      if (!err) {
        console.log("\x1b[32m", "sql insertCssFile done Successfully", reset);
      }
      callback();
    },
  );
};

const SelectCSSFile = (data, connection, callback) => {

  //console.log('SELECT CSS_Tiedosto,nimi FROM csstiedostot2 WHERE nimi = "' + data + '";');
  connection.execute('SELECT CSS_Tiedosto,nimi,CSS_Id FROM csstiedostot2 WHERE nimi = "' + data + '";',
    (err, results, fields) => {
      console.log(err);
      //console.log("CSS RESULTS SelectCSSFile Length: ",results.length);
      callback(results);
    },
  );
};


const laitaPilkkuJosEiSanoja = (string, value) => {
  if (string === "") {
    string += value;
  } else {
    string += ("," + value);
  }
 // console.log(red,"string: ",string,reset,blue,"value: ",value,reset);
  return string;
};

const getTableRows = (tableRows) => { //Laita arrayna tablen nimet
  console.log(red,"tableRows: ",tableRows,reset);
  let arr = [];
  let names = "";
  let questionMarks = "";
  for (let i = 0; i < tableRows.length; i++) {
   // console.log(tableRows[i])
    names = (laitaPilkkuJosEiSanoja(names, tableRows[i]));
    questionMarks = (laitaPilkkuJosEiSanoja(questionMarks, "?"));
   // console.log(tableRows[i], " names: ",red,names,reset);
  }
  //console.log(red,table[i],questionMarks, " , ",names,reset,);
  arr.push(names, questionMarks);
 // console.log(red,"arr: ",arr,reset);
  return arr;
}

const setValues = (valuesToDB) => {
  let arr = [];
  let values = '';
  for(let i=0; i<valuesToDB.length; i++){
    if(valuesToDB[i].endsWith("'") === true){
      console.log(blue," VIIMEINEN PULKKU!",reset);
      let lastChar = 'X';
      let firstChar = '"';
      
      valuesToDB[i] = valuesToDB[i].concat(lastChar); //Lisätään pilkku string bugin takia
      values += (',"'+ valuesToDB[i]+'"');
      arr.push("Ends Error "+i+" , "+valuesToDB[i].slice(0,30));
      values += (',"'+ valuesToDB[i].toString()+'"');
    }
    if(valuesToDB[i].startsWith("'") === true){
      console.log(blue," Eka PULKKU!",reset);
      valuesToDB[i].IndexOf(0) += ""; //Lisätään pilkku string bugin takia
      arr.push("Starts Error "+i+" , "+valuesToDB[i].slice(0,30));
      values += (',"'+ valuesToDB[i].toString()+'"');
    }else{
      values += (',"'+ valuesToDB[i].toString()+'"');
    }

  };
  let arr2 = [values,arr];
  // console.log(red,"values: ",values,reset);
   return arr2;
}

const insertQuery = (autoIncrementNum, table, tableRows,values) => {
  let rows = getTableRows(tableRows);
  let arr = setValues(values);
  let value = arr[0];
  for(let i=0; i<arr[0].length; i++){
    
  }
  console.log("arr[1] ",arr[1]);
  let query = "";
  if (autoIncrementNum === null) { //jos ei haluta autoincrementtiä
    query = "INSERT INTO "+table+" ("+rows[0]+") VALUES ("+rows[1]+");";
 //   console.log(red, query, reset);
  } else { //manuaalinen lisäys
    query = "INSERT INTO "+table+" ("+rows[0]+") VALUES ("+autoIncrementNum+value+");";
    //console.log(red," Autoincrement num: ",autoIncrementNum,blue, " ", query, reset);
  }
  return query;
}

const selectQuery = (data, table, where, equals) => {
  let query = "SELECT " + data + " FROM " + table + " WHERE " + where + " = " + equals + ";";
  console.log(red, query, reset);
  return query;
}
//let iquery= "INSERT INTO " + table + "(" + rows[0] + ") VALUES (" + rows[0] + ");";
//'INSERT INTO cssTiedostot2 (CSS_Id, nimi, CSS_Tiedosto) VALUES (?,?,?); ) as MW2 ,
///////////////////////   1, array, array, id rown nimi, data *?, 
const addAutoIncrement = (id, table, tableRows, idName, data, connection, callback) => {
  //let sq = selectQuery(data, table, idName, id);
  let sq = "SELECT MAX("+idName+") AS tempID from "+table;
 // let query1 = "SELECT (MAX)" + idName + " as tempID FROM " + table + " WHERE " + idName + " = " + id + ";";
  console.log(red,sq,reset);
  connection.execute(sq,
    (err, results, fields) => {
      console.log(err);
      let checkIfIdExist = results[0].tempID;//`results[0].${idName}`;
      console.log(red," checkIfIdExist: ",reset,checkIfIdExist);
      if (checkIfIdExist === null || typeof checkIfIdExist === 'undefined') {
        checkIfIdExist = 1;
        let iq = insertQuery(checkIfIdExist, table, tableRows,null);

        connection.execute(iq, function (err, results2, fields) {
          if (err) throw err;
          callback(results2);
        });
      } else {

          let newId = (results[0].tempID + 1);
          console.log(red,"NEW ID: ",newId);
          let iq = insertQuery(newId, table, tableRows,data);
          console.log(data[0]);
        //  let q = "INSERT INTO csstiedostot3 (CSS_Id,nimi,CSS_Tiedosto,Muokattu_Tiedosto) VALUES (6,?,?,?)";
          connection.execute(iq, function (err, results3, fields) {
            if (err) throw err;
            console.log(green, " Uusi Autoincrement lisättty!", reset);
            callback(results3);
          }); 
      }
    },
  );
};

//SELECT CSS_Tiedosto,nimi,CSS_Id,Muokattu_Tiedosto FROM csstiedostot3 WHERE CSS_Id = "' + data + '";',
const SelectCSSFile3 = (data, connection, callback) => {
  connection.execute('SELECT CSS_Tiedosto,nimi,CSS_Id,Muokattu_Tiedosto FROM csstiedostot3 WHERE CSS_Id = "' + data + '";',
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );
};

const getUniqueIds = (idArr, distincArray, amount) => {
  let stringToBeReturned = "";
  for (let i = 0; i < amount; i++) {
    if (idArr.includes(distincArray[i].CSS_Id)) { //Jos css tiedoston id sisältää mediaqueruja
      stringToBeReturned = laitaPilkkuJosEiSanoja(stringToBeReturned, distincArray[i].CSS_Id);
    }
  }
  return stringToBeReturned;
};

const SelectCSSFileByID = (idArr, connection, callback) => {
  let query1 = "SELECT DISTINCT CSS_Id FROM csstiedostot2";
  console.log("\x1b[33m", query1);
  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      console.log("\x1b[32m", "Query1 Successfully executed, ");
      let amount = results.length;
      console.log(red, "   idArr: ",idArr,reset);
      let ids = getUniqueIds(idArr, results, amount);
      console.log("ids: " + ids);
      let query2 = 'SELECT CSS_Tiedosto,CSS_Id FROM csstiedostot2 WHERE CSS_Id in (' + ids + ')';
      console.log("\x1b[33m", query2);
      console.log(query2);
      connection.execute(query2, (err, results2, fields) => {
        if (err) throw err;
        callback(results2);
      });
    },
  );
}


const tallennaTietokantaanMediaQuerynPosition = (data, connection, callback) => {
  console.log("Data :", data);
  connection.execute(
    'INSERT INTO mediaquerysaannot3 (CSS_File, CSS_File_ID, MediaQuery_Saanto, Position, TextToClearPosition, LastIndexToClearPosition, FullMediaQuery,	min_width,	max_width,	min_height,	max_height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
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

  let query = 'SELECT * FROM mediaQuerySaannot2 WHERE Position = ' + data[0] + ' AND CSS_File = "' + data[1] + '";';
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
      //   console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}

const SelectCSSMediaQueryPositions32 = (data, connection, callback) => {
  let query1 = 'SELECT MAX(min_width) as MW, MAX(min_height) as MH FROM mediaQuerySaannot3 WHERE min_width < ' + data[0] + ' OR min_height < ' + data[1] + ';'

  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      // console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];

      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MIN(min_width) as MW2 ,MIN(min_height) as MH2 FROM mediaQuerySaannot3 WHERE min_width > ' + data2[0] + ' OR min_height > ' + data2[1] + ';'
      connection.execute(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE min_width = ' + data3[0] + ' OR min_height = ' + data3[1] + ';'
        connection.execute(query3, function (err, results3, fields) {
          if (err) throw err;
          //      console.log("Results3: ",results3);
          callback(results3);
        });
      });
    },
  );

};


const SelectCSSMediaQueryPositions3 = (data, connection, callback) => {
  let query1 = 'SELECT MIN(max_width) as MW, MIN(max_height) as MH FROM mediaQuerySaannot3 WHERE max_width > ' + data[0] + ' OR max_height > ' + data[1] + ';'

  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      //     console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];

      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MAX(max_width) as MW2 ,MAX(max_height) as MH2 FROM mediaQuerySaannot3 WHERE max_width > ' + data2[0] + ' OR max_height > ' + data2[1] + ';'
      connection.execute(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width = ' + data3[0] + ' OR max_height = ' + data3[1] + ';'
        connection.execute(query3, function (err, results3, fields) {
          if (err) throw err;
          //   console.log("Results3: ",results3);
          callback(results3);
        });
      });
    },
  );

};

const SelectCSSMediaQueryPositions3_2 = (data, connection, callback) => {
  let query = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width < ' + data[0] + ' OR max_height < ' + data[1] + ';';
  connection.execute(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );

};
//SELECT min_width,min_height FROM mediaQuerySaannot3 WHERE CSS_File_ID = 1 AND min_width > 375  OR min_height > 600
const SelectCSSMediaQueryPositions4 = (data, connection, callback) => {
  console.log("SelectCSSMediaQueryPositions4 data: ", data);
  let query = 'SELECT min_width,min_height,CSS_File_ID,CSS_File,TextToClearPosition,LastIndexToClearPosition FROM mediaQuerySaannot3 WHERE min_width > ' + data[0] + ' OR min_height > ' + data[1] + ';'
  connection.execute(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );

};

//select CSS_Id from csstiedostot2 where nimi = "http://localhost/wp2/wp-includes/css/dist/block-library/theme.min.css?ver=5.2.4'"

const SelectCSSFilesID = (data, connection, callback) => {
  let query = 'select CSS_Id from csstiedostot2 where nimi ="' + data + '";';
  connection.execute(query,
    (err, results, fields) => {
      console.log(err);
      connection.execute(query3, function (err, results3, fields) {
        if (err) throw err;
        //   console.log("Results3: ",results3);
        callback(results3);
      });
    },
  );
};

const SelectCSSMediaQueryPositions5 = (data, connection, callback) => {
  let query1 = 'SELECT min_width,min_height,CSS_File_ID,TextToClearPosition FROM mediaQuerySaannot3 WHERE min_width > ' + data[0] + ' OR min_height > ' + data[1] + ';'

  connection.execute(query1,
    (err, results, fields) => {
      console.log(err);
      //     console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];
      let id = results[0].CSS_File_ID;
      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MAX(max_width) as MW2 ,MAX(max_height) as MH2 FROM mediaQuerySaannot3 WHERE max_width > ' + data2[0] + ' OR max_height > ' + data2[1] + ';'
      connection.execute(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width = ' + data3[0] + ' OR max_height = ' + data3[1] + ';'
        connection.execute(query3, function (err, results3, fields) {
          if (err) throw err;
          //   console.log("Results3: ",results3);
          callback(results3);
        });
      });
    },
  );

};

/*
const UpdateMediaQuery = (data, connection, callback) => {
  
  console.log('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width = "' + data + '";');
  connection.execute('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
   //   console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}*/
//csstiedostot2
const UpdateCSSFile = (id, data, connection, callback) => {

  console.log('SELECT Muokattu_Tiedosto FROM csstiedostot3 WHERE CSS_Id = ' + id + ';');
  connection.execute('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
      //   console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}

module.exports = {
  connect: connect,
  select: select,
  selectScreenSize: selectScreenSize,
  selectMediaQuery2: selectMediaQuery2,
  insertCssFile: insertCssFile,
  SelectCSSFile: SelectCSSFile,
  checkIfDatabaseWontWriteTablesMoreThanOnce: checkIfDatabaseWontWriteTablesMoreThanOnce,
  tallennaTietokantaanMediaQuerynPosition: tallennaTietokantaanMediaQuerynPosition,
  SelectCSSMediaQueryPositions: SelectCSSMediaQueryPositions,
  SelectCSSMediaQueryPositions3: SelectCSSMediaQueryPositions3,
  SelectCSSMediaQueryPositions32: SelectCSSMediaQueryPositions32,
  SelectCSSMediaQueryPositions3_2: SelectCSSMediaQueryPositions3_2,
  SelectCSSFilesID: SelectCSSFilesID,
  SelectCSSMediaQueryPositions4: SelectCSSMediaQueryPositions4,
  SelectCSSFileByID: SelectCSSFileByID,
  SelectCSSFile3: SelectCSSFile3,
  insertCssFile3: insertCssFile3,
  UpdateCSSFile: UpdateCSSFile,
  addAutoIncrement: addAutoIncrement,
};
