import { Board, Field, BoardObserver } from "./model.js";


let diagonal = 0
let xSize = 8;
let ySize = 3;
let zSize = 8;
let board = new Array();

const animationTime = 3;
const fps = 30;
const frames = fps * animationTime;

export class BoardDisplay3d extends BoardObserver {

    constructor() {
        super();

        this.initButton = document.querySelector('button#init');
        this.initButton.addEventListener('click', this.init, false);

        this.movePawnButton = document.querySelector('button#movePawn');
        this.movePawnButton.addEventListener('click', () => { this.observeMove({ x: 0, y: 0, z: 0 }, { x: 2, y: 2, z: 2 }) }, false);

        this.highlight = document.querySelector('button#highlight');
        this.highlight.addEventListener('click', () => { this.observeHighlight({ x: 0, y: 0, z: 0 }) }, false);

        this.highlightOff = document.querySelector('button#highlightOff');
        this.highlightOff.addEventListener('click', () => { this.observeHighlightOff({ x: 0, y: 0, z: 0 }) }, false);

        this.kill = document.querySelector('button#kill');
        this.kill.addEventListener('click', () => { this.observeKill({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }) }, false);
    }

    init() {
        let spawnPawn = (x, y, z) => {
            var transform = document.createElement("Transform");
            transform.classList.add("pawn");
            var inline = document.createElement("Inline");
            inline.setAttribute("SpaceShip", "Inline");
            inline.setAttribute("mapDEFToID", true);
            transform.setAttribute("scale", "0.12 0.15 0.12");
            transform.setAttribute("rotation", "0.0 1.0 0.0 1.5708");
            transform.setAttribute("translation", "" + x + " " + y + " " + z);
            transform.appendChild(inline);
            inline.setAttribute("url", "SpaceShip.x3d");
            document.querySelector('scene').appendChild(transform);

            board[0][0][0].pawn = transform;
        }

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

        spawnPawn(-0.25, 0, 0)
        x3dom.reload();
    }

    observeMove(from, to) {
        if (board && board[from.x] && board[from.x][from.y] && board[from.x][from.y][from.z] && board[from.x][from.y][from.z].pawn) {
            let oldPosition = board[from.x][from.y][from.z].pawn.getAttribute("translation").split(" ");
            let newPosition = [to.x - (0.25 * to.x), to.y, to.z]  //TODO remove -0.25
            let positionsList = [];

            for (let i = 0; i <= frames; i++) {
                positionsList.push([
                    (newPosition[0] - oldPosition[0]) / frames * i,
                    (newPosition[1] - oldPosition[1]) / frames * i,
                    (newPosition[2] - oldPosition[2]) / frames * i,
                ]);
            }

            let i = 1;
            function myLoop() {
                setTimeout(function () {
                    let newPositionString = "" + positionsList[i][0] + " " + positionsList[i][1] + " " + positionsList[i][2];
                    board[from.x][from.y][from.z].pawn.setAttribute("translation", newPositionString);
                    i++;
                    if (i < frames) {
                        myLoop();
                    } else {
                        board[to.x][to.y][to.z].pawn = board[from.x][from.y][from.z].pawn;
                        board[from.x][from.y][from.z].pawn = null;
                    }
                }, frames/(animationTime*1000))
            }

            myLoop();  
        }
    }

    observeHighlight(field) {
        board[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("diffuseColor", '1, 1, 1');
        board[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("transparency", '0.5');
    }

    observeHighlightOff(field) {
        board[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("diffuseColor", '' + this.colorR + ', 0, ' + this.colorB);
        board[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("transparency", '0.95');
    }

    observeKill(killed, enemies) {
        if(board[killed.x][killed.y][killed.z].pawn){
            board[killed.x][killed.y][killed.z].pawn.remove();
            board[killed.x][killed.y][killed.z].pawn = null;
        }
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
            '<material diffuseColor="' + this.colorR + ', 0, ' + this.colorB + '" transparency="0.95"></material>' +
            '</appearance>';
        this.transformElement.appendChild(this.shapeElement);
        let box = document.createElement("box");
        box.setAttribute('size', '1,1,1');
        this.shapeElement.appendChild(box);

        this.pawn = null;
    }
}
