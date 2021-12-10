import { Board, Field, BoardObserver } from "./model.js";


let diagonal = 0
let xSize = 8;
let ySize = 8;
let zSize = 3;
let board = new Array();

export class BoardDisplay3d extends BoardObserver {

    constructor() {
        super();
       
        this.initButton = document.querySelector('button#init');
        this.initButton.addEventListener('click', this.init, false);
    }

    init() {
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

    observeMove(from, to) {
        console.error("observeMove not implemented")
    }

    observeHighlight(field) {
        console.error("observeHighlight not implemented")
    }

    observeHighlightOff(field) {
        console.error("observeHighlightOff not implemented")
    }

    observeKill(killed, enemies) {
        console.error("observeKill not implemented")
    }

    observeFailedEscape(from, to, enemies) {
        console.error("observeFailedEscape not implemented")
    }

    observeFighting(defending, enemies) {
        console.error("observeFighting not implemented")
    }

}

export class BoardField {
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

        this.pawn = null;
    }
}
