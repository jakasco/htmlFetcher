
const div = document.querySelector("#divi");
const div2 = document.querySelector("#divi2");
const div3 = document.querySelector("#fetchatti");
const div4 = document.querySelector("#htmlTeksti");
const div5 = document.querySelector("#divi5");
const errorConsole = document.querySelector("#console3");
const inputEtsi = document.querySelector("#etsiSana");
const ul = document.querySelector("#ulList");

function findWord() {
    let etsittySana = findWord4();
    console.log("Etsitty sana ", etsittySana);
}

$("textarea").on('keyup', function() {
  
     // const regex = /((?:https?:|www\.)[^\s]+)/g;
      const regex = /((?:https?:|www\.)[^\s]+)/g;
      const str = $(this).val();
  
      let m = str.match(regex);

    if (m) {
        m.forEach((match, groupIndex) => {
        //    console.log(`Found match, group ${groupIndex}: ${match}`);
            const regex2 = /((?:css)[^\s]+)/g;
            const str2 = match;

            if(match.match(regex2)){
           //     console.log("Css ",match);
                $("#ulList").append(`<li>
                    <a href='${match}' target='_blank'>
                    ${match}
                    </a>
                    </li>`);
            }
        });
    }
  }).keyup(); // trigger event for demo

function getSecondPart(str) {
    return str.split('{')[1];
}
// use the function:
function vaihaCss(csss,n) {
    console.log("VAIHDA CSS ",n);
    const page = document.querySelector("#page");
    page.style = csss;
  console.log("page.style ",page.style );
    /*

    */
}

function vaihdaAlkuperainenMediaQuery(css) {
//  console.log("vaihdaAlkuperainenMediaQuery: ",css)
 window.document.body.style += css;
}

function fetchMediaQuery() {

    let ulPituus = document.querySelectorAll("#ulList li").length;
    for(let i=0; i<ulPituus; i++){
        let li = document.querySelectorAll("#ulList li")[i];
        if(i !== 2){
      //  console.log(li.textContent);
        try {
            fetch(li.textContent).then((response) => {
                return response.text();
            }).then((text) => {

           //     console.log(text);

              //  const regex = /((?:screen)[^\s]+)/g;
                const regex = /^(?=.*media).../
               // const str = text;

                // var n = text.search("(min-width:600px)");
                //console.log("N ",n);
               // let re = '/\({[^)]+}\)/';
               let re = '/\(min\)/';
                let m = text.match("@media");
                var res = text.split("@media");
               
             //   var res22 = text.split("(max-width");
            //    console.log(res);
            var vaihdaWidth = text.replace("max-width:", "min-width");
            vaihdaAlkuperainenMediaQuery(vaihdaWidth);
        //    for(let i=0; i<res22.length; i++) {

             //   var res2 = res[i].split(")");

              //  console.log("MAX-WIDTH: ",res22[i]);
        //    }


                for(let i=0; i<res.length; i++) {
                  //    let e =  res[7].split("(max-width");
                  let e = res[7].substring(2, 5);
                    console.log("CONSOLE LOG:",e
                       // res[7].replace(/(:\s*)[^\\]+\\/, '$1')
                      )
                  //  console.log(res[7]);
                    var res2 = res[i].split(")");

                    $("#ulList2").append(`<li>
                ${res[i]}
                    </li></br>`);
                  //  let csss = res[i].substr(18,res[i].length);  ALKAA MAX WIDTH
                  let csss = res[i].substr(0,res[i].length);  
                  //  console.log("css ",csss);
              //      console.log("css ",res[i]);
 /////////////////////////                   div5.textContent += res[2];
 //////////////////////////////////////                   div5.textContent += "</br>";
              //      console.log(res[i].length);
                    $("#mediaNapit").append(`<button onclick='vaihaCss("${csss}",${i})'>
                    ${i}nappi ${res2[0].substr(0,30)}
                        </button></br>`);
                }

                if (m) {
                    m.forEach((match, groupIndex) => {
                        console.log(`Found match in ${li.textContent}, group ${groupIndex}: ${match}`);
                        let m = match.match(/{[\w\d]+}/g);
                    });
                }

            }).catch(err => {
                console.log("Ei voi fetchaa");
            });
        }catch(e) {
            console.log("Error ",e);
        }
        }
    }
}

function findWord4() {
    $("textarea").on('keyup', function() {
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
    }else{
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
            div3.innerHTML = html; //divin sisään wp content

            let lineBreaksToElements = html.replace(/(\S+\s*){1,2}/g, "$&\n");
         //   console.log("LI ", lineBreaksToElements);
            div2.textContent = lineBreaksToElements;
            findBodyWord(html);
        })
        .catch(function (e) {
            console.log(e);
            errorConsole.innerHTML = "<strong>Error Message:</strong> Wrong URL on localhost or XAMPP is not On";
            $("#console3").css("background-color","red");
            $("#console3").css("width","40%");
        });
}

console.log("Fetchatti height: ", $("#sidebar").height());

