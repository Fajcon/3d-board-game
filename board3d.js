import { Board, Field, BoardObserver } from "./model.js";

let diagonal = 0
let xSize = 8;
let ySize = 8;
let zSize = 3;
let board3d = new Array();

const animationTime = 3;
const fps = 30;
const frames = fps * animationTime;

export class BoardDisplay3d extends BoardObserver {

    constructor(board) {
        super();

        this.board = board;
        board.attachObserver(this)
        this.initButton = document.querySelector('button#init');
        this.initButton.addEventListener('click', () => {this.init()}, false);

        // this.movePawnButton = document.querySelector('button#movePawn');
        // this.movePawnButton.addEventListener('click', () => { this.observeMove({ x: 0, y: 0, z: 0 }, { x: 2, y: 2, z: 2 }) }, false);

        // this.highlight = document.querySelector('button#highlight');
        // this.highlight.addEventListener('click', () => { this.observeHighlight({ x: 0, y: 0, z: 0 }) }, false);

        // this.highlightOff = document.querySelector('button#highlightOff');
        // this.highlightOff.addEventListener('click', () => { this.observeHighlightOff({ x: 0, y: 0, z: 0 }) }, false);

        // this.kill = document.querySelector('button#kill');
        // this.kill.addEventListener('click', () => { this.observeKill({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }) }, false);
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

            board3d[x][y][z].pawn = transform;
        }

        const scene = document.querySelector('scene');

        diagonal = Math.sqrt(xSize * xSize + ySize * ySize + zSize * zSize);
        for (let i = 0; i < xSize; i++) {
            board3d[i] = new Array();
            for (let j = 0; j < ySize; j++) {
                board3d[i][j] = new Array();
                for (let k = 0; k < zSize; k++) {
                    board3d[i][j][k] = new BoardField(i, j, k);
                    scene.appendChild(board3d[i][j][k].transformElement);
                    if (this.board.at(i, j, k).state === "red"){
                        spawnPawn(i, j, k)
                    } else if(this.board.at(i, j, k).state === "blue"){
                        spawnPawn(i, j, k)
                    }
                }
            }
        }

        x3dom.reload();
    }

    observeMove(from, to) {
        if (board3d && board3d[from.x] && board3d[from.x][from.y] && board3d[from.x][from.y][from.z] && board3d[from.x][from.y][from.z].pawn) {
            let oldPosition = board3d[from.x][from.y][from.z].pawn.getAttribute("translation").split(" ");
            let newPosition = [to.x, to.y, to.z] 
            let positionsList = [];

            oldPosition[0] = parseFloat(oldPosition[0]);
            oldPosition[1] = parseFloat(oldPosition[1]);
            oldPosition[2] = parseFloat(oldPosition[2]);
            positionsList.push([
                oldPosition[0],
                oldPosition[1],
                oldPosition[2],
            ]);
            for (let i = 1; i < frames-1; i++) {
                positionsList.push([
                    (newPosition[0] - oldPosition[0]) / frames * i + oldPosition[0], 
                    (newPosition[1] - oldPosition[1]) / frames * i + oldPosition[1],
                    (newPosition[2] - oldPosition[2]) / frames * i + oldPosition[2],
                ]);
            }
            positionsList.push([
                newPosition[0],
                newPosition[1],
                newPosition[2],
            ]);

            let i = 1;
            function myLoop() {
                setTimeout(function () {
                    let newPositionString = "" + positionsList[i][0] + " " + positionsList[i][1] + " " + positionsList[i][2];
                    board3d[from.x][from.y][from.z].pawn.setAttribute("translation", newPositionString);
                    i++;
                    if (i < frames) {
                        myLoop();
                    } else {
                        board3d[to.x][to.y][to.z].pawn = board3d[from.x][from.y][from.z].pawn;
                        board3d[from.x][from.y][from.z].pawn = null;
                    }
                }, frames/(animationTime*1000))
            }

            myLoop();  
        }
    }

    observeHighlight(field) {
        board3d[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("diffuseColor", '1, 1, 1');
        board3d[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("transparency", '0.5');
    }

    observeHighlightOff(field) {
        board3d[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("diffuseColor", '' + this.colorR + ', 0, ' + this.colorB);
        board3d[field.x][field.y][field.z].shapeElement.querySelector("material").setAttribute("transparency", '0.95');
    }

    observeKill(killed, enemies) {
        if(board3d[killed.x][killed.y][killed.z].pawn){
            board3d[killed.x][killed.y][killed.z].pawn.remove();
            board3d[killed.x][killed.y][killed.z].pawn = null;
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
