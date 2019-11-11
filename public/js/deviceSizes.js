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

device1.addEventListener("click",function() { resizeForDeviceSize(360,640); } );
device2.addEventListener("click",function() { resizeForDeviceSize(411,731); } );
device3.addEventListener("click",function() { resizeForDeviceSize(411,823); } );
device4.addEventListener("click",function() { resizeForDeviceSize(320,568); } );
device5.addEventListener("click",function() { resizeForDeviceSize(375,667); } );
device6.addEventListener("click",function() { resizeForDeviceSize(414,736); } );
device7.addEventListener("click",function() { resizeForDeviceSize(375,812); } );
device8.addEventListener("click",function() { resizeForDeviceSize(768,1024); } );
device9.addEventListener("click",function() { resizeForDeviceSize(1024,1366); } );
