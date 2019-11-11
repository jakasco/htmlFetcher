const device1 = document.querySelector("#Galaxy");
const device2 = document.querySelector("#Pixel2");
const device3 = document.querySelector("#Pixel2XL");
const device4 = document.querySelector("#Iphone5");
const device5 = document.querySelector("#Iphone6");
const device6 = document.querySelector("#Iphone6Plus");
const device7 = document.querySelector("#IphoneX");
const device8 = document.querySelector("#Ipad");
const device9 = document.querySelector("#IpadPro");

function resizeForDeviceSize(width,height) {
    console.log("Width: ",width," height ",height);
     $('#fetchatti').css("width",width); //Vanha on #sidebar
     $('#fetchatti').css("height",height);
     $('#console').text("Width: " +width+"px");
     $('#console2').text("Height: " +height+"px");
}

device1.addEventListener("click",function(e) { resizeForDeviceSize(360,640); lahetaLomake3(e);} );
device2.addEventListener("click",function(e) { resizeForDeviceSize(411,731);  lahetaLomake3(e);} );
device3.addEventListener("click",function(e) { resizeForDeviceSize(411,823);  lahetaLomake3(e);} );
device4.addEventListener("click",function(e) { resizeForDeviceSize(320,568);  lahetaLomake3(e); } );
device5.addEventListener("click",function(e) { resizeForDeviceSize(375,667); lahetaLomake3(e); } );
device6.addEventListener("click",function(e) { resizeForDeviceSize(414,736); lahetaLomake3(e); } );
device7.addEventListener("click",function(e) { resizeForDeviceSize(375,812); lahetaLomake3(e); } );
device8.addEventListener("click",function(e) { resizeForDeviceSize(768,1024); lahetaLomake3(e); } );
device9.addEventListener("click",function(e) { resizeForDeviceSize(1024,1366); lahetaLomake3(e); } );

let fullArr = [];

const lahetaLomake3 = (evt) => {

    evt.preventDefault();
    console.log("lähetä lomake 3()");
    const fd = {};
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
    fetch('/checkScreenSize', asetukset).then((response) => {
      return response.json();
    }).then((json) => {
     console.log("json frontend: ",json); //CSS TIEDOSTO
      const fetchatti = document.querySelector("#fetchatti");
     fetchatti.innerHTML = json[0].CSS_Tiedosto;
    // console.log($( "#fetchatti div" ).children().length);
    let tempArr = [];
    
     for (let i=0; i<$( "#fetchatti div" ).children().length; i++ ) {

         addEditingToolToElement($("#fetchatti div").children()[i],tempArr,i);
         fullArr.push($("#fetchatti div").children()[i]);
     }
     console.log(fullArr);
  //  $("#fetchatti").css("width",json[0].Width + "px");
   // $("#fetchatti").css("height",json[0].Height + "px");
    });
  };

  function addEditingToolToElement(element,arr,num) {
   // $(element).css("pointer-events","none"); //ei voi klikata, $("#ElementName").css("pointer-events","auto"); voi klikata
   // element.addEventListener("onclick",function() { changeColor();
    //});
    /*
    $("#ulList2").append(`<li>
    ${res[i]}
        </li></br>`);
        */
  //  console.log("element: ",element);
    
    $(element).click(function(e) {
        arr.push(element);
        let className = $(element).attr('class');
       // console.log("element: ",element);
        console.log("clicked: ",element);    
        console.log("tempArr: ",arr);

        $("#ulList3").append(`<li>
       <button onclick="changeColor('${className}',${num})"> ${className} </button>
            </li></br>`);
    });
    
  }

  function changeColor(className,num) {
      console.log("Change ",className,num);
      fullArr[num] = true;
      if(fullArr[num] == true){
      $('.'+className).css("background-color","red");
      fullArr[num] = false;
      }else{
        $('.'+className).css("background-color","grey");
      }
     
  }