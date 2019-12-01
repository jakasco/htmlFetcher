const device1 = document.querySelector("#Galaxy");
const device2 = document.querySelector("#Pixel2");
const device3 = document.querySelector("#Pixel2XL");
const device4 = document.querySelector("#Iphone5");
const device5 = document.querySelector("#Iphone6");
const device6 = document.querySelector("#Iphone6Plus");
const device7 = document.querySelector("#IphoneX");
const device8 = document.querySelector("#Ipad");
const device9 = document.querySelector("#IpadPro");

const testiSQL = document.querySelector("#testiSql");

const testisql2 = document.querySelector("#testisql2");

const colorPicker = document.querySelector("#colorPicker");

const ulList3 = document.querySelector("#ulList3");

let activeElement = [[null], [null]];

function resizeForDeviceSize(width, height) {
	console.log("Width: ", width, " height ", height);
	$('#fetchatti').css("width", width); //Vanha on #sidebar
	$('#fetchatti').css("height", height);
	$('#console').text("Width: " + width + "px");
	$('#console2').text("Height: " + height + "px");
}

device1.addEventListener("click", function (e) { resizeForDeviceSize(360, 640); lahetaLomake3(e); });
device2.addEventListener("click", function (e) { resizeForDeviceSize(411, 731); lahetaLomake3(e); });
device3.addEventListener("click", function (e) { resizeForDeviceSize(411, 823); lahetaLomake3(e); });
device4.addEventListener("click", function (e) { resizeForDeviceSize(320, 568); lahetaLomake3(e); });
device5.addEventListener("click", function (e) { resizeForDeviceSize(375, 667); lahetaLomake3(e); });
device6.addEventListener("click", function (e) { resizeForDeviceSize(414, 736); lahetaLomake3(e); });
device7.addEventListener("click", function (e) { resizeForDeviceSize(375, 812); lahetaLomake3(e); });
device8.addEventListener("click", function (e) { resizeForDeviceSize(768, 1024); lahetaLomake3(e); });
device9.addEventListener("click", function (e) { resizeForDeviceSize(1024, 1366); lahetaLomake3(e); });

testiSQL.addEventListener("click", function (e) { testData(e); });

let fullArr = [];

const lahetaLomake3 = (evt) => {

	evt.preventDefault();
	console.log("lähetä lomake 3()");
	const fd = {};
	fd.width = $("#fetchatti").width(); //Myöhemmin, databaseen menee inttinä + "px";
	fd.height = $("#fetchatti").height(); // + "px";
	const asetukset = {
		method: 'post',
		body: JSON.stringify(fd),
		headers: {
			'Content-type': 'application/json',
		},
	};
	//   for(let i=1; i<asetukset.body i++){ //0 on pitkä css tiedosto
	console.log("asetuksetbody", asetukset.body);
	//  }
	fetch('/checkScreenSize', asetukset).then((response) => {
		return response.json();
	}).then((json) => {
		//  console.log("json frontend: ",json); //CSS TIEDOSTO
		const fetchatti = document.querySelector("#fetchatti");
		fetchatti.innerHTML = json[0].CSS_Tiedosto;
		// console.log($( "#fetchatti div" ).children().length);
		let tempArr = [];

		for (let i = 0; i < $("#fetchatti div").children().length; i++) {

			addEditingToolToElement($("#fetchatti div").children()[i], tempArr, i);

			let twoDimensionalArray = [[$("#fetchatti div").children()[i]], [true], [true], [null], [true], [false]];

			fullArr.push(twoDimensionalArray);
		}
	});
};

function poistaCSS2(CSS_File, newCssFile, num) {
	console.log("Poista CSS 2");

	let html = div3.innerHTML;
	let fiveLastChar = CSS_File.slice(-2);
	let cssName = fiveLastChar +num+ '.css';//req.body.CssArr[0]+'.css';
	console.log("CSS_File: ",CSS_File);
	
	CSS_File = CSS_File.replace("'", ""); //ylimääräinen pilkku pois lopusta
	var ret = html.replace(CSS_File, 'css/' + newCssFile); //POISTA CSS TIEDOSTO //http://localhost/wp2/wp-content/themes/twentyseventeen/style.css?ver=5.2.4
	div3.innerHTML = ret; //divin sisään wp content
	console.log(div3.innerHTML);
	cssTallennusInput.value = ret;

}

function laitaTakaisinCSS3(OldCSS,New_CSS_File) {

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
	let newCSSLink = '<link rel="stylesheet" id="twentyseventeen-style-css" href="css/'+New_CSS_File+'" type="text/css" media="all"></link>';
	let tempLastString = splitInHeadTag[pituus - 1]; //ota väliaikainen viimeinen arraysta
	splitInHeadTag[pituus - 1] = newCSSLink; //laita sen tilalle uusi css linkki
	splitInHeadTag.push(tempLastString); //laajenna arrayta ja laita väliaikinen viimeiseksi uudestaan

	let newHTML = splitInHeadTag.join(' '); //Tee ararysta uusi HTML

	div3.innerHTML = newHTML;

}

function lahetaLomake4(evt) {

	evt.preventDefault();
	console.log("lähetä lomake 4()");
	const fd = {};
	fd.width = $("#fetchatti").width(); //Myöhemmin, databaseen menee inttinä + "px";
	fd.height = $("#fetchatti").height(); // + "px";
	const asetukset = {
		method: 'post',
		body: JSON.stringify(fd),
		headers: {
			'Content-type': 'application/json',
		},
	};
	console.log(asetukset);
	fetch('/checkScreenSize', asetukset).then((response) => {
		return response.json();
	}).then((json) => {
		console.log("json frontend lomake4: ", json);
		for (let i = 0; i < json.length; i++) {
			poistaCSS2(json[i].CSS_File,json[i].NewCss,i);
		}
	}).then(() => {
		console.log("Finished CSS")
	});
};

testiSql2.addEventListener("click", function (e) { lahetaLomake4(e); });

function addEditingToolToElement(element, arr, num) {

	let className2 = $(element).attr('class'); //className2 = se kohta mihin clikataan 

	$(element).click(function (e) { //KUN painetaan Elementtiä

		arr.push(element);
		let className = $(element).attr('class');

		fullArr[num][3][0] = $('.' + className).css('backgroundColor');

		let idElementille = "id" + num;

		if (fullArr[num][1][0] == true) {

			ulList3.innerHTML += `<li>
       <button onclick="changeColor('${className}',${num}),null"> ${className} <a id=${idElementille} style="color: green; font-weight: bold;"><a> </button>
			</li></br>`;
			fullArr[num][1][0] = false; //Laita false ettei tätä lista kasva joka klikkauksella
			//		console.log("TRUE!!",fullArr[num][1][0]);
		} else {

			ulList3.innerHTML = "";
			fullArr[num][1][0] = true; //Palauta true jos tätä painetaan uudestaan sulkemisen jälkeen
			//		console.log("FALSE!!", fullArr[num][1][0]);
		}
	});


}

function changeColorFromPanel() {
	let newColor = "#" + colorPicker.value;
	return newColor;
}

function changeColor(className, num, color) {
	console.log("COLOR :", color);

	activeElement[0] = fullArr[num][0][0];
	activeElement[1] = num;

	if (fullArr[num][2][0] == true) {

		let newColor = changeColorFromPanel();
		$('.' + className).css("background-color", newColor);

		for (let i = 0; i < fullArr.length; i++) {
			//	console.log(fullArr[i][2][0]);
			try { /////////////////////////////////////////////////ACTIVE TEKSTI
				let idElementille = document.querySelector("#id" + i);
				if (activeElement[0] == fullArr[i][0][0]) {
					console.log("fullArr[i][4][0]", fullArr[i][4][0]);
					if (fullArr[i][4][0] == true) {
						idElementille.text = "  ACTIVE ";
						fullArr[i][4][0] = false;

						let className2 = $(fullArr[i][0][0]).attr('class');

						//console.log("className2 ",className2);
						try {
							//	console.log("Väri : ",fullArr[i][3][0]);
							$('.' + className2).css("background-color", fullArr[i][3][0]);
						} catch (e) {
							console.log("Errori")
						}


					} else {
						idElementille.text = "  No Active ";
						fullArr[i][4][0] = true;
					}
				} else {
					idElementille.text = "";
				}
			} catch (e) {
				console.log("Error ", e);
			}


			if (fullArr[i][2][0] == false) {
				let className2 = $(fullArr[i][0][0]).attr('class');

				//console.log("className2 ",className2);
				try {
					//	console.log("Väri : ",fullArr[i][3][0]);
					$('.' + className2).css("background-color", fullArr[i][3][0]);
				} catch (e) {
					console.log("Errori")
				}
			}
		}

		fullArr[num][2][0] = false;

		//käydään koko fullArr läpi
	} else {



		fullArr[num][2][0] = true;
		console.log("Muuta väri defultiksi");
		console.log("fullArr[num][3][0]", fullArr[num][3][0]);
		$('.' + className).css("background-color", fullArr[num][3][0]);
	}
}



function hexc(colorval) {
	var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
		parts[i] = parseInt(parts[i]).toString(16);
		if (parts[i].length == 1) parts[i] = '0' + parts[i];
	}
	color = '#' + parts.join('');
	return color;
}

function vaihdaVariElementtiin(color) {
	console.log("activeElement: ", activeElement);
	console.log("color: ", color);
	try {
		changeColor(activeElement[0], activeElement[1], color);
	} catch (e) {
		console.log("ERROR");
	}

}

function ResetAllColors() {
	for (let i = 0; i < fullArr.length; i++) {

		if (fullArr[i][4][0] == true) {
			let className2 = $(fullArr[i][0][0]).attr('class');

			try {
				$('.' + className2).css("background-color", fullArr[i][3][0]);
			} catch (e) {
				console.log("Errori")
			}
		}
	}
}
