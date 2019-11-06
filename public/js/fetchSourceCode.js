
const div = document.querySelector("#divi");
const div2 = document.querySelector("#divi2");
const div3 = document.querySelector("#fetchatti");
const div4 = document.querySelector("#htmlTeksti");
const inputEtsi = document.querySelector("#etsiSana");
const ul = document.querySelector("#ulList");

function findWord() {
    let etsittySana = findWord4();
    console.log("Etsitty sana ", etsittySana);
}

$("textarea").on('keyup', function() {
    //  let arrayOfCssLinksPositionInTextArea = [];
      //let search = false;
      // var wrongWords = new Array("asd", "I", "won't");
  
     // console.log(div2.value.search("asd"));
  
     // const regex = /((?:https?:|www\.)[^\s]+)/g;
      const regex = /((?:https?:|www\.)[^\s]+)/g;
      const str = $(this).val();
  
      let m = str.match(regex);
  
      if (m) {
          m.forEach((match, groupIndex) => {
              console.log(`Found match, group ${groupIndex}: ${match}`);
            //  let li = document.createElement("li");
            //  li.textContent = match;
           //   ul.appendChild(li);
           //<li><a href="/user/messages"><span class="tab">${match}</span></a></li>
           $("#ulList").append(`<li>
           <p>
           <strong>- </strong>
           </p>
           <a href='${match}' target='_blank'>
           ${match}
           </a>
           </li>`);
          });
      }else{
          console.log("Not found any words");
      }
  }).keyup(); // trigger event for demo

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

function findWord2() {
    str = div2.textContent;
    word = inputEtsi.value;
    console.log("Word: " + word);
    //    console.log("str: ",str);
    //str = "Visit W3Schools!"; 
    n = str.search(word);
    console.log("n: ", n);
    // return RegExp('\\b'+ word +'\\b').test(str)
    // return str.split(' ').some(function(w){return w === word})
    console.log(str.split(' ').some(item => word.includes(item)));
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
        });
}

console.log("Fetchatti height: ", $("#sidebar").height());

