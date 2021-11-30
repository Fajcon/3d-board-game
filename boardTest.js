import {Board, Field} from "./model.js";
import {BoardDisplay2d} from "./board2d.js"

let board = new Board()
board.at(0, 0, 0).state = "red"
board.at(0, 0, 1).state = "red"
board.at(0, 0, 2).state = "red"
board.at(7, 7, 0).state = "blue"
board.at(7, 7, 1).state = "blue"
board.at(7, 7, 2).state = "blue"


let c = document.querySelector("#c")

let bo = new BoardDisplay2d(c, board)

