import {Board} from "./model.js";

let board = new Board()

let c = document.querySelector("#c")

board.makeBoard(c)
board.addPawn("blue", 4, 4, 1)
board.addPawn("red", 3, 3, 1)


