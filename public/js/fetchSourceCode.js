
const div = document.querySelector("#divi");
const div2 = document.querySelector("#divi2");
const div3 = document.querySelector("#fetchatti");
const div4 = document.querySelector("#htmlTeksti");
const div5 = document.querySelector("#divi5");
const errorConsole = document.querySelector("#console3");
const inputEtsi = document.querySelector("#etsiSana");
const ul = document.querySelector("#ulList");

let ArrayOfCSSFiles = [];

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
                    console.log("Match: ",match);
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
    console.log("ContainerWidth: " + containerWidth);
    return containerWidth;
}

let mediaQueryArrayminW = [];
let mediaQueryArraymaxW = [];
let mediaQueryArrayminH = [];
let mediaQueryArraymaxH = [];

function fetchMediaQuery() { //Etsii mediaqueryt css Tiedostoista

    let ArrayOfAllMediaQueries = []; //2d array kaikista mediaqueryista

    let ulPituus = document.querySelectorAll("#ulList li").length; //Looppi missä etsitään kaikki Mediaquery listan Stringit
    for (let i = 0; i < ulPituus; i++) {
        let li = document.querySelectorAll("#ulList li")[i];
        if (i !== 2) { //Googlen css tulee cors, joten skipataan "#ulList li")[2]
            try {
                fetch(li.textContent).then((response) => {
                    return response.text();
                }).then((text) => { //text = CSS tiedosto
                    let pituusArr = ArrayOfCSSFiles.length;
                    console.log("ArrayOfCSSFiles[i]: "+i+" , ",ArrayOfCSSFiles[i]);
                         //Tallenna CSS sisältö arrayhyn
                        ArrayOfCSSFiles[i].push(text);
                   

                    let m = text.match("@media");
                    var res = text.split("@media"); //Jos Css Tiedostossa on @media sana, splitataan string tässä kohtaa

                    var vaihdaWidth = text.replace('@media', '#container[data-size="small"]');
                    vaihdaAlkuperainenMediaQuery(vaihdaWidth);

                    ArrayOfAllMediaQueries.push(res); //Lisätään tämä @media:lla splitattu stringi arrayna tähän listaan
                    /*
                    for (let i = 0; i < res.length; i++) {
                        let e = res[7].substring(2, 5);

                        var res2 = res[i].split(")");

                        let newCss = res2[1];
                        $("#ulList2").append(`<li>
                ${res[i]}
                    </li></br>`);
                        //  let csss = res[i].substr(18,res[i].length);  ALKAA MAX WIDTH
                        let csss = res[i].substr(0, res[i].length);
                        $("#mediaNapit").append(`<button onclick='vaihaCss("${csss}",${i})'>
                    ${i}nappi ${res2[0].substr(0, 30)}
                        </button></br>`);
                    }

                    if (m) {
                        m.forEach((match, groupIndex) => {
                            console.log(`Found match in ${li.textContent}, group ${groupIndex}: ${match}`);
                            let m = match.match(/{[\w\d]+}/g);
                        });
                    }
                    console.log("ArrayOfAllMediaQueries: ",ArrayOfAllMediaQueries);
                    */

                }).then(() => { //Tarkastetaan Min-Width ja Max-Width yms...
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

                                        //lahetaLomake5(e,Temp);
                                    });
                                }

                            } catch (e) {
                                console.log("Error in forEach", e);
                            }


                        }
                    }
                    console.log("mediaQueryArrayminW: ", mediaQueryArrayminW);
                    console.log("mediaQueryArraymaxW: ", mediaQueryArraymaxW);
                    console.log("mediaQueryArrayminH: ", mediaQueryArrayminH);
                    console.log("mediaQueryArraymaxH: ", mediaQueryArraymaxH);
                }).catch(err => {
                    console.log("Ei voi fetchaa");
                });
            } catch (e) {
                console.log("Error ", e);
            }
        }
    }

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
    console.log("Asetukset: ",fd);
    fetch('/checkScreenSize2', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json frontend lomake5: ", json);
    });
};

const testiSQL2 = document.querySelector("#testiSql2");

function lahetaLomake6(evt) {

    evt.preventDefault();

    let screenSize = $("#sidebar").width();//div3.style.width;
    const fd = {};
    fd.screenSize = screenSize;
    const asetukset = {
        method: 'post',
        body: JSON.stringify(fd),
        headers: {
            'Content-type': 'application/json',
        },
    };
    console.log("Asetukset: ",fd);
    fetch('/findMediaQuery', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json frontend lomake 6: ", json);
    });
};

testiSQL2.addEventListener("click",function(e) { lahetaLomake6(e); } );

const testiSQL3 = document.querySelector("#testiSql3");

function laheta7Useasti(evt) {
    console.log("laheta useasti sasa",ArrayOfCSSFiles.length);
    for(let i=0; i<ArrayOfCSSFiles.length;i++){
        console.log("laheta useasti ",i);
        lahetaLomake7(evt,i);
    }
}

function lahetaLomake7(evt,num) {

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
        console.log("json frontend lomake  7: ", json);
    });
};

testiSQL3.addEventListener("click",function(e) { laheta7Useasti(e); } );

function poistaCSS() {
    console.log("Poista CSS");

    let html = div3.innerHTML;
    for(let i=0; i<ArrayOfCSSFiles.length; i++){
     let fiveLastChar = ArrayOfCSSFiles[i][0].slice(-2);
     let cssName = fiveLastChar+'.css';//req.body.CssArr[0]+'.css';
     console.log(ArrayOfCSSFiles[i][0]);
     console.log(cssName);
    // console.log(div3.innerHTML);
    var ret = html.replace(ArrayOfCSSFiles[i][0], 'css/'+cssName); //POISTA CSS TIEDOSTO //http://localhost/wp2/wp-content/themes/twentyseventeen/style.css?ver=5.2.4
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
            getCSSfiles();
        })
        .then(() => {
            fetchConsole.innerHTML += "Fetching CSS Files Finished...   ";
            fetchMediaQuery();
        })
        .then(() => {
            fetchConsole.innerHTML += "   Fetching MediaQueries Finished...   ";
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
