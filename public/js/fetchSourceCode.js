
const div = document.querySelector("#divi");
const div2 = document.querySelector("#divi2");
const div3 = document.querySelector("#fetchatti");
const div4 = document.querySelector("#htmlTeksti");
const div5 = document.querySelector("#divi5");
const errorConsole = document.querySelector("#console3");
const inputEtsi = document.querySelector("#etsiSana");
const ul = document.querySelector("#ulList");

let ArrayOfCSSFiles = [];

let ArrayOfPositons = [];

const fetchConsole = document.querySelector("#fetchConsole");

const cssTallennusInput = document.querySelector("#input2");

function findWord() {
    let etsittySana = findWord4();
    console.log("Etsitty sana ", etsittySana);
}
function getCSSfiles() { //etsi kaikki css tiedostot lähdekoodista
    $("textarea").on('keyup', function () {

        const regex = /((?:https?:|www\.)[^\s]+)/g; //Etsii kaikki https tiedostot
        const str = $(this).val();

        let m = str.match(regex);

        if (m) {
            m.forEach((match, groupIndex) => {

                const regex2 = /((?:css)[^\s]+)/g; //Etsii näistä https tiedostoista kaikki css tiedostot
                const str2 = match;

                if (match.match(regex2)) { //Lisää css tiedostot textareaan
                    ArrayOfCSSFiles.push([match]);
                    MinAndMaxOfCssFiles.push([match]);
                    ArrayOfPositons.push([match]);
                    //  console.log("Match: ", match);
                    $("#ulList").append(`<li>
                    <a href='${match}' target='_blank'>
                    ${match}
                    </a>
                    </li>`);
                }
            });
        }
    }).keyup();
}

function getSecondPart(str) {
    return str.split('{')[1];
}

// use the function:
function vaihaCss(csss, n) {
    console.log("VAIHDA CSS ", n);
    const page = document.querySelector("#page");
    page.style = csss;
    console.log("page.style ", page.style);
    /*

    */
}

function vaihdaAlkuperainenMediaQuery(css) {
    // console.log("vaihdaAlkuperainenMediaQuery: ",css)
    //window.document.body.style += css;
}

function DetectContainerWidth() {
    let containerWidth = $("fetchatti").width();
    //console.log("ContainerWidth: " + containerWidth);
    return containerWidth;
}

let mediaQueryArrayminW = [];
let mediaQueryArraymaxW = [];
let mediaQueryArrayminH = [];
let mediaQueryArraymaxH = [];

let arrayOfCssMediaPosition = [];

function refactorArr(arr) {
    arr2 = []
    for (let i = 0; i < arr.length; i++) {
        //  for(let j=0; j<arr[i].length; j++){
        if (!arr[i]) {
            arr2.push(null);
        } else {
            arr2.push(arr[i]);
        }
        //  }
    }
    if (!arr2) {
        return null;
    } else {
        return arr2;
    }
}

/* 17 tai 18 RIkkoo
0 = min width
1 = positon
2 = saanto
3 = toinen saanto
*/

const tallennaTietokantaanMediaQuerynPosition = (evt, cssTiedosto, arr) => {
    evt.preventDefault;
    //  console.log("Arr: ",arr);
    //console.log("tallennaTietokantaanMediaQuerynPosition cssTiedosto: ", cssTiedosto, " , mediaQueryPosition: ", mediaQueryPosition);
/*
    for (let i = 0; i < arr.length; i++) {
        const fd = {};
        fd.cssTiedosto = cssTiedosto;
        fd.mediaQuerySaanto1 = arr[2][i];//refactorArr("saanto1_", arr, 2);
        fd.mediaQuerySaanto2 = arr[3][i];//refactorArr("saanto2_", arr, 3);
        fd.mediaQueryPosition = arr[1][i];//refactorArr("position", arr, 1);
        fd.lengthType = arr[0][i];//refactorArr("lengthType", arr, 0);
        fd.width = $("#fetchatti").width();
        fd.height = $("#fetchatti").height();
        const asetukset = {
            method: 'post',
            body: JSON.stringify(fd),
            headers: {
                'Content-type': 'application/json',
            },
        };
    //    console.log("Asetukset: ", fd);
        fetch('/tallennaTietokantaanMediaQuerynPosition', asetukset).then((response) => {
            return response.json();
        }).then((json) => {
            try {
                //  console.log("json frontend lomake 7: ", json);
            } catch (e) {
                console.log("ERRR ", e);
            }

        });
    }*/
};

const tallennaTietokantaanMediaQuerynPosition2 = 
(evt, cssTiedostoNimi, MediaQuery_Saanto, Position,TextToClearPosition) => {

       evt.preventDefault;

        const fd = {};
        fd.CSS_File = cssTiedostoNimi;
        fd.MediaQuery_Saanto = MediaQuery_Saanto;//refactorArr("saanto1_", arr, 2);
        fd.Position = Position;//refactorArr("saanto2_", arr, 3);
        fd.TextToClearPosition = TextToClearPosition;//refactorArr("position", arr, 1);
     //   fd.width = $("#fetchatti").width();
    //    fd.height = $("#fetchatti").height();
        const asetukset = {
            method: 'post',
            body: JSON.stringify(fd),
            headers: {
                'Content-type': 'application/json',
            },
        };
        console.log("Asetukset: ", fd);
        fetch('/tallennaTietokantaanMediaQuerynPosition', asetukset).then((response) => {
            return response.json();
        }).then((json) => {
            try {
                  console.log("tallennaTietokantaanMediaQuerynPosition  2: ", json);
            } catch (e) {
                console.log("ERRR ", e);
            }

        });
};

let t1 = 0;

function checkIfRelatedToMedia (mediaArr,widthArr) {
    let sum = (widthArr - mediaArr);
   // console.log("Minus: ",sum);
    if(sum < 70 && sum >= 0){
        return true;
    }else{
        return false;
    }
}

let MinAndMaxOfCssFiles = [];

function fetchMediaQuery() { //Etsii mediaqueryt css Tiedostoista

    let ArrayOfAllMediaQueries = []; //2d array kaikista mediaqueryista

    let ulPituus = document.querySelectorAll("#ulList li").length; //Looppi missä etsitään kaikki Mediaquery listan Stringit
    for (let i = 0; i < ulPituus; i++) {
        let TextOfLi = $("#ulList li").text();

        let li = document.querySelectorAll("#ulList li")[i];
        if (i !== 2) { //Googlen css tulee cors, joten skipataan "#ulList li")[2]
            try {
                fetch(li.textContent).then((response) => {
                    return response.text();
                }).then((text) => { //text = CSS tiedosto
                    let pituusArr = ArrayOfCSSFiles.length;
                    //      console.log("ArrayOfCSSFiles[i]: " + i + " , ", ArrayOfCSSFiles[i]);
                    //Tallenna CSS sisältö arrayhyn
                    ArrayOfCSSFiles[i].push(text);

                    //  console.log(ArrayOfCSSFiles);
                    let m = text.match("@media");
                    var res = text.split("@media"); //Jos Css Tiedostossa on @media sana, splitataan string tässä kohtaa

                    var vaihdaWidth = text.replace('@media', '#container[data-size="small"]');
                    vaihdaAlkuperainenMediaQuery(vaihdaWidth);

                    ArrayOfAllMediaQueries.push(res); //Lisätään tämä @media:lla splitattu stringi arrayna tähän listaan

                    for (let i = 0; i < res.length; i++) {
                        // 
                        //evt, css tiedoston nimi, mediaqueryn positon numerona
                        let event = document.createEvent('Event');
                        ///////////////////////////////////////////////////////////////
                       
                        //      console.log("indices ....... ", indices);
                        /////////////////////////////////////////////////////////////



                        var res2 = res[i].split(")");

                        let newCss = res2[1];

                        //Lisää MediaQueryt Scrolldown menuun li:nä
                        $("#ulList2").append(`<li> 
                ${res[i]}
                    </li></br>`);
                        //  let csss = res[i].substr(18,res[i].length);  ALKAA MAX WIDTH
                        let csss = res[i].substr(0, res[i].length);
                        $("#mediaNapit").append(`<button onclick='vaihaCss("${csss}",${i})'>
                    ${i}nappi ${res2[0].substr(0, 30)}
                        </button></br>`);
                    }

                    if (m) { //Turha?
                        m.forEach((match, groupIndex) => {
                            //   console.log(`Found match in ${li.textContent}, group ${groupIndex}: ${match}`);
                            let m = match.match(/{[\w\d]+}/g);
                        });
                    }
                    //      console.log("ArrayOfAllMediaQueries: ", ArrayOfAllMediaQueries);
                    let regex = /@Media/gi, result, indices = [];
                    
                    let regex1 = /min-width/gi, result1;
                    let regex2 = /max-width/gi, result2;
                    let regex3 = /min-height/gi, result3;
                    let regex4 = /max-height/gi, result4;

                    
                    while ((result = regex.exec(text))) {
                        ArrayOfPositons[i].push(["@Media", result.index]);
                    }
                    while ((result1 = regex1.exec(text))) {
                        ArrayOfPositons[i].push(["min-width", result1.index]);
                    }
                    while ((result2 = regex2.exec(text))) {
                        ArrayOfPositons[i].push(["max-width", result2.index]);
                    }
                    while ((result3 = regex3.exec(text))) {
                        ArrayOfPositons[i].push(["min-height", result3.index]);
                    }
                    while ((result4 = regex4.exec(text))) {
                        ArrayOfPositons[i].push(["max-height", result4.index]);
                    }
               //     console.log("ArrayOfPositons",ArrayOfPositons);
                    
                    let MediaRows = [];
                    let MediaRows2d = [];

                    for(let j=0; j<ArrayOfPositons[i].length;j++){
                        if(ArrayOfPositons[i][j][0] === "@Media"){
                            MediaRows.push(ArrayOfPositons[i][j][1]);
                        }
                      //  checkIfRelatedToMedia (,ArrayOfPositons[i][1]);
                    }
                    MediaRows2d.push(MediaRows);
                    console.log("MediaRows",MediaRows2d);
                    
                 //   let tempArrForMediaQuery = [];
                    let event = document.createEvent('Event');
                    for(let j=0; j<ArrayOfPositons[i].length;j++){
                        for(let k=0; k<MediaRows.length;k++){
                            if(ArrayOfPositons[i][j][0] !== "@Media"){
                         let bool = checkIfRelatedToMedia(MediaRows[k],ArrayOfPositons[i][j][1]);
                       //  console.log("Bool = "+bool);
                         if(bool===true){
                        
                        let MediaQuery_Saanto = text.slice(MediaRows[k],(ArrayOfPositons[i][j][1]+20));
                         let n = MediaQuery_Saanto.lastIndexOf("{"); // @media screen and (min-width: 48em) { <- otetaan pois {
                           
                         MediaQuery_Saanto = MediaQuery_Saanto.slice(0,n); //tulostaa @media screen and (min-width: 48em)
                        let TextToClearPosition = MediaRows[k]+n; //media query loppuu t'h'n kohtaan stringissä (numero)
                        //console.log(ArrayOfPositons[i][j][0],ArrayOfPositons[i][j][1]); //min-width 83604
                            try{
                       tallennaTietokantaanMediaQuerynPosition2(event, ArrayOfCSSFiles[i][0], MediaQuery_Saanto, MediaRows[k],TextToClearPosition);
                    } catch (e) { 
                        console.log("Error");
                    }
                    }
                        }
                        }//k looppi
                       
                    }
                   
                    
                    return text;
                }).then((text) => { //Tarkastetaan Min-Width ja Max-Width yms...



                    for (let i = 0; i < ArrayOfAllMediaQueries.length; i++) {




                        for (let j = 0; j < ArrayOfAllMediaQueries[i].length; j++) {
                            let MediaQuery = ArrayOfAllMediaQueries[i][j];


                            let m1 = MediaQuery.match("min-width");
                            let m2 = MediaQuery.match("max-width");
                            let m3 = MediaQuery.match("min-height");
                            let m4 = MediaQuery.match("max-height");
                            try {
                                if (m1) {
                                    m1.forEach((match, groupIndex) => {


                                        let tempString = MediaQuery.split("(" + match + ": ");
                                        let mq1 = MediaQuery.indexOf(":");
                                        let mq2 = MediaQuery.indexOf(")");

                                        let str1 = MediaQuery.substr(0, mq2); //(min-width:600px
                                        let str2 = str1.substr(mq1 + 1, mq2); //600px

                                        let str3 = MediaQuery.substr(mq2 + 1, MediaQuery.lenght); //MediaQuery




                                        let Temp = [match, str2, str3];



                                        mediaQueryArrayminW.push(Temp);
                                        if (MinAndMaxOfCssFiles[i][0] === ArrayOfCSSFiles[i][0]) { //Jos on saman CSS tiedoston nimi
                                            MinAndMaxOfCssFiles[i].push(Temp);
                                        }


                                        // lahetaLomake5(e,Temp); //Lähetä tietokantaan
                                    });
                                }
                                if (m2) {
                                    m2.forEach((match, groupIndex) => {
                                        let mq1 = MediaQuery.indexOf(":");
                                        let mq2 = MediaQuery.indexOf(")");

                                        let str1 = MediaQuery.substr(0, mq2); //(min-width:600px
                                        let str2 = str1.substr(mq1 + 1, mq2); //600px

                                        let str3 = MediaQuery.substr(mq2 + 1, MediaQuery.lenght); //MediaQuery

                                        let Temp = [match, str2, str3];

                                        mediaQueryArraymaxW.push(Temp);
                                        if (MinAndMaxOfCssFiles[i][0] === ArrayOfCSSFiles[i][0]) { //Jos on saman CSS tiedoston nimi
                                            MinAndMaxOfCssFiles[i].push(Temp);
                                        }
                                        // lahetaLomake5(e,Temp);
                                    });
                                }
                                if (m3) {
                                    m3.forEach((match, groupIndex) => {
                                        let mq1 = MediaQuery.indexOf(":");
                                        let mq2 = MediaQuery.indexOf(")");

                                        let str1 = MediaQuery.substr(0, mq2); //(min-width:600px
                                        let str2 = str1.substr(mq1 + 1, mq2); //600px
                                        //   let Temp = [match,str2];

                                        let str3 = MediaQuery.substr(mq2 + 1, MediaQuery.lenght); //MediaQuery

                                        let Temp = [match, str2, str3];

                                        mediaQueryArrayminH.push(Temp);
                                        if (MinAndMaxOfCssFiles[i][0] === ArrayOfCSSFiles[i][0]) { //Jos on saman CSS tiedoston nimi
                                            MinAndMaxOfCssFiles[i].push(Temp);
                                        }
                                        //lahetaLomake5(e,Temp);
                                    });
                                }
                                if (m4) {
                                    m4.forEach((match, groupIndex) => {
                                        let mq1 = MediaQuery.indexOf(":");
                                        let mq2 = MediaQuery.indexOf(")");

                                        let str1 = MediaQuery.substr(0, mq2); //(min-width:600px
                                        let str2 = str1.substr(mq1 + 1, mq2); //600px
                                        //  let Temp = [match,str2];

                                        let str3 = MediaQuery.substr(mq2 + 1, MediaQuery.lenght); //MediaQuery

                                        let Temp = [match, str2, str3];

                                        mediaQueryArraymaxH.push(Temp);
                                        if (MinAndMaxOfCssFiles[i][0] === ArrayOfCSSFiles[i][0]) { //Jos on saman CSS tiedoston nimi
                                            MinAndMaxOfCssFiles[i].push(Temp);
                                        } else {
                                            //    console.log(ArrayOfCSSFiles[i][0]);
                                        }
                                        //lahetaLomake5(e,Temp);
                                    });
                                }

                            } catch (e) {
                                console.log("Error in forEach", e);
                            }


                        }
                    }//j looppi loppuu
                    let event = document.createEvent('Event');
                    for (let j = 0; j < ArrayOfPositons[i].length; j++) {
                        if (ArrayOfPositons[i][j].includes("min-width")) {
                            ArrayOfPositons[i][j].push(mediaQueryArrayminW[0][1], mediaQueryArrayminW[0][2]);
                        } else if (ArrayOfPositons[i][j].includes("max-width")) {
                            ArrayOfPositons[i][j].push(mediaQueryArraymaxW[0][1], mediaQueryArraymaxW[0][2]);

                        } else if (ArrayOfPositons[i][j].includes("max-height")) {
                            ArrayOfPositons[i][j].push(mediaQueryArraymaxH[0][1], mediaQueryArraymaxH[0][2]);

                        } else if (ArrayOfPositons[i][j].includes("min-height")) {
                            ArrayOfPositons[i][j].push(mediaQueryArrayminH[0][1], mediaQueryArrayminH[0][2]);
                        }

                    }

                    for (let j = 0; i < ArrayOfPositons[i].length; j++) {
                        let arr2 = [];
                        let lengthType2 = [];
                        /*     lengthType2.push(refactorArr(ArrayOfPositons[j]));
                             ​
                             let mediaQueryPosition = refactorArr(ArrayOfPositons[j]);
                             ​
                             let mediaQuerySaanto1 = refactorArr(ArrayOfPositons[j]);
                             ​
                             let mediaQuerySaanto2 = refactorArr(ArrayOfPositons[j]);
                          console.log(ArrayOfPositons[j].length);*/
                        arr2.push(refactorArr(ArrayOfPositons[j]));

                        arr2.push(refactorArr(ArrayOfPositons[i][2]));
                        arr2.push(refactorArr(ArrayOfPositons[i][3]));
                        arr2.push(refactorArr(ArrayOfPositons[i][4]));

                        let lengthType = arr2[0];
                        let position = arr2[1];
                        let saanto = arr2[2];
                        let saanto2 = arr2[3];
                //        console.log(lengthType,position,saanto,saanto2);
                        try {
                           // tallennaTietokantaanMediaQuerynPosition(event, MinAndMaxOfCssFiles[i][0], arr2[j]);
                        } catch (e) { }

                        //console.log("arr2: ",arr2);
                        t1 = t1 + 1;
                    //    console.log(t1 + "Looppia");
                 //       console.log("Arr2 : ", arr2);
                    }

                    console.log("MinAndMaxOfCssFiles", MinAndMaxOfCssFiles);


                }).catch(err => {
                    console.log("Ei voi fetchaa", err);
                })
                /*     console.log( ArrayOfCSSFiles[i][0]," ,",MinAndMaxOfCssFiles[i]);
     if(ArrayOfCSSFiles[i][0] === MinAndMaxOfCssFiles[i][0]){
         console.log("TRUE!"+i);
     }*/
                // console.log("MinAndMaxOfCssFiles",MinAndMaxOfCssFiles," i: ",i);

                //  console.log("MinAndMaxOfCssFiles,i",i," , ",MinAndMaxOfCssFiles);
                //    console.log("ArrayOfPostiosn: ",ArrayOfPositons);

            } catch (e) {
                console.log("Error ", e);
            }

        }
    } // FOR LOOP

}

function testData(e) {//lähetä data nodeen
    for (let i = 0; i < mediaQueryArrayminW.length; i++) {
        if (mediaQueryArrayminW[i][1].length < 15) { //jos isompi kuin 15, niin on ei ole esim 600px
            lahetaLomake5(e, mediaQueryArrayminW[i]);
        } else {
            console.log(mediaQueryArrayminW[i][1].length);
        }
    }
    for (let i = 0; i < mediaQueryArraymaxW.length; i++) {
        if (mediaQueryArraymaxW[i][1].length < 15) {
            lahetaLomake5(e, mediaQueryArraymaxW[i]);
        }
    }
    for (let i = 0; i < mediaQueryArrayminH.length; i++) {
        if (mediaQueryArrayminH[i][1].length < 15) {
            lahetaLomake5(e, mediaQueryArrayminH[i]);
        }
    }
    for (let i = 0; i < mediaQueryArraymaxH.length; i++) {
        if (mediaQueryArraymaxH[i][1].length < 15) {
            lahetaLomake5(e, mediaQueryArraymaxH[i]);
        }
    }
}

function lahetaLomake5(evt, array) {

    evt.preventDefault();
    console.log("lähetä lomake 5()");
    // console.log(array[1], " | ", array[0]);
    const fd = {};
    fd.mediaQuery = array[2];
    fd.widthOrHeight = array[0]; //Myöhemmin, databaseen menee inttinä + "px";
    fd.lenght = array[1]; // + "px";
    const asetukset = {
        method: 'post',
        body: JSON.stringify(fd),
        headers: {
            'Content-type': 'application/json',
        },
    };
    console.log("Asetukset: ", fd);
    fetch('/checkScreenSize2', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json frontend lomake5: ", json);
    });
};

//const testiSQL2 = document.querySelector("#testiSql2");

function lahetaLomake6(evt) {

    evt.preventDefault();

    let screenSizeWidth = $("#fetchatti").width();//div3.style.width;
    let screenSizeHeight = $("#fetchatti").height();//div3.style.width;
    const fd = {};
    fd.width = screenSizeWidth;
    fd.height = screenSizeHeight;
    const asetukset = {
        method: 'post',
        body: JSON.stringify(fd),
        headers: {
            'Content-type': 'application/json',
        },
    };
    console.log("Asetukset: ", fd);
    fetch('/findMediaQuery', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json frontend lomake 6: ", json);
    });
};

//testiSQL2.addEventListener("click", function (e) { lahetaLomake6(e); });

const testiSQL3 = document.querySelector("#testiSql3");

function laheta7Useasti(evt) {
    console.log("laheta useasti sasa", ArrayOfCSSFiles.length);
    for (let i = 0; i < ArrayOfCSSFiles.length; i++) {
        //   console.log("laheta useasti ", i);
        lahetaLomake7(evt, i);
    }
}

function lahetaLomake7(evt, num) {

    evt.preventDefault();
    console.log("lähetä lomake 7 ");
    //console.log("ArrayOfCSSFiles: ",ArrayOfCSSFiles);
    const fd = {};
    fd.CssArr = ArrayOfCSSFiles[num];
    console.log(fd);
    const asetukset = {
        method: 'post',
        body: JSON.stringify(fd),
        headers: {
            'Content-type': 'application/json',
        },
    };

    fetch('/tallennaCSStiedosto', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        //console.log("json frontend lomake  7: ", json);
    });
};

testiSQL3.addEventListener("click", function (e) { laheta7Useasti(e); });

function poistaCSS() {
    console.log("Poista CSS");

    let html = div3.innerHTML;
    for (let i = 0; i < ArrayOfCSSFiles.length; i++) {
        let fiveLastChar = ArrayOfCSSFiles[i][0].slice(-2);
        let cssName = fiveLastChar + '.css';//req.body.CssArr[0]+'.css';
        console.log(ArrayOfCSSFiles[i][0]);
        console.log(cssName);
        // console.log(div3.innerHTML);
        var ret = html.replace(ArrayOfCSSFiles[i][0], 'css/' + cssName); //POISTA CSS TIEDOSTO //http://localhost/wp2/wp-content/themes/twentyseventeen/style.css?ver=5.2.4
        // http://localhost/wp/wp-content/themes/twentyseventeen/assets/images/header.jpg
        div3.innerHTML = ret; //divin sisään wp content
        // console.log(div3.innerHTML);
        cssTallennusInput.value = ret;
    }
}

function laitaTakaisinCSS() {

    var str = div3.innerHTML;
    console.log(str.includes("<link"));
    var splitInHeadTag = str.split("<link");
    var splitInHeadTag2 = splitInHeadTag[0].split(">");
    console.log(splitInHeadTag[0].toString());  // TULOSTAA: <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1">
    console.log(splitInHeadTag[1].toString());
    console.log(splitInHeadTag);
    let pituus = splitInHeadTag.length;
    console.log("Pituus: " + pituus);
    //Laita <link> tagi takaisin
    let linkTag = "<link ";
    for (let i = 0; i < pituus; i++) {
        splitInHeadTag[i] = linkTag.concat(splitInHeadTag[i]); //Laita <link tagi takaisin
    }

    //LAITA TAKAISIN ENNEN METATIETOJEN LOPPUA: splitInHeadTag[pituus-2]
    let newCSSLink = '<link rel="stylesheet" id="twentyseventeen-style-css" href="css/test.css" type="text/css" media="all"></link>';
    let tempLastString = splitInHeadTag[pituus - 1]; //ota väliaikainen viimeinen arraysta
    splitInHeadTag[pituus - 1] = newCSSLink; //laita sen tilalle uusi css linkki
    splitInHeadTag.push(tempLastString); //laajenna arrayta ja laita väliaikinen viimeiseksi uudestaan

    let newHTML = splitInHeadTag.join(' '); //Tee ararysta uusi HTML

    div3.innerHTML = newHTML;
    /*
            console.log(splitInHeadTag[pituus-1].toString()); //VIImeinen kohta mihin loppuu meta tiedot
            console.log(splitInHeadTag2[0].toString());
            console.log(splitInHeadTag2[1].toString());
            var n = str.search("<link");
        console.log("<link "+n);
        String.prototype.splice = function(idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
    
        */
    //  document.body.innerHTML = result; // "foo bar baz"

    //  let html = div3.innerHTML;
    //    var ret = html.replace('http://localhost/wp2/wp-content/themes/twentyseventeen/style.css?ver=5.2.4',''); //POISTA CSS TIEDOSTO //http://localhost/wp2/wp-content/themes/twentyseventeen/style.css?ver=5.2.4
    // div3.innerHTML = ret; //divin sisään wp content
}

function findWord4() {
    $("textarea").on('keyup', function () {
        //  let arrayOfCssLinksPositionInTextArea = [];
        //let search = false;
        // var wrongWords = new Array("asd", "I", "won't");

        // console.log(div2.value.search("asd"));

        //   const regex = /((?:https?:|www\.)[^\s]+)/g;
        const regex = RegExp("[(].css[)]");
        const str = $(this).val();

        let m = str.match(regex);

        if (m) {
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        } else {
            console.log("Not found any words");
        }
    }).keyup(); // trigger event for demo
}

function findWord3() {
    let paragraph = div2.textContent;

    let searchTerm = inputEtsi.value;
    console.log("Word: " + searchTerm);
    let indexOfFirst = paragraph.indexOf(searchTerm);
    console.log('The index of the first "' + searchTerm + '" from the beginning is ' + indexOfFirst);
    // expected output: "The index of the first "dog" from the beginning is 40"

    console.log('The index of the 2nd "' + searchTerm + '" is ' + paragraph.indexOf(searchTerm, (indexOfFirst + 1)));
}


function findBodyWord(htmlContent) {

    let first = htmlContent.search("<body>");
    let last = htmlContent.search("</body>");

    console.log("first: " + first + " | last: " + last);
}

function getLineBreaks() {
    let enteredText = div2.value;

    let numberOfLineBreaks = (enteredText.match(/\n/g) || []).length;
    let characterCount = enteredText.length + numberOfLineBreaks;

    alert('Number of breaks:  ' + numberOfLineBreaks);
}

function jqueryTest() {
    $('#divi2:contains("<body>")').html().replace('<body>', '<body><div id="mainContainer">');
}

function fetchData() {
    fetchConsole.innerHTML += "  Fetching Source Code Finished...   ";
    fetchConsole.style.color = "yellow";
    console.log("fetch data");
    fetch('http://localhost/wp2/')
        .then(function (response) {

            return response.text()
        })
        .then(function (html) {
            let parser = new DOMParser();

            let doc = parser.parseFromString(html, "text/html");

            let docArticle = doc.querySelector('article').innerHTML;

            //    console.log("HTML", html);
            console.log("--------------------------------------------------");

            // div3.innerHTML = ret; //divin sisään wp content
            div3.innerHTML = html; //divin sisään wp content
            //   console.log("Ret ",ret);
            let lineBreaksToElements = html.replace(/(\S+\s*){1,2}/g, "$&\n"); //VAIHDA TÄHÄN ret
            //   console.log("LI ", lineBreaksToElements);
            div2.textContent = lineBreaksToElements;
            //    console.log("div2.textContent = lineBreaksToElements:",lineBreaksToElements);
            findBodyWord(html);
            $("#console3").css("background-color", "white");

        })
        .then(() => {
            fetchConsole.innerHTML += "  Fetching Source Code Finished...   ";
            fetchConsole.style.color = "green";
            getCSSfiles();
        })
        .then(() => {
            fetchConsole.innerHTML += "Fetching CSS Files Finished...   ";
            fetchMediaQuery();
        })
        .then(() => {
            fetchConsole.innerHTML += "   Fetching MediaQueries Finished...   ";
        })
        .then(() => { 
            let e = document.createEvent('Event');
            lahetaLomake4(e);
        })
        .catch(function (e) {
            console.log(e);
            errorConsole.innerHTML = "<strong>Error Message:</strong> Wrong URL on localhost or XAMPP is not On. Check .htaccess rules";
            $("#console3").css("background-color", "red");
            // $("#console3").css("width","45%");
        });
}

function doWholeLoop() {

}

console.log("Fetchatti height: ", $("#sidebar").height());
