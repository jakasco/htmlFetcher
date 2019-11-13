console.log($("#Navigation").children());

let arrOfChildrenElements = [];

for(let i=1;i <$("#Navigation").children().length; i++){ //alkaa 1:sta koska 0 on napit
    console.log($("#Navigation").children()[i]);
    let navElem = $("#Navigation").children()[i];
    $(navElem).hide();
    arrOfChildrenElements.push(true); //laita Kaikki napit Falseksi
}

function hideShowElement(num) {
    for(let i=1;i <$("#Navigation").children().length; i++){
        let navElem = $("#Navigation").children()[i];
        if(num == i){
            console.log(num+ ", "+i+" , elem:"+arrOfChildrenElements[num].innerHTML);
            if(arrOfChildrenElements[i+1] === true){
            $(navElem).show();
            arrOfChildrenElements[i+1] = false;
        }else{
            $(navElem).hide();
            arrOfChildrenElements[i+1] = true;
        }
    }else{
        $(navElem).hide();
    }
}
}