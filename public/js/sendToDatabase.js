'use strict';

const lomake = document.querySelector('#asd');
const input2 = document.querySelector('#input2');


//const crypt = document.querySelector('#cryptTest');

const lahetaLomake = (evt) => {

    evt.preventDefault();
    const fd = {};
    fd.cssData = input2.value;
    fd.width = $("#fetchatti").width(); //Myöhemmin, databaseen menee inttinä + "px";
    fd.height= $("#fetchatti").height(); // + "px";
    const asetukset = {
      method: 'post',
      body: JSON.stringify(fd),
      headers: {
        'Content-type': 'application/json',
      },
    };
 //   for(let i=1; i<asetukset.body i++){ //0 on pitkä css tiedosto
   console.log("asetuksetbody",asetukset.body);
  //  }
    fetch('/asd', asetukset).then((response) => {
      return response.json();
    }).then((json) => {
     console.log("json frontend: ",json[0]); //CSS TIEDOSTO
      const fetchatti = document.querySelector("#fetchatti");
      fetchatti.innerHTML = json[0].CSS_Tiedosto;
      $("#fetchatti").css("width",json[0].Width + "px");
      $("#fetchatti").css("height",json[0].Height + "px");
    });
  };
  
  lomake.addEventListener('submit',  function(event) {
    lahetaLomake(event);
});


