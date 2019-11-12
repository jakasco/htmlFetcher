const device1 = document.querySelector("#Galaxy");
const device2 = document.querySelector("#Pixel2");
const device3 = document.querySelector("#Pixel2XL");
const device4 = document.querySelector("#Iphone5");
const device5 = document.querySelector("#Iphone6");
const device6 = document.querySelector("#Iphone6Plus");
const device7 = document.querySelector("#IphoneX");
const device8 = document.querySelector("#Ipad");
const device9 = document.querySelector("#IpadPro");

const colorPicker = document.querySelector("#colorPicker");

const ulList3 = document.querySelector("#ulList3");

let activeElement = [[null],[null]];

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
   //  console.log("json frontend: ",json); //CSS TIEDOSTO
      const fetchatti = document.querySelector("#fetchatti");
     fetchatti.innerHTML = json[0].CSS_Tiedosto;
    // console.log($( "#fetchatti div" ).children().length);
    let tempArr = [];
    
     for (let i=0; i<$( "#fetchatti div" ).children().length; i++ ) {

		 addEditingToolToElement($("#fetchatti div").children()[i],tempArr,i);
		 
		 let twoDimensionalArray = [[$("#fetchatti div").children()[i]], [true], [true], [null]];

         fullArr.push(twoDimensionalArray);
     }
    });
  };

  function addEditingToolToElement(element,arr,num) {
   // $(element).css("pointer-events","none"); //ei voi klikata, $("#ElementName").css("pointer-events","auto"); voi klikata
   // element.addEventListener("onclick",function() { changeColor();
	//});
	let className2 = $(element).attr('class');
	//console.log("fullArr[num][3][0] ",fullArr[num]);
	//fullArr[num][3][0] = $('.'+className2).css('backgroundColor');

	//let backgroundColorDefault = hexc(fullArr[num][3][0]); // muuta hex
	 
  // console.log("backgroundColorDefault: ",backgroundColorDefault);
	$(element).click(function(e) { //KUN painetaan Elementtiä
		
        arr.push(element);
		let className = $(element).attr('class');
	//	console.log("Classname = ",className);

		fullArr[num][3][0] = $('.'+className).css('backgroundColor');
	//	console.log("fullArr[num][3][0] ",fullArr[num][3][0]);


		if(fullArr[num][1][0] == true){
			
        ulList3.innerHTML += `<li>
       <button onclick="changeColor('${className}',${num}),null"> ${className} </button>
			</li></br>`;
			fullArr[num][1][0] = false; //Laita false ettei tätä lista kasva joka klikkauksella
	//		console.log("TRUE!!",fullArr[num][1][0]);
		}else{
			
			ulList3.innerHTML = "";
			fullArr[num][1][0] = true; //Palauta true jos tätä painetaan uudestaan sulkemisen jälkeen
	//		console.log("FALSE!!", fullArr[num][1][0]);
		}
	});
	
    
  }





  function changeColorFromPanel() {
//	console.log("changeColorFromPanel");

//	console.log(colorPicker.value);
	let newColor = "#"+colorPicker.value;
	return newColor;
}

  function changeColor(className,num,color) {
	  console.log("COLOR :",color);
	//  console.log("Change ",fullArr[num][2][0]);
	activeElement[0] = fullArr[num][0][0];
	activeElement[1] = num;
//	console.log("ACTIVE ELEMENT: ",activeElement);
//	
//	console.log(fullArr[num][3][0]);
		if(fullArr[num][2][0] == true){
			let newColor = changeColorFromPanel();
	  $('.'+className).css("background-color",newColor);

	  for(let i=0; i<fullArr.length; i++){
		//	console.log(fullArr[i][2][0]);
			if(fullArr[i][2][0] == false){
				let className2 = $(fullArr[i][0][0]).attr('class');
	
				//console.log("className2 ",className2);
				try{
				//	console.log("Väri : ",fullArr[i][3][0]);
				 $('.'+className2).css("background-color",fullArr[i][3][0]);
				}catch(e){
					console.log("Errori")
				}
			}
		}

	  fullArr[num][2][0] = false;

	  //käydään koko fullArr läpi
	}else{
		fullArr[num][2][0] = true;
	console.log("Muuta väri defultiksi");
		console.log("fullArr[num][3][0]",fullArr[num][3][0]);
		$('.'+className).css("background-color",fullArr[num][3][0]);
	}  
  }



  function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
	color = '#' + parts.join('');
	return color;
}

function vaihdaVariElementtiin(color) {
	console.log("activeElement: ",activeElement);
	console.log("color: ",color);
	try{
	changeColor(activeElement[0],activeElement[1],color);
	}catch(e){
		console.log("ERROR");
	}
	
}

function ResetAllColors() {
	
}
/*
(function(global, undefined){

	function widthChanged(elem) {
		return elem.offsetWidth !== parseInt(elem.dataset.width);
	}

	function inRange(width, range) {
		let min = range.minWidth || 0;
		let max = range.maxWidth || Infinity;
		return width >= min && width <= max;
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	global.ElementMediaQuery = function(element, sizes) {

		if(arguments.length < 2) {
			throw('ElementMediaQuery expects 2 parameters ' + arguments.length + ' supplied.')
		}
		if(!(element instanceof Element)) {
			throw('The first argument for ElementMediaQuery must be a dom object');
		}
		if(typeof sizes !== "object") {
			throw('The second argument for ElementMediaQuery must be an object');
		}

		var $emqObj = this;
		$emqObj.element = element;
		$emqObj.sizes = sizes;

		element.dataset.width = element.offsetWidth;
		$emqObj.updateSize();

		var onWidthChange = new Event('onWidthChange');

		window.onresize = function(event) {
			if(widthChanged(element)) { 
				element.dataset.width = element.offsetWidth;
			}
		};
		var observer = new MutationObserver(function(mutations) {
		  	mutations.forEach(function(mutation) {
		  		if(widthChanged(element)) element.dataset.width = element.offsetWidth;
			    if(mutation.type === 'attributes' && mutation.attributeName === 'data-width') {		
			    	$emqObj.updateSize() 	
			    	element.dispatchEvent(onWidthChange);				    	
			    }
		 	});    
		});
		 			 
		observer.observe(element, { attributes: true, childList: true, characterData: true, subtree: true });

	}

	ElementMediaQuery.prototype.updateSize = function() {
		var range_flag = 0;
    	for (var size in this.sizes) {
			if(inRange(this.element.offsetWidth, this.sizes[size])) {
				this.element.dataset.size = size;
				range_flag = 1;
			}
		}
		if(!range_flag) this.element.dataset.size = '';
	}

	var allElements = document.querySelectorAll('[data-sizes]');

	for (var element of allElements) {
		new ElementMediaQuery(element, JSON.parse(element.dataset.sizes));
	}

})(this);

var el = new ElementMediaQuery(document.getElementById('container'), {small: {minWidth:200, maxWidth: 600}, medium: {minWidth:600, maxWidth: 800}});


document.getElementById('container').addEventListener('onWidthChange', function (e) { 
    console.log('Width Changed')
}, false);*/