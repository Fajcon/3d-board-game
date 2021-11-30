
document.addEventListener('clickField', () => {
    console.log('success');
})

let board = new Array();
let diagonal = 0;
const xSize = 8;
const ySize = 8;
const zSize = 3;

function init() {
    const scene = document.querySelector('scene');

    diagonal = Math.sqrt(xSize * xSize + ySize * ySize + zSize * zSize);
    for (let i = 0; i < xSize; i++) {
        board[i] = new Array();
        for (let j = 0; j < ySize; j++) {
            board[i][j] = new Array();
            for (let k = 0; k < zSize; k++) {
                board[i][j][k] = new BoardField(i, j, k);
                scene.appendChild(board[i][j][k].transformElement);
            }
        }
    }
    x3dom.reload();
}


const initButton = document.querySelector('button#init');
initButton.addEventListener('click', init, false);


class BoardField {
    constructor(i, j, k) {

        this.transformElement = document.createElement("transform");

        this.translation = i + " " + j + " " + k;
        this.transformElement.setAttribute('translation', this.translation);

        this.shapeElement = document.createElement("shape");
        this.shapeElement.setAttribute('class', 'boardField');

        this.colorR = Math.sqrt(i * i + j * j + k * k) / diagonal;
        // this.colorR = 1;
        this.colorB = Math.sqrt((i - xSize) * (i - xSize) + (j - ySize) * (j - ySize) + (k - zSize) * (k - zSize)) / diagonal;
        // this.colorB = 2;
        this.shapeElement.innerHTML =
            '<appearance>' +
            '<material diffuseColor="' + this.colorR + ' 0 ' + this.colorB + '" transparency="0.95"></material>' +
            '</appearance>';
        this.transformElement.appendChild(this.shapeElement);
        let box = document.createElement("box");
        box.setAttribute('size', '1,1,1');
        this.shapeElement.appendChild(box);
    }
}


document.onload = function () {
    // Handle mouseover event on a shape
    const boardFields = document.querySelectorAll('shape.boardField');
    boardFields.forEach(field => {
        field.setAttribute('onclick', 'changeColor()');
    })
};

/** Initializes an <x3d> root element that was added after document load. */
// x3dom.reload = function() {
//     onload();
// };