
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

const tallennaTietokantaanMediaQuerynPosition2 =
    (evt, cssTiedostoNimi, MediaQuery_Saanto, Position, TextToClearPosition, LastIndexToClearPosition, FullMediaQuery) => {

        evt.preventDefault;

        const fd = {};
        fd.CSS_File = cssTiedostoNimi;
        fd.MediaQuery_Saanto = MediaQuery_Saanto;//refactorArr("saanto1_", arr, 2);
        fd.Position = Position;//refactorArr("saanto2_", arr, 3);
        fd.TextToClearPosition = TextToClearPosition;//refactorArr("position", arr, 1);
        fd.LastIndexToClearPosition = LastIndexToClearPosition;
        fd.FullMediaQuery = FullMediaQuery;
        //   fd.width = $("#fetchatti").width();
        //    fd.height = $("#fetchatti").height();
        const asetukset = {
            method: 'post',
            body: JSON.stringify(fd),
            headers: {
                'Content-type': 'application/json',
            },
        };
        //  console.log("Asetukset: ", fd);
        fetch('/tallennaTietokantaanMediaQuerynPosition', asetukset).then((response) => {
            return response.json();
        }).then((json) => {
            try {
                console.log("tallennaTietokantaanMediaQuerynPosition2: ", json);
            } catch (e) {
                console.log("ERRR ", e);
            }

        });
    };

let t1 = 0;

function checkIfRelatedToMedia(mediaArr, widthArr) {
    let sum = (widthArr - mediaArr);
    // console.log("Minus: ",sum);
    if (sum < 70 && sum >= 0) {
        return true;
    } else {
        return false;
    }
}

let MinAndMaxOfCssFiles = [];

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
                    //Tallenna CSS sisältö arrayhyn
                    ArrayOfCSSFiles[i].push(text);

                    let m = text.match("@media");
                    var res = text.split("@media"); //Jos Css Tiedostossa on @media sana, splitataan string tässä kohtaa

                    var vaihdaWidth = text.replace('@media', '#container[data-size="small"]');
                    vaihdaAlkuperainenMediaQuery(vaihdaWidth);

                    ArrayOfAllMediaQueries.push(res); //Lisätään tämä @media:lla splitattu stringi arrayna tähän listaan

                    for (let i = 0; i < res.length; i++) {

                        var res2 = res[i].split(")");

                        $("#ulList2").append(`<li> 
                ${res[i]}
                    </li></br>`);
                        let csss = res[i].substr(0, res[i].length);
                        $("#mediaNapit").append(`<button onclick='vaihaCss("${csss}",${i})'>
                    ${i}nappi ${res2[0].substr(0, 30)}
                        </button></br>`);
                    }

                    if (m) { //Turha?
                        m.forEach((match, groupIndex) => {
                            let m = match.match(/{[\w\d]+}/g);
                        });
                    }
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

                    for (let j = 0; j < ArrayOfPositons[i].length; j++) {
                        if (ArrayOfPositons[i][j][0] === "@Media") {
                            MediaRows.push(ArrayOfPositons[i][j][1]);
                        }
                    }
                    MediaRows2d.push(MediaRows);
                    let event = document.createEvent('Event');
                    for (let j = 0; j < ArrayOfPositons[i].length; j++) {
                        for (let k = 0; k < MediaRows.length; k++) {
                            if (ArrayOfPositons[i][j][0] !== "@Media") {
                                let bool = checkIfRelatedToMedia(MediaRows[k], ArrayOfPositons[i][j][1]);

                                if (bool === true) {
                                    let FullMediaQuery = text.slice(MediaRows[k], MediaRows[k + 1]);

                                    let MediaQuery_Saanto = text.slice(MediaRows[k], (ArrayOfPositons[i][j][1] + 20));
                                    let n = MediaQuery_Saanto.lastIndexOf("{"); // @media screen and (min-width: 48em) { <- otetaan pois {

                                    MediaQuery_Saanto = MediaQuery_Saanto.slice(0, n); //tulostaa @media screen and (min-width: 48em)
                                    let TextToClearPosition = MediaRows[k] + n; //media query loppuu t'h'n kohtaan stringissä (numero)

                                    let lastIndextOfFullMediaQuery = FullMediaQuery.lastIndexOf("}");

                                    let LastIndexToClearPosition = MediaRows[k] + lastIndextOfFullMediaQuery;
                                    try {
                                        tallennaTietokantaanMediaQuerynPosition2(event, ArrayOfCSSFiles[i][0], MediaQuery_Saanto, MediaRows[k], TextToClearPosition, LastIndexToClearPosition, FullMediaQuery);
                                    } catch (e) {
                                        console.log("Error");
                                    }
                                }
                            }
                        }//k looppi
                    }//j looppi
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

                                        let str3 = MediaQuery.substr(mq2 + 1, MediaQuery.lenght); //MediaQuery

                                        let Temp = [match, str2, str3];

                                        mediaQueryArraymaxH.push(Temp);
                                        if (MinAndMaxOfCssFiles[i][0] === ArrayOfCSSFiles[i][0]) { //Jos on saman CSS tiedoston nimi
                                            MinAndMaxOfCssFiles[i].push(Temp);
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

                        arr2.push(refactorArr(ArrayOfPositons[j]));

                        arr2.push(refactorArr(ArrayOfPositons[i][2]));
                        arr2.push(refactorArr(ArrayOfPositons[i][3]));
                        arr2.push(refactorArr(ArrayOfPositons[i][4]));
                        t1 = t1 + 1;
                    }
                }).catch(err => {
                    console.log("Ei voi fetchaa", err);
                })
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
    fetch('/checkScreenSize2', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json", json);
    });
};

function lahetaLomake6(evt) {

    evt.preventDefault();

    let screenSizeWidth = $("#fetchatti").width();
    let screenSizeHeight = $("#fetchatti").height();
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
    fetch('/findMediaQuery', asetukset).then((response) => {
        return response.json();
    }).then((json) => {
        console.log("json frontend lomake 6: ", json);
    });
};

const testiSQL3 = document.querySelector("#testiSql3");

function laheta7Useasti(evt) {
    console.log("laheta useasti sasa", ArrayOfCSSFiles.length);
    for (let i = 0; i < ArrayOfCSSFiles.length; i++) {
        if (i !== 2) { //Googl fontti, poista kun ei enää testaus modessa
            lahetaLomake7(evt, i);
        }
    }
}

function lahetaLomake7(evt, num) {

    evt.preventDefault();
    console.log("ArrayOfCSSFiles: ", ArrayOfCSSFiles);
    const fd = {};
    fd.CssArr = ArrayOfCSSFiles[num];
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
        console.log("json lomake 7: ", json);
    });
};

testiSQL3.addEventListener("click", function (e) { laheta7Useasti(e); });

function poistaCSS() {

    let html = div3.innerHTML;
    for (let i = 0; i < ArrayOfCSSFiles.length; i++) {
        let fiveLastChar = ArrayOfCSSFiles[i][0].slice(-2);
        let cssName = fiveLastChar + '.css';//req.body.CssArr[0]+'.css';
        console.log(ArrayOfCSSFiles[i][0]);
        console.log(cssName);
        var ret = html.replace(ArrayOfCSSFiles[i][0], 'css/' + cssName);
        div3.innerHTML = ret; //divin sisään wp content
        cssTallennusInput.value = ret;
    }
}

function laitaTakaisinCSS() { //testaus funktio

    var str = div3.innerHTML;
    var splitInHeadTag = str.split("<link");
    console.log(splitInHeadTag);
    let pituus = splitInHeadTag.length;
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
    console.log("CSS Files Changed");
}


function findBodyWord(htmlContent) {

    let first = htmlContent.search("<body>");
    let last = htmlContent.search("</body>");
    console.log("first: " + first + " | last: " + last);
}

function getLineBreaks() {

    let enteredText = div2.value;
    let numberOfLineBreaks = (enteredText.match(/\n/g) || []).length;
    return numberOfLineBreaks;
}

let ArrayOfImages = [];
let ArrayOfAudio = [];
let ArrayOfVideos = [];

function getCSSMedia() { //etsi kaikki css tiedostot lähdekoodista

    const regex = /((?:https?:|www\.)[^\s]+)/g; //Etsii kaikki https tiedostot
    let html = div3.innerHTML;
    let m = html.match(regex);

    //console.log(html);
    if (m) {
        m.forEach((match, groupIndex) => {

            const regex2 = /((?:jpg)[^\s]+)/g; //jpg
            const regex3 = /((?:png)[^\s]+)/g;//png
            const regex4 = /((?:gif)[^\s]+)/g;//gif
            const regex5 = /((?:mp3)[^\s]+)/g;//mp3
            const regex6 = /((?:mp4)[^\s]+)/g;//mp4
            const regex7 = /((?:avi)[^\s]+)/g;//avi
            const str2 = match;

            if (match.match(regex2) || match.match(regex2) || match.match(regex2)) { //Lisää css tiedostot textareaan
                ArrayOfImages.push([match]);
                let poistaPilkku = match.slice(0, -1);
                $("#media").append(`<img
                src='${poistaPilkku}'
                width="130px" height="130px"
                >`);
                //  html.replace(match,match);
                //  div3.innerHTML = html;
            }
            if (match.match(regex5)) {
                ArrayOfAudio.push([match]);
                let poistaPilkku = match.slice(0, -1);
                $("#media").append(`
                <audio controls>
                 <source src=" src='${poistaPilkku}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>`);
            }
            if (match.match(regex6) || match.match(regex7)) { //Lisää css tiedostot textareaan
                ArrayOfVideos.push([match]);
                let poistaPilkku = match.slice(0, -1);
                $("#media").append(`
                <video width="200" height="150" controls>
                <sourcesrc='${poistaPilkku}' type="video/mp4">
                Your browser does not support the video tag.
                </video>`);
            }
        });
    }
    console.log("ArrayOfImages", ArrayOfImages);
}

function fetchData() {
    document.querySelector("#fetchConsoleSc").innerHTML = "Fetching Source Code...";
    document.querySelector("#fetchConsoleSc").style.backgroundColor = "yellow";
    console.log("fetch data");
    fetch('http://localhost/wp2/')
        .then(function (response) {
            return response.text()
        })
        .then(function (html) {
            let parser = new DOMParser();
            console.log("--------------------------------------------------");
            div3.innerHTML = html; //divin sisään wp content
            let lineBreaksToElements = html.replace(/(\S+\s*){1,2}/g, "$&\n"); //VAIHDA TÄHÄN ret
            div2.textContent = lineBreaksToElements;
            findBodyWord(html);
            $("#console3").css("background-color", "white");
        })
        .then(() => {
            document.querySelector("#fetchConsoleSc").innerHTML = "Fetching Source Code Finished!";
            document.querySelector("#fetchConsoleSc").style.backgroundColor = "green";
            document.querySelector("#fetchConsoleCss").innerHTML = "Fetching CSS Files...";
            document.querySelector("#fetchConsoleCss").style.backgroundColor = "yellow";
            getCSSfiles();
        })
        .then(() => {
            document.querySelector("#fetchConsoleCss").innerHTML = "Fetching CSS Files Finished!";
            document.querySelector("#fetchConsoleCss").style.backgroundColor = "green";
            document.querySelector("#fetchConsoleMq").innerHTML = "Fetching Mediaqueries...";
            document.querySelector("#fetchConsoleMq").style.backgroundColor = "yellow";
            fetchMediaQuery();
        })
        .then(() => {
            document.querySelector("#fetchConsoleMq").innerHTML = "Fetching Mediaqueries Finished!";
            document.querySelector("#fetchConsoleMq").style.backgroundColor = "green";
            document.querySelector("#fetchConsoleMf").innerHTML = "Fetching Media Files...";
            document.querySelector("#fetchConsoleMf").style.backgroundColor = "yellow";
            getCSSMedia();
        })
        .then(() => {
            document.querySelector("#fetchConsoleMf").innerHTML = "Fetching Media Files Finished!";
            document.querySelector("#fetchConsoleMf").style.backgroundColor = "green";
            document.querySelector("#fetchConsoleAllDone").innerHTML = "All Data Successfully Fetched!";
            document.querySelector("#fetchConsoleAllDone").style.backgroundColor = "green";
            let e = document.createEvent('Event');
            lahetaLomake4(e);
        })
        .catch(function (e) {
            console.log(e);
            errorConsole.innerHTML = "<strong>Error Message:</strong> Wrong URL on localhost or XAMPP is not On. Check .htaccess rules";
            $("#console3").css("background-color", "red");
        });
}
