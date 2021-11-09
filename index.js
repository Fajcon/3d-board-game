
function changeColor() {
    if(document.getElementById("color").getAttribute('diffuseColor')=="1 0 0")
        document.getElementById("color").setAttribute('diffuseColor', '0 0 1');
    else
        document.getElementById("color").setAttribute('diffuseColor', '1 0 0');
}

let board = new Array();

function init() {
    const scene = document.querySelector('scene');

    const size = 3;
    for(let i = 0; i < size; i++){
        board[i] = new Array();
        for(let j = 0; j < size; j++){
            board[i][j] = new Array();
            for(let k = 0; k < size; k++){
                board[i][j][k] = new BoardField(i + " " + j + " " + k);
                scene.appendChild(board[i][j][k].transformElement);
            }
        }
    }    
    x3dom.reload();
}


const initButton = document.querySelector('button#init');
initButton.addEventListener('click', init,  false);


class BoardField {
    constructor(translation) {
        this.transformElement = document.createElement("transform");
        if (translation) {
            this.transformElement.setAttribute('translation', translation);
        }
        this.shapeElement = document.createElement("shape");
        this.shapeElement.setAttribute('class', 'boardField');
        this.shapeElement.innerHTML = 
        '<appearance>'+
                '<material diffuseColor="1 0 0" transparency="0.9"></material>'+
        '</appearance>';
        this.transformElement.appendChild(this.shapeElement);
        let box = document.createElement("box");
        box.setAttribute('size','1,1,1');
        this.shapeElement.appendChild(box);
    }
}






document.onload = function() {
    // Handle mouseover event on a shape
    const boardFields = document.querySelectorAll('shape.boardField');
    boardFields.forEach(field => {
        field.addEventListener('click', changeColor,  false);
    })
};

/** Initializes an <x3d> root element that was added after document load. */
// x3dom.reload = function() {
//     onload();
// };