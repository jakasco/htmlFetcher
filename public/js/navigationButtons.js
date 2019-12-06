console.log($("#Navigation").children());

let arrOfChildrenElements = [];
let previous = null;
let previousChecker = false;

for(let i=2;i <$("#Navigation").children().length; i++){ //alkaa 1:sta koska 0 on napit
  //  console.log($("#Navigation").children()[i]);
    let navElem = $("#Navigation").children()[i];
    $(navElem).hide();
    arrOfChildrenElements.push(true); //laita Kaikki napit Falseksi
}

function hideShowElement(num) {
    for(let i=2;i <$("#Navigation").children().length; i++){
        let navElem = $("#Navigation").children()[i];
        if(num == i){
       //     console.log(num+ ", "+i+" , elem:"+arrOfChildrenElements[num].innerHTML);
            if(arrOfChildrenElements[i+2] === true){
            $(navElem).show();
            $(navElem).css("background-color","white");
            previous = navElem;
       //     console.log("Previous :", previous.innerHTML);
            arrOfChildrenElements[i+2] = false;
        }else{
            $(navElem).hide();
            arrOfChildrenElements[i+2] = true;
        }
    }else{
        $(navElem).hide();
    }
}
if(previousChecker == true){
    $(previous).hide();
    previousChecker = false;
}

}