'use strict';

const lomake = document.querySelector('#asd');
const input2 = document.querySelector('#input2');


//const crypt = document.querySelector('#cryptTest');

const lahetaLomake = (evt) => {

    evt.preventDefault();
    console.log(" lahetaLomake2 ()",);
    const fd = {};
    fd.cssData = input2.value;
    const asetukset = {
      method: 'post',
      body: JSON.stringify(fd),
      headers: {
        'Content-type': 'application/json',
      },
    };
    console.log("asetuksetbody",asetukset.body);
    fetch('/asd', asetukset).then((response) => {
      return response.json();
    }).then((json) => {
      console.log("json frontend decryptattu: ",json);
    });
  };
  
  lomake.addEventListener('submit',  function(event) {
    lahetaLomake(event);
});


