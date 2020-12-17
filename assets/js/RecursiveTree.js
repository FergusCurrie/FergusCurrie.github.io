function drawTree(axiom){
    var context = canRT.getContext("2d");
    context.clearRect(0, 0, canRT.width, canRT.height);

    context.save();
    context.strokeStyle = "#FFc800";
    context.translate(canRT.width/2,canRT.height);
    var angle = 35;
    var length = canRT.height*0.7;
    var leafPosition = 0.75;
    var scaleChange = 0.5;
    for(var i = 0 ; i < axiom.length; i++){
        if(axiom[i] == "B"){
            doLine(context,0,0,0,-length*leafPosition);
            length *= scaleChange;
        }
        if(axiom[i] == "L"){
            doLine(context,0,0,0,-length);
        }
        if(axiom[i] == "-"){
            context.rotate(-Math.PI/180*angle);
        }
        if(axiom[i] == "+"){
            context.rotate(Math.PI/180*angle);
        }
        if(axiom[i] == "R"){
            context.translate(0,2*leafPosition*length);
            length /= scaleChange;
        }
        if(axiom[i] == "M"){
            //context.rotate(-Math.PI/180*angle);
            context.translate(0,-leafPosition*length);
        }

    }
    context.restore();
}

function createAxiom(axiom,degree){
    // Stop condition
    if(degree == 0){
       return axiom;
    }
    // each char 
    var newAxiom = "";
    for(var i = 0 ; i < axiom.length; i++){
        if(axiom[i] == "L"){
            newAxiom += "BM-L++L-M-L++L-R";
        }
        else{
             newAxiom += axiom[i];
        }
     } 
     newDegree = degree - 1;
     return createAxiom(newAxiom,newDegree);
}

// Canvas varables
var canRT = document.getElementById("myRecursiveTree");
resizeCanvasToDisplaySize(canRT);

var slider = document.getElementById("myRange");
drawTree(createAxiom("L",0));

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    drawTree(createAxiom("L",this.value));
}