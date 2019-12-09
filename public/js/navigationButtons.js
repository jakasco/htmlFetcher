console.log($("#Navigation").children());

let arrOfChildrenElements = [];
let previous = null;
let previousChecker = false;
let arrOfNavButtons = [];

for (let i = 2; i < $("#Navigation").children().length; i++) { //alkaa 1:sta koska 0 on napit
    let navElem = $("#Navigation").children()[i];
    $(navElem).hide();
    $(navElem).css("height", 0);
    arrOfChildrenElements.push(true); //laita Kaikki napit Falseksi
}
for (let i = 2; i < $("#navButtons").children().length; i++) { //alkaa 1:sta koska 0 on napit
    let navElem = $("#navButtons").children()[i];
    arrOfChildrenElements.push(true); //laita Kaikki napit Falseksi
}
let active = 0;
let active3 = 0;
function hideShowElement(num, height) {
    active = num;
    //document.querySelector("#console6").innerHTML = "Active: "+ active + " active3 " + active3;
    if (active === active3) {
        let navElem2 = $("#Navigation").children()[active3];
    //    document.querySelector("#console7").innerHTML = "active === active3 = true";
      //  $(navElem2).hide();
       // arrOfChildrenElements[num].css("height", 0);
      // $(navElem2).show();
      // $(navElem2).css("height", 0);
       return moveContainer2(navElem2, 0,true,height);
      } else {
      
        for (let i = 2; i < $("#Navigation").children().length; i++) {
            let navElem = $("#Navigation").children()[i];
            let navButton = $("#navButtons").children()[i];
            if (num == i) {
             //   document.querySelector("#console7").innerHTML = "active === active3 = False , height "+height;
               if (arrOfChildrenElements[i + 2] === true) {
                    $(navElem).show();
                    $(navElem).css("background-color", "white");
                    $(navButton).css("background-color", "white");
                    previous = navElem;
                    arrOfChildrenElements[i + 2] = false;
                    arrOfNavButtons[i + 2] = false;
                    return moveContainer2(navElem, active,false,height);
               } else {
                    $(navElem).hide();
                    $(navElem).css("height", 0);
                    $(navButton).css("background-color", "white");
                    arrOfChildrenElements[i + 2] = true;
                    arrOfNavButtons[i + 2] = true;
                //    return moveContainer2(navElem, active,false,0);
                }
            } else {
                $(navElem).hide();
                $(navElem).css("height", 0);
                $(navButton).css("background-color", "grey");
              //  return moveContainer2(navElem, active,false,0);
               
            }
        }

        if (previousChecker == true) {
              $(previous).hide();
        //    $(previous).hide();
            previousChecker = false;
         //   return moveContainer2(null, active,false);
        }
    }
}

function moveContainer(n) {
    document.getElementById("fetchattuMain").style.marginTop = n + "px";
}

function moveElem(elem) {
 //   moveContainer($(activeElem).height());
 moveContainer(0);
    elem.css("height", 0);
}

const listOfElemTops = [];

function moveContainer2(activeElem, active2, bool,height) {
    active3 = active2;
    let elem2 = $("#Navigation").children()[active3];
  //  console.log("height: " + $(activeElem).height());//activeElem.style.height);
 //   console.log("activeElem: ", activeElem);
 //   document.querySelector("#console5").innerHTML = " active2: " + active + " active3 " + active3+"  bool: " + bool+ " ,height: "+height;
  //  document.querySelector("#console5").innerHTML = " activeElem id: " + activeElem.id + " elem2 " + elem2.id;
 //   arrOfChildrenElements[activeElem].css("height", height+"px");
   // $(arrOfChildrenElements[activeElem]).show();
  //  arrOfChildrenElements[active3].css("height", height+"px");
  //  
  if(arrOfChildrenElements[active2 + 2]===true){
    
    $(activeElem).css("height", height + "px");
    $(activeElem).show();
  }else{
    $(elem2).hide();
    $(elem2).css("height", 0);
  }

     if (bool === true) {
        $(activeElem).css("height", 0);
        $(activeElem).hide();
  //      document.querySelector("#console6").innerHTML = "hide ALL";
        moveContainer(0);
    } else {
        //moveContainer(activeElem).height());
     //   document.querySelector("#console6").innerHTML = "show...";
        $(elem2).hide();
        $(elem2).css("height", 0);
        $(activeElem).css("height", height + "px");
        $(activeElem).show();
        moveContainer(height);
   //     moveContainer(0);
    }

    /*
    if(active===false){
    document.getElementById("mySfetchattuMainidenav").style.marginTop = "10px";
    }else{
     let currentTop = document.getElementById("mySfetchattuMainidenav").style.marginTop;
     console.log("currentTop: "+currentTop);
     let amountToMove = 0;
     if(nextElemTop > currentTop){
        amountToMove = nextElemTop-currentTop;
     }else{
        amountToMove = currentTop-nextElemTop;
     }
     moveContainer(amountToMove)
    }*/
  //  return checkActive(active)
}

