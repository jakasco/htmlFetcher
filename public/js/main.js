'use strict';

const lomake = document.querySelector('#testi');
const input = document.querySelector('#us');
const input2 = document.querySelector('#cryptTest1')
const crypt = document.querySelector('#cryptTest');

console.log("skripti mai ladattu");

const lahetaLomake = (evt) => {

  evt.preventDefault();
  console.log("lahetaLOmake()",);
  const fd = {};
  fd.testformdata = input.value;
//  const fd = new FormData(lomake);
  console.log(fd.values);
  const asetukset = {
    method: 'post',
    body: JSON.stringify(fd),
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(asetukset.body);
  fetch('/test2', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
  console.log("json frontend: ",json);
  });
};

lomake.addEventListener('submit', lahetaLomake);

/////////////////////////////////////////////CRYPTAUS
const lahetaLomake2 = (evt) => {

  evt.preventDefault();
  console.log(" lahetaLomake2 ()",);
  const fd = {};
  fd.testformdata = input2.value;
//  const fd = new FormData(lomake);
  console.log(fd.values);
  const asetukset = {
    method: 'post',
    body: JSON.stringify(fd),
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log("asetuksetbody",asetukset.body);
  fetch('/cryptTest', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    console.log("json frontend decryptattu: ",json);
  });
};

crypt.addEventListener('submit', lahetaLomake2);
function closeModal() {
  console.log("Image sent!");
}

const lahetaLomake5 = (evt) => {
  evt.preventDefault();
  const fd = {};
  fd.kuvaId = "asdsadsadadas";
  const asetukset = {
    method: 'post',
    body: JSON.stringify(fd),
    headers: {
      'Content-type': 'application/json',
    },
  };
  fetch('/report', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    alert(json);
  });
};

report.addEventListener('submit', function(event) {
  lahetaLomake5(event);});