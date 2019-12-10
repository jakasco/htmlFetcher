'use strict';
// get the client
//const mysql = require('mysql2');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
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

const checkIfDatabaseWontWriteTablesMoreThanOnce = (name, id) => {
  connection.query('Select count(*) from csstiedostot2 where ' + name + ' = @' + name + ' and ' + id + ' = @' + CSS_Id, //IF count = 0 = true
    (err, results, fields) => {
      console.log(err);
      console.log("\x1b[43m", "Results checkIfDatabaseWontWriteTablesMoreThanOnce:", "\x1b[0m", results)
      callback(results);
    },
  );
};



const select = (data, connection, callback) => {

  console.log('SELECT * FROM cssTiedostot where width = ' + data[0] + ' and height = ' + data[1] + ';');
  connection.query(
    'SELECT * FROM cssTiedostot where width = ' + data[0] + ' and height = ' + data[1] + ';',
    (err, results, fields) => {
      console.log(err);

      callback(results);
    },
  );
};

const selectScreenSize = (data, connection, callback) => {
  // simple query
  connection.query(
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
  
  connection.query('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
          console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}


const insertCssFile = (data, connection, callback) => {
  // console.log("Insert user", data)
  connection.query(
    'INSERT INTO cssTiedostot4 (CSS_Id, User_id, nimi, CSS_Tiedosto) VALUES (?,?,?,?);',
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
  connection.query(
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
  connection.query('SELECT CSS_Tiedosto,nimi,CSS_Id FROM csstiedostot2 WHERE nimi = "' + data + '";',
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
  console.log(red, "tableRows: ", tableRows, reset);
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
  for (let i = 0; i < valuesToDB.length; i++) {
    if (valuesToDB[i].endsWith("'") === true) {
      console.log(blue, " VIIMEINEN PULKKU!", reset);
      let lastChar = 'X';
      let firstChar = '"';

      valuesToDB[i] = valuesToDB[i].concat(lastChar); //Lisätään pilkku string bugin takia
      values += (',"' + valuesToDB[i] + '"');
      arr.push("Ends Error " + i + " , " + valuesToDB[i].slice(0, 30));
      values += (',"' + valuesToDB[i].toString() + '"');
    }
    if (valuesToDB[i].startsWith("'") === true) {
      console.log(blue, " Eka PULKKU!", reset);
      valuesToDB[i].IndexOf(0) += ""; //Lisätään pilkku string bugin takia
      arr.push("Starts Error " + i + " , " + valuesToDB[i].slice(0, 30));
      values += (',"' + valuesToDB[i].toString() + '"');
    } else {
      values += (',"' + valuesToDB[i].toString() + '"');
    }

  };
  let arr2 = [values, arr];
  // console.log(red,"values: ",values,reset);
  return arr2;
}

const insertQuery = (autoIncrementNum, table, tableRows, values) => {
  let rows = getTableRows(tableRows);
  let arr = setValues(values);
  let value = arr[0];
  for (let i = 0; i < arr[0].length; i++) {

  }
  console.log("arr[1] ", arr[1]);
  let query = "";
  if (autoIncrementNum === null) { //jos ei haluta autoincrementtiä
    query = "INSERT INTO " + table + " (" + rows[0] + ") VALUES (" + rows[1] + ");";
    //   console.log(red, query, reset);
  } else { //manuaalinen lisäys
    query = "INSERT INTO " + table + " (" + rows[0] + ") VALUES (" + autoIncrementNum + value + ");";
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
  let sq = "SELECT MAX(" + idName + ") AS tempID from " + table;
  // let query1 = "SELECT (MAX)" + idName + " as tempID FROM " + table + " WHERE " + idName + " = " + id + ";";
  console.log(red, sq, reset);
  connection.query(sq,
    (err, results, fields) => {
      console.log(err);
      let checkIfIdExist = results[0].tempID;//`results[0].${idName}`;
      console.log(red, " checkIfIdExist: ", reset, checkIfIdExist);
      if (checkIfIdExist === null || typeof checkIfIdExist === 'undefined') {
        checkIfIdExist = 1;
        let iq = insertQuery(checkIfIdExist, table, tableRows, null);

        connection.query(iq, function (err, results2, fields) {
          if (err) throw err;
          callback(results2);
        });
      } else {

        let newId = (results[0].tempID + 1);
        console.log(red, "NEW ID: ", newId);
        let iq = insertQuery(newId, table, tableRows, data);
        console.log(data[0]);
        //  let q = "INSERT INTO csstiedostot3 (CSS_Id,nimi,CSS_Tiedosto,Muokattu_Tiedosto) VALUES (6,?,?,?)";
        connection.query(iq, function (err, results3, fields) {
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
  connection.query('SELECT CSS_Tiedosto,nimi,CSS_Id,Muokattu_Tiedosto FROM csstiedostot3 WHERE CSS_Id = "' + data + '";',
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
  let query1 = "SELECT DISTINCT CSS_Id,Muokattu_Tiedosto FROM csstiedostot2";
  // console.log("\x1b[33m", query1);
  connection.query(query1,
    (err, results, fields) => {
      //  console.log(err);
      //  console.log("\x1b[32m", "Query1 Successfully executed, ");
      let amount = results.length;
      //    console.log(red, "   idArr: ", idArr, reset);
      let ids = getUniqueIds(idArr, results, amount);
      //   console.log("ids: " + ids);
      let query2 = 'SELECT * FROM csstiedostot2 WHERE CSS_Id in (' + ids + ')';
      //   console.log("\x1b[33m", query2);
      //   console.log(query2);
      connection.query(query2, (err, results2, fields) => {
        if (err) throw err;
        //     console.log("results2.length: ", results2.length);
        callback(results2);
      });
    },
  );
}


const tallennaTietokantaanMediaQuerynPosition = (data, connection, callback) => {
  console.log("Data :", data);
  connection.query(
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
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );

};

const UpdateMediaQuery = (data, connection, callback) => {

  console.log('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width = "' + data + '";');
  connection.query('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
      //   console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}

const SelectCSSMediaQueryPositions32 = (data, connection, callback) => {
  let query1 = 'SELECT MAX(min_width) as MW, MAX(min_height) as MH FROM mediaQuerySaannot3 WHERE min_width < ' + data[0] + ' OR min_height < ' + data[1] + ';'

  connection.query(query1,
    (err, results, fields) => {
      console.log(err);
      // console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];

      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MIN(min_width) as MW2 ,MIN(min_height) as MH2 FROM mediaQuerySaannot3 WHERE min_width > ' + data2[0] + ' OR min_height > ' + data2[1] + ';'
      connection.query(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE min_width = ' + data3[0] + ' OR min_height = ' + data3[1] + ';'
        connection.query(query3, function (err, results3, fields) {
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

  connection.query(query1,
    (err, results, fields) => {
      console.log(err);
      //     console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];

      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MAX(max_width) as MW2 ,MAX(max_height) as MH2 FROM mediaQuerySaannot3 WHERE max_width > ' + data2[0] + ' OR max_height > ' + data2[1] + ';'
      connection.query(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width = ' + data3[0] + ' OR max_height = ' + data3[1] + ';'
        connection.query(query3, function (err, results3, fields) {
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
  connection.query(query,
    (err, results, fields) => {
      //    console.log(err);
      callback(results);
    },
  );

};
//SELECT min_width,min_height FROM mediaQuerySaannot3 WHERE CSS_File_ID = 1 AND min_width > 375  OR min_height > 600
const SelectCSSMediaQueryPositions4 = (data, connection, callback) => {
  console.log("SelectCSSMediaQueryPositions4 data: ", data);
  let query = 'SELECT * FROM mediaQuerySaannot3 WHERE min_width > ' + data[0] + ' OR min_height > ' + data[1] + ';'
  connection.query(query,
    (err, results, fields) => {
      ///   console.log(err);
      callback(results);
    },
  );

};

//select CSS_Id from csstiedostot2 where nimi = "http://localhost/wp2/wp-includes/css/dist/block-library/theme.min.css?ver=5.2.4'"

const SelectCSSFilesID = (data, connection, callback) => {
  let query = 'select CSS_Id from csstiedostot2 where nimi ="' + data + '";';
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
      connection.query(query3, function (err, results3, fields) {
        if (err) throw err;
        //   console.log("Results3: ",results3);
        callback(results3);
      });
    },
  );
};

const SelectCSSMediaQueryPositions5 = (data, connection, callback) => {
  let query1 = 'SELECT min_width,min_height,CSS_File_ID,TextToClearPosition FROM mediaQuerySaannot3 WHERE min_width > ' + data[0] + ' OR min_height > ' + data[1] + ';'

  connection.query(query1,
    (err, results, fields) => {
      console.log(err);
      //     console.log(results[0].MW);
      let data2 = [results[0].MW, results[0].MH];
      let id = results[0].CSS_File_ID;
      // let query2 = 'SELECT CSS_File,TextToClearPosition,MIN(min_width),MIN(min_height) FROM mediaQuerySaannot3 WHERE min_width > '+data2[0]+' OR min_height > '+data2[1]+';'


      let query2 = 'SELECT MAX(max_width) as MW2 ,MAX(max_height) as MH2 FROM mediaQuerySaannot3 WHERE max_width > ' + data2[0] + ' OR max_height > ' + data2[1] + ';'
      connection.query(query2, function (err, results2, fields) {
        if (err) throw err;
        //    console.log(results2)
        let data3 = [results2[0].MW2, results2[0].MH2];

        let query3 = 'SELECT CSS_File,TextToClearPosition FROM mediaQuerySaannot3 WHERE max_width = ' + data3[0] + ' OR max_height = ' + data3[1] + ';'
        connection.query(query3, function (err, results3, fields) {
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
  connection.query('SELECT MediaQuery_Saanto FROM mediaQuerySaannot WHERE Max_width LIKE "%' + data + '%";',
    (err, results, fields) => {
      console.log(err);
   //   console.log("RESULTS 2:", results);
      callback(results);
    },
  );
}*/
//csstiedostot2

const resetCssFiles = (connection, callback) => {
  let query = "UPDATE `cssTiedostot2` SET `Muokattu_Tiedosto` =  `CSS_Tiedosto`;";
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
      callback(results);
    },
  );
}

const UpdateCSSFile = (id, data, Muokattu_Tiedosto, connection, callback) => {
  //console.log(Muokattu_Tiedosto, "  <---- Muokattu_Tiedosto");
  let replaceString = Muokattu_Tiedosto.split(data).join("");
  replaceString = replaceString.split('"').join("");
  let query = 'UPDATE csstiedostot2 SET Muokattu_Tiedosto = "' + replaceString + '" WHERE CSS_Id = ' + id + ';';
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
      //    console.log("Results: ",results);
      let query2 = 'SELECT Muokattu_Tiedosto FROM csstiedostot2 WHERE CSS_Id = ' + id + ';';
      connection.query(query2, function (err, results3, fields) {
        if (err) throw err;

        // console.log(results3);
        //      console.log(red, "After update: ", results3[0].Muokattu_Tiedosto.length, reset);
        callback(results3);
      });
    },
  );
};

/*
const UpdateCSSFile = (id, data, connection, callback) => {
  let re = new RegExp(data, 'g');
  let query = 'SELECT Muokattu_Tiedosto FROM csstiedostot2 WHERE CSS_Id = ' + id + ';';
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
     
    
      let stringOfMuokattuTiedosto = results[0].Muokattu_Tiedosto;
     
    
    //  var res = stringOfMuokattuTiedosto.match(re);
     // console.log(res," <---- res");
    //  let replaceString = stringOfMuokattuTiedosto.replace(res,'');
      let replaceString = results[0].Muokattu_Tiedosto.split(data).join("");
       replaceString = replaceString .split('"').join("");
   //   console.log("Sisältääkö : ",stringOfMuokattuTiedosto.includes(replaceString));
    // console.log(replaceString,"  <----    replaceString");
   //   console.log( "data: ",data,"  ------------   id: "+id);
      console.log(blue,id," <- ID. stringOfMuokattuTiedosto update: ",stringOfMuokattuTiedosto.length,red," replaceString: ",replaceString.length,reset);
      let query2 = 'UPDATE csstiedostot2 SET Muokattu_Tiedosto = "'+replaceString+'";';
    //   console.log(query2, "<-- query2");
      connection.query(query2, function (err, results2, fields) {
        if (err) throw err;
     //   console.log(yellow,"query2 done ",results2);
        
        connection.query(query, function (err, results3, fields) {
          if (err) throw err;
      //    console.log(results3[0].Muokattu_Tiedosto);
          console.log(red,"After update: ",results3[0].Muokattu_Tiedosto.length,reset);
          callback(results3);
        });
      });
    },
  );
}*/

const SelectCSSFileByID2 = (id, connection, callback) => {

  //console.log('SELECT CSS_Tiedosto,nimi FROM csstiedostot2 WHERE nimi = "' + data + '";');
  connection.query('SELECT CSS_Tiedosto,Muokattu_Tiedosto FROM csstiedostot2 WHERE CSS_Id = ' + id + '";"',
    (err, results, fields) => {
      console.log(err);
      //console.log("CSS RESULTS SelectCSSFile Length: ",results.length);
      callback(results);
    },
  );
};

const UpdateCSSFile2 = (Muokattu_Tiedosto, connection, callback) => {
  let query = 'UPDATE csstiedostot2 SET Muokattu_Tiedosto = ' + Muokattu_Tiedosto + ';';
  connection.query(query,
    (err, results, fields) => {
      console.log(err);
      console.log(red, "Muokattu_Tiedosto UPDATED", reset);
      callback(results);
    },
  );
};
/*
const cutAllMediaQueriesByCssFileID = (id, connection, callback) => {
  console.log("ID ENNEN QUEYRA: ",yellow,id,reset);
  let  query = 'SELECT Min(Position) as minP,MAX(LastIndexToClearPosition) as maxP FROM mediaQuerySaannot3 WHERE CSS_File_ID = '+id+';';
  console.log("");
  console.log(red,"QUERY:",reset);
  console.log(green,query,reset);
  console.log("");
  connection.query(query,
     (err, results, fields) => {
       console.log(red,"ERROR AT cutAllMediaQueriesByCssFileID,",reset);
       console.log(err);
       let arrOfMinAndMax = [results[0].minP,results[0].maxP];
      // console.log("Resutlts: minP",red,results[0].minP," , ",red,results[0].maxP,reset);
       callback(arrOfMinAndMax);
     },
   ); //ALKUPEÄINEN
 };*/

const saveCSSFiles = (name, value) => {
  const nameOfCss = name + ".css";
  const cssPath = path.join(__dirname, '../public', 'css', nameOfCss);
  console.log(yellow, "CSS PATH: ", cssPath);


  fs.open(cssPath, "w", function (err, file) {
    if (err) throw err;
    console.log("file? ", blue, file); //file on int
    console.log(nameOfCss + ' Saved!');
  });
  // console.log(value," <----- Value");

  fs.appendFile(cssPath, value, function (err) { //Lisää CSS tiedoston sisään
    if (err) throw err;
    console.log('Saved and Added Content to ' + nameOfCss);
  });
};
function replaceMiddle(string, n) {
  var rest = string.length - n;
  return string.slice(0, Math.ceil(rest / 2) + 1) + '*'.repeat(n) + string.slice(-Math.floor(rest / 2) + 1);
};
const cutAllMediaQueriesByCssFileID = (j, id, replaceQuery, Muokattu_Tiedosto, cutStart, cutEnd, connection, callback) => {

  // let cssName = "tempDB"+id;
  //Muokattu_Tiedosto = Muokattu_Tiedosto.toString();
  // let cut = 
  // Muokattu_Tiedosto.split(replaceQuery).join(" 'MEDIAQUERY OTETTU POIS'");
  // cut = cut.split('"').join("");
  //OTA STRINGISTÄ POIS KOHDAT X:stä Y:n.
  // let cut = Muokattu_Tiedosto.slice(cutStart,cutEnd);
  //cut = "asd "+id;
  //tallenna tämä muutos css tiedostona
  // saveCSSFiles(cssName,cut);
  //ota tämä uusi tallennettu tiedosto
  //let minusJ = j;
 /* let temp2 = "tempDB_" + id + "_" + j + ".css";
  let rep = Muokattu_Tiedosto.replace(replaceQuery, "POISTETTU");
  rep = rep.split('"').join("");

  //let replaceString = CssFileString.split(mediaQuery).join(re);

  let content = "EMpty";
  // if(j>0){
  const cssPath = path.join(__dirname, '../public', 'css', temp2);
  content = fs.readFileSync(cssPath, 'utf8');
  let finalContent = content.replace('/\?' + replaceQuery + '\d+\z/', 'poistettu');
  saveCSSFiles(temp2, finalContent);*/
  //  let re = 'POISTT ';
  //  content = content.split(replaceQuery).join(re);
  //  content = content.split('"').join("");
  // }else{
  //  content = "EMPTY";
  // }
  let query = 'SELECT Muokattu_Tiedosto FROM csstiedostot2  WHERE CSS_Id = ' + id + ';';
  //console.log(replaceQuery," <---replaceQuery");
  //päivitä tietokannassa tämä tiedosto
  //let query2 = 'UPDATE cssTiedostot2 SET Muokattu_Tiedosto = "' + finalContent + '" WHERE CSS_Id = ' + id + ';';
  //let  query = 'SELECT Position as minP,LastIndexToClearPosition as maxP FROM mediaQuerySaannot3 WHERE CSS_File_ID = '+id+';';
  // console.log("");
  //  console.log(red,"QUERY:",reset);
  // console.log(green,query2.length,reset);
  // console.log("");
  connection.query(query,
    (err, results, fields) => {
      //   console.log(green,query2,reset);
      if (err) {
        console.log(red, "ERROR AT cutAllMediaQueriesByCssFileID,", reset);
        console.log(err);
      } else {
        //    console.log(results);
        //    let cut5 = Muokattu_Tiedosto.replace(replaceQuery);
        //   let cut4 = Muokattu_Tiedosto.split(replaceQuery).join(" 'MEDIAQUERY OTETTU POIS'");
        //    cut = cut.split('"').join("");
        //  let cut2 = Muokattu_Tiedosto.slice(cutStart,cutEnd);
        //   let cut3 = Muokattu_Tiedosto.slice(0,5);
        //   let regex2 = new RegExp("\\\\["+"asdsdasd"+"\\\\]",'ig');
        //   let regex = new RegExp("/(\+\d{"+cutStart+"})\d{"+cutEnd+"}/",'ig');
        //    let patt1 = /\(.*@\)/i;"/(\+?\d{"+cutStart+"})(\d+)(\d{"+cutEnd+"})/g"
        //   let cut8 = Muokattu_Tiedosto.replace(regex,'[newVar]');
        //   let str = Muokattu_Tiedosto.replace("/(\+?\d{"+cutStart+"})(\d+)(\d{"+cutEnd+"})/g", "POISTETTU MEDIAQUERY");
        //  let regex3 = new RegExp("\\\\["+var1+"\\\\]",'ig');
        //  let cut8 = Muokattu_Tiedosto.replace(/(\+?\d{})(\d+)(\d{2})/g, function(match, start, middle, end) {
        // let subString =  Muokattu_Tiedosto.substr(cutStart,cutEnd);
        //  let  subString2 = replaceQuery.lastChar
        //  console.log(cut2," <--- cut");

        //   console.log(Muokattu_Tiedosto,red," <--- Muokattu_Tiedosto",reset);
        //   saveCSSFiles(temp,replaceQuery);TOIMIVA

        //     console.log(blue,"NO ERROR in SQL query :",reset," cutAllMediaQueriesByCssFileID");
        //    console.log("cutStart ENNEN QUEYRA: ",yellow,cutStart," , cutEnd: ",cutEnd, " , Muokattutiedosto pituus: ",Muokattu_Tiedosto.length,reset);

        ////////////  callback(results);

     //   results[0].Muokattu_Tiedosto;
    
        let finalContent = results[0].Muokattu_Tiedosto.slice(cutStart, cutEnd);
        finalContent = finalContent.split('"').join("");
        let query2 = 'UPDATE cssTiedostot2 SET Muokattu_Tiedosto = "' + finalContent + '" WHERE CSS_Id = ' + id + ';';
      
        connection.query(query2, function (err, results3, fields) {
          if (err) throw err;
          //   console.log("Results3: ",results3);
          let query3 = 'SELECT Muokattu_Tiedosto FROM csstiedostot2  WHERE CSS_Id = ' + id + ';';
          connection.query(query3, function (err, results3, fields) {
            if (err) throw err;
            //   console.log("Results3: ",results3);
            let rep = results3[0].Muokattu_Tiedosto.replace(replaceQuery, "POISTETTU");
            let temp = "tempDB_" + id + "_" + j;
            console.log("(cutStart, cutEnd);",green,cutStart, cutEnd,reset);
            saveCSSFiles(temp, rep);
            callback(results3);
          });
        });

      }
    },
  );
};


module.exports = {
  connect:connect,
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
  SelectCSSFileByID2: SelectCSSFileByID2,
  resetCssFiles: resetCssFiles,
  UpdateCSSFile2: UpdateCSSFile2,
  cutAllMediaQueriesByCssFileID: cutAllMediaQueriesByCssFileID,
};
