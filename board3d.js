import { Board, Field, BoardObserver } from "./model.js";

let diagonal = 0
let xSize = 8;
let ySize = 8;
let zSize = 3;
let board3d = new Array();

const animationTime = 1;
const fps = 30;
const frames = fps * animationTime;

const fights = [];

export class BoardDisplay3d extends BoardObserver {

    constructor(board) {
        super();

        this.board = board;
        board.attachObserver(this)
        this.initButton = document.querySelector('button#init');
        this.initButton.addEventListener('click', () => { this.init() }, false);

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
        let spawnPawn = (x, y, z, isRed) => {
            let transform = document.createElement("Transform");
            transform.classList.add("pawn");
            let inline = document.createElement("Inline");
            inline.setAttribute("SpaceShip", "Inline");
            inline.setAttribute("mapDEFToID", true);
            transform.setAttribute("scale", "0.12 0.15 0.12");
            transform.setAttribute("translation", "" + x + " " + y + " " + z);
            transform.appendChild(inline);
            inline.setAttribute("url", "SpaceShipBlue.x3d");
            transform.setAttribute("rotation", "0.0 1.0 0.0 3.14");
            if (isRed) {
                transform.setAttribute("rotation", "1.0 0.0 0.0 3.14");
                inline.setAttribute("url", "SpaceShipRed.x3d");
            }
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
                    if (this.board.at(i, j, k).state === "red") {
                        spawnPawn(i, j, k, true)
                    } else if (this.board.at(i, j, k).state === "blue") {
                        spawnPawn(i, j, k, false)
                    }
                }
            }
        }

        x3dom.reload();
    }

    observeMove(from, to) {
        for (let i = 0; i < fights.length; i++){
            if (fights[i].def == from ||fights[i].enemy == from){
                fights[i].laserMaterial.setAttribute("transparency", '1')
                fights.splice(i, 1);
            }
        }
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
            for (let i = 1; i < frames - 1; i++) {
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
                }, frames / (animationTime * 1000))
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
        enemies.forEach((enemy) => {
            for (let i = 0; i < fights.length; i++){
                fights[i].laserMaterial.setAttribute("transparency", '1')
                if ((fights[i].def == killed && fights[i].enemy == enemy) || (fights[i].def == enemy && fights[i].enemy == killed)){
                    fights.splice(i, 1);
                }
            }
        })
    
        if (board3d[killed.x][killed.y][killed.z].pawn) {
            board3d[killed.x][killed.y][killed.z].pawn.remove();
            board3d[killed.x][killed.y][killed.z].pawn = null;
        }
    }

    observeFailedEscape(from, to, enemies) {
        console.error("observeFailedEscape not implemented")
    }

    observeFighting(defending, enemies) {
        enemies.forEach(enemy => {
            let transformCylinder = document.createElement("Transform");
            if(enemy.x != defending.x){
                transformCylinder.setAttribute("rotation", "0 0 1 1.57");
            } else if(enemy.y != defending.y){
                // transformCylinder.setAttribute("rotation", "0 1 0 1.57");
            } else if(enemy.z != defending.z){
                transformCylinder.setAttribute("rotation", "1 0 0 1.57");
            }
            let laserMaterial = document.createElement("Material");
            laserMaterial.setAttribute("diffuseColor", "0.0 1.0 0.0");
            laserMaterial.setAttribute("transparency", "1")
            let shape = document.createElement("Shape");
            transformCylinder.setAttribute("translation", ""
                + (defending.x + enemy.x) / 2 + " "
                + (defending.y + enemy.y) / 2 + " "
                + (defending.z + enemy.z) / 2);
            shape.innerHTML = `
            <Cylinder 
                bottom='true' 
                ccw='true' 
                height='1.2' 
                lit='true' 
                metadata='X3DMetadataObject' 
                radius='.01' side='true'
                solid='true' 
                subdivision='32' 
                top='true' 
                useGeoCache='true' >
            </Cylinder>
            `;
            let appearance = document.createElement("Appearance");
            appearance.appendChild(laserMaterial);
            shape.appendChild(appearance);
            transformCylinder.appendChild(shape);
            document.querySelector('scene').appendChild(transformCylinder);
            fights.push({
                "def": defending,
                "enemy": enemy,
                "laserMaterial": laserMaterial
            });
            this.animateFigth();
        })
    }

    animateFigth() {
        setTimeout(() => {
            fights.forEach(fight => {
                let transparency = parseFloat(fight.laserMaterial.getAttribute("transparency"));
                transparency = transparency + 0.05 > 1 ? transparency = 0: transparency + 0.05
                fight.laserMaterial.setAttribute("transparency", transparency)
            })
            this.animateFigth();
        },30)
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
