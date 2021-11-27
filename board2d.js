import {Board, Field, BoardObserver} from "./model.js";

export class BoardDisplay2d extends BoardObserver{
    constructor(parent, board) {
        super();
        let [x, y, z] = [board.sizeX, board.sizeY, board.sizeZ]
        this.fieldDivs = Array(x);
        this.board = board
        board.attachObserver(this)

        for (let i = 0; i < x; i++) {
            this.fieldDivs[i] = Array(y)
            for (let j = 0; j < y; j++) {
                this.fieldDivs[i][j] = Array(z)
            }
        }

        for (let k = 0; k < z; k++) {
            let elementBoard2d = document.createElement("div")
            parent.appendChild(elementBoard2d)
            elementBoard2d.className = "board2d"
            for (let j = 0; j < y; j++) {
                for (let i = 0; i < x; i++) {
                    let div = document.createElement("div")
                    div.className = "field"
                    div.classList.toggle((i + j)%2 ? "color1": "color2")
                    this.fieldDivs[i][j][k] = div
                    div.addEventListener("click", ()=>this.board.fields[i][j][k].click())
                    elementBoard2d.appendChild(div)

                    if(board.at(i, j, k).state === "red") {
                        this.addPawn("red", i, j, k)
                    }
                    if(board.at(i, j, k).state === "blue") {
                        this.addPawn("blue", i, j, k)
                    }
                }
            }
        }

    }

    at(field){
        return this.fieldDivs[field.x][field.y][field.z]
    }

    addPawn(color, x, y, z){
        let pawn = document.createElement("div")
        pawn.className = color === "blue" ? "bluePawn" : "redPawn"
        this.fieldDivs[x][y][z]?.appendChild(pawn)
    }

    observeMove(from, to) {
        let a = this.at(from)
        let b = this.at(to)
        b.appendChild(a.children[0])
    }

    observeHighlight(field) {
        this.at(field).classList.toggle("activated");
    }

    observeHighlightOff(field) {
        this.at(field).classList.toggle("activated");
    }

    observeKill(killed, enemies) {
        super.observeKill(killed, enemies);
    }

    observeFailedEscape(from, to, enemies) {
        super.observeFailedEscape(from, to, enemies);
    }

    observeFighting(defending, enemies) {
        super.observeFighting(defending, enemies);
    }



}

